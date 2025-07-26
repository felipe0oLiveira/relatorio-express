from fastapi import APIRouter, HTTPException, Query
from app.dependencies.auth import CurrentUser
from app.services.supabase_client import supabase
from typing import Optional, List
from datetime import datetime, timedelta
import json

router = APIRouter()

class AuditLogger:
    @staticmethod
    async def log_action(
        user_id: str,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
        ip_address: Optional[str] = None
    ):
        """Registra uma ação do usuário no sistema"""
        try:
            log_entry = {
                "user_id": user_id,
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "details": json.dumps(details) if details else None,
                "ip_address": ip_address,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            supabase.table("audit_logs").insert(log_entry).execute()
            
        except Exception as e:
            print(f"❌ Erro ao registrar log: {e}")

@router.get("/logs/audit")
async def get_audit_logs(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    current_user: str = CurrentUser
):
    """Lista logs de auditoria do usuário"""
    try:
        query = supabase.table("audit_logs").select("*").eq("user_id", current_user)
        
        if start_date:
            query = query.gte("timestamp", start_date)
        if end_date:
            query = query.lte("timestamp", end_date)
        if action:
            query = query.eq("action", action)
        if resource_type:
            query = query.eq("resource_type", resource_type)
        
        response = query.order("timestamp", desc=True).limit(limit).execute()
        
        # Processar logs para melhor legibilidade
        processed_logs = []
        for log in response.data:
            processed_log = {
                "id": log.get("id"),
                "action": log.get("action"),
                "resource_type": log.get("resource_type"),
                "resource_id": log.get("resource_id"),
                "timestamp": log.get("timestamp"),
                "ip_address": log.get("ip_address"),
                "details": json.loads(log.get("details")) if log.get("details") else None
            }
            processed_logs.append(processed_log)
        
        return {
            "logs": processed_logs,
            "total": len(processed_logs),
            "filters": {
                "start_date": start_date,
                "end_date": end_date,
                "action": action,
                "resource_type": resource_type
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs/activity")
async def get_user_activity(
    period: str = Query("7d", description="Período: 1d, 7d, 30d, 90d"),
    current_user: str = CurrentUser
):
    """Resumo de atividade do usuário"""
    try:
        # Calcular período
        end_date = datetime.utcnow()
        if period == "1d":
            start_date = end_date - timedelta(days=1)
        elif period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=7)
        
        # Buscar logs do período
        response = supabase.table("audit_logs").select("*").eq("user_id", current_user).gte("timestamp", start_date.isoformat()).execute()
        
        # Análise de atividade
        activity_summary = {
            "total_actions": len(response.data),
            "actions_by_type": {},
            "actions_by_day": {},
            "most_active_hour": None,
            "recent_actions": []
        }
        
        if response.data:
            # Contar ações por tipo
            for log in response.data:
                action = log.get("action", "unknown")
                activity_summary["actions_by_type"][action] = activity_summary["actions_by_type"].get(action, 0) + 1
            
            # Ações por dia
            for log in response.data:
                date = log.get("timestamp", "")[:10]  # YYYY-MM-DD
                activity_summary["actions_by_day"][date] = activity_summary["actions_by_day"].get(date, 0) + 1
            
            # Hora mais ativa
            hour_counts = {}
            for log in response.data:
                timestamp = datetime.fromisoformat(log.get("timestamp", "").replace("Z", "+00:00"))
                hour = timestamp.hour
                hour_counts[hour] = hour_counts.get(hour, 0) + 1
            
            if hour_counts:
                most_active_hour = max(hour_counts, key=hour_counts.get)
                activity_summary["most_active_hour"] = most_active_hour
            
            # Ações recentes (últimas 10)
            recent_logs = sorted(response.data, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]
            activity_summary["recent_actions"] = [
                {
                    "action": log.get("action"),
                    "resource_type": log.get("resource_type"),
                    "timestamp": log.get("timestamp")
                }
                for log in recent_logs
            ]
        
        return activity_summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs/security")
async def get_security_logs(
    current_user: str = CurrentUser
):
    """Logs de segurança do usuário"""
    try:
        # Buscar logs de segurança (login, logout, tentativas de acesso)
        security_actions = ["login", "logout", "failed_login", "password_change", "profile_update"]
        
        response = supabase.table("audit_logs").select("*").eq("user_id", current_user).in_("action", security_actions).order("timestamp", desc=True).limit(50).execute()
        
        security_summary = {
            "total_security_events": len(response.data),
            "events_by_type": {},
            "recent_events": [],
            "failed_login_attempts": 0,
            "last_login": None
        }
        
        if response.data:
            for log in response.data:
                action = log.get("action", "unknown")
                security_summary["events_by_type"][action] = security_summary["events_by_type"].get(action, 0) + 1
                
                if action == "failed_login":
                    security_summary["failed_login_attempts"] += 1
                elif action == "login":
                    if not security_summary["last_login"]:
                        security_summary["last_login"] = log.get("timestamp")
            
            # Eventos recentes
            security_summary["recent_events"] = [
                {
                    "action": log.get("action"),
                    "timestamp": log.get("timestamp"),
                    "ip_address": log.get("ip_address"),
                    "details": json.loads(log.get("details")) if log.get("details") else None
                }
                for log in response.data[:10]
            ]
        
        return security_summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/logs/clear")
async def clear_old_logs(
    days: int = Query(90, description="Manter logs dos últimos X dias"),
    current_user: str = CurrentUser
):
    """Remove logs antigos do usuário"""
    try:
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        # Deletar logs antigos
        response = supabase.table("audit_logs").delete().eq("user_id", current_user).lt("timestamp", cutoff_date).execute()
        
        return {
            "message": f"Logs antigos removidos (anteriores a {cutoff_date})",
            "deleted_count": len(response.data) if response.data else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs/export")
async def export_logs(
    format: str = Query("json", description="Formato: json, csv"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: str = CurrentUser
):
    """Exporta logs do usuário"""
    try:
        query = supabase.table("audit_logs").select("*").eq("user_id", current_user)
        
        if start_date:
            query = query.gte("timestamp", start_date)
        if end_date:
            query = query.lte("timestamp", end_date)
        
        response = query.order("timestamp", desc=True).execute()
        
        if format == "json":
            return {
                "logs": response.data,
                "export_info": {
                    "user_id": current_user,
                    "export_date": datetime.utcnow().isoformat(),
                    "total_logs": len(response.data),
                    "date_range": {"start": start_date, "end": end_date}
                }
            }
        elif format == "csv":
            # TODO: Implementar exportação CSV
            raise HTTPException(status_code=501, detail="Exportação CSV não implementada ainda")
        else:
            raise HTTPException(status_code=400, detail="Formato não suportado")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 