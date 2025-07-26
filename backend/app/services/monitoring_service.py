import time
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict, deque
import json
from app.services.supabase_client import supabase

class ApplicationMetrics:
    def __init__(self):
        self.metrics_history = {
            "response_times": deque(maxlen=100),
            "request_count": deque(maxlen=100),
            "error_count": deque(maxlen=100),
            "active_users": deque(maxlen=100),
            "analyses_performed": deque(maxlen=100)
        }
        self.endpoint_metrics = defaultdict(lambda: {
            "count": 0,
            "avg_response_time": 0,
            "error_count": 0,
            "last_accessed": None
        })
        self.user_activity = defaultdict(lambda: {
            "last_activity": None,
            "request_count": 0,
            "files_uploaded": 0,
            "analyses_performed": 0,
            "session_duration": 0
        })
        self.business_metrics = {
            "total_users": 0,
            "total_analyses": 0,
            "successful_analyses": 0,
            "failed_analyses": 0,
            "popular_templates": defaultdict(int),
            "user_retention": defaultdict(int)
        }
    
    def record_metric(self, metric_type: str, value: float):
        """Registra uma métrica da aplicação"""
        timestamp = datetime.utcnow()
        self.metrics_history[metric_type].append({
            "timestamp": timestamp.isoformat(),
            "value": value
        })
    
    def record_endpoint_usage(self, endpoint: str, response_time: float, success: bool):
        """Registra uso de endpoint"""
        metrics = self.endpoint_metrics[endpoint]
        metrics["count"] += 1
        metrics["last_accessed"] = datetime.utcnow().isoformat()
        
        # Calcular tempo médio de resposta
        if metrics["avg_response_time"] == 0:
            metrics["avg_response_time"] = response_time
        else:
            metrics["avg_response_time"] = (metrics["avg_response_time"] + response_time) / 2
        
        if not success:
            metrics["error_count"] += 1
            self.record_metric("error_count", 1)
        
        self.record_metric("response_times", response_time)
        self.record_metric("request_count", 1)
    
    def record_user_activity(self, user_id: str, activity_type: str):
        """Registra atividade do usuário"""
        user_data = self.user_activity[user_id]
        user_data["last_activity"] = datetime.utcnow().isoformat()
        user_data["request_count"] += 1
        
        if activity_type == "file_upload":
            user_data["files_uploaded"] += 1
        elif activity_type == "analysis":
            user_data["analyses_performed"] += 1
            self.business_metrics["total_analyses"] += 1
        elif activity_type == "login":
            self.business_metrics["user_retention"][user_id] += 1
    
    def record_analysis_result(self, analysis_type: str, success: bool, template_used: str = None):
        """Registra resultado de análise"""
        if success:
            self.business_metrics["successful_analyses"] += 1
        else:
            self.business_metrics["failed_analyses"] += 1
        
        if template_used:
            self.business_metrics["popular_templates"][template_used] += 1
        
        self.record_metric("analyses_performed", 1)
    
    def get_application_health(self) -> Dict:
        """Retorna saúde da aplicação"""
        # Calcular métricas de performance
        recent_requests = list(self.metrics_history["request_count"])[-10:]
        recent_errors = list(self.metrics_history["error_count"])[-10:]
        recent_response_times = list(self.metrics_history["response_times"])[-10:]
        
        total_requests = sum(recent_requests) if recent_requests else 0
        total_errors = sum(recent_errors) if recent_errors else 0
        avg_response_time = sum(recent_response_times) / len(recent_response_times) if recent_response_times else 0
        
        error_rate = (total_errors / total_requests * 100) if total_requests > 0 else 0
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": self._get_health_status(error_rate, avg_response_time),
            "error_rate": round(error_rate, 2),
            "avg_response_time": round(avg_response_time, 3),
            "active_users": len([u for u in self.user_activity.values() 
                               if u["last_activity"] and 
                               datetime.fromisoformat(u["last_activity"]) > datetime.utcnow() - timedelta(minutes=30)]),
            "total_requests_last_10": total_requests
        }
    
    def _get_health_status(self, error_rate: float, response_time: float) -> str:
        """Determina status de saúde baseado nas métricas da aplicação"""
        if error_rate > 5 or response_time > 5.0:
            return "critical"
        elif error_rate > 2 or response_time > 2.0:
            return "warning"
        else:
            return "healthy"
    
    def get_performance_metrics(self) -> Dict:
        """Retorna métricas de performance da aplicação"""
        # Top endpoints por uso
        top_endpoints = sorted(
            self.endpoint_metrics.items(),
            key=lambda x: x[1]["count"],
            reverse=True
        )[:10]
        
        # Calcular throughput
        recent_requests = list(self.metrics_history["request_count"])[-60:]  # Últimos 60 registros
        requests_per_minute = sum(recent_requests) if recent_requests else 0
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "requests_per_minute": requests_per_minute,
            "avg_response_time": self._calculate_avg_response_time(),
            "error_rate": self._calculate_error_rate(),
            "top_endpoints": [
                {
                    "endpoint": endpoint,
                    "count": metrics["count"],
                    "avg_response_time": round(metrics["avg_response_time"], 3),
                    "error_count": metrics["error_count"],
                    "last_accessed": metrics["last_accessed"]
                }
                for endpoint, metrics in top_endpoints
            ],
            "active_users": len([u for u in self.user_activity.values() 
                               if u["last_activity"] and 
                               datetime.fromisoformat(u["last_activity"]) > datetime.utcnow() - timedelta(minutes=30)])
        }
    
    def _calculate_avg_response_time(self) -> float:
        """Calcula tempo médio de resposta"""
        recent_times = list(self.metrics_history["response_times"])[-20:]
        return sum(recent_times) / len(recent_times) if recent_times else 0
    
    def _calculate_error_rate(self) -> float:
        """Calcula taxa de erro"""
        recent_requests = list(self.metrics_history["request_count"])[-20:]
        recent_errors = list(self.metrics_history["error_count"])[-20:]
        
        total_requests = sum(recent_requests) if recent_requests else 0
        total_errors = sum(recent_errors) if recent_errors else 0
        
        return (total_errors / total_requests * 100) if total_requests > 0 else 0

class DatabaseMonitor:
    def __init__(self):
        self.last_check = None
        self.connection_status = "unknown"
    
    async def check_database_health(self) -> Dict:
        """Verifica saúde da conexão com Supabase"""
        try:
            start_time = time.time()
            
            # Teste simples de conexão - sem await
            response = supabase.table("reports").select("id").limit(1).execute()
            
            response_time = time.time() - start_time
            
            self.connection_status = "healthy"
            self.last_check = datetime.utcnow().isoformat()
            
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "status": "healthy",
                "response_time": round(response_time, 3),
                "last_check": self.last_check,
                "message": "Conexão com Supabase estabelecida"
            }
            
        except Exception as e:
            self.connection_status = "error"
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "status": "error",
                "error": str(e),
                "last_check": self.last_check,
                "message": "Erro na conexão com Supabase - verifique se as tabelas foram criadas"
            }
    
    async def get_database_metrics(self) -> Dict:
        """Retorna métricas do banco de dados"""
        try:
            # Tentar contar registros nas tabelas principais
            table_counts = {}
            
            tables_to_check = ['reports', 'templates', 'user_settings', 'analyses']
            
            for table in tables_to_check:
                try:
                    result = supabase.table(table).select("id", count="exact").execute()
                    table_counts[table] = result.count if hasattr(result, 'count') else 0
                except Exception as table_error:
                    table_counts[table] = f"Erro: {str(table_error)[:50]}..."
            
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "connection_status": self.connection_status,
                "table_counts": table_counts,
                "last_check": self.last_check,
                "message": "Métricas coletadas (algumas tabelas podem não existir)"
            }
            
        except Exception as e:
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "connection_status": "error",
                "error": str(e),
                "last_check": self.last_check,
                "message": "Erro ao coletar métricas do banco"
            }

class BusinessMetrics:
    def __init__(self):
        self.analysis_history = deque(maxlen=1000)
        self.user_sessions = defaultdict(list)
        self.daily_metrics = defaultdict(lambda: {
            "analyses": 0,
            "users": set(),
            "success_rate": 0
        })
    
    def record_analysis(self, analysis_type: str, success: bool, user_id: str = None):
        """Registra análise realizada"""
        timestamp = datetime.utcnow()
        date_key = timestamp.strftime("%Y-%m-%d")
        
        self.analysis_history.append({
            "timestamp": timestamp.isoformat(),
            "type": analysis_type,
            "success": success,
            "user_id": user_id
        })
        
        # Atualizar métricas diárias
        self.daily_metrics[date_key]["analyses"] += 1
        if user_id:
            self.daily_metrics[date_key]["users"].add(user_id)
    
    def record_user_activity(self, user_id: str):
        """Registra atividade do usuário"""
        timestamp = datetime.utcnow()
        self.user_sessions[user_id].append(timestamp.isoformat())
    
    async def get_business_insights(self) -> Dict:
        """Retorna insights de negócio"""
        # Calcular métricas dos últimos 7 dias
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        recent_analyses = [
            analysis for analysis in self.analysis_history
            if datetime.fromisoformat(analysis["timestamp"]) >= start_date
        ]
        
        # Métricas de análise
        total_analyses = len(recent_analyses)
        successful_analyses = len([a for a in recent_analyses if a["success"]])
        success_rate = (successful_analyses / total_analyses * 100) if total_analyses > 0 else 0
        
        # Análise por tipo
        analysis_types = defaultdict(int)
        for analysis in recent_analyses:
            analysis_types[analysis["type"]] += 1
        
        # Usuários únicos
        unique_users = len(set(a["user_id"] for a in recent_analyses if a["user_id"]))
        
        # Crescimento diário
        daily_growth = []
        for i in range(7):
            date = (end_date - timedelta(days=i)).strftime("%Y-%m-%d")
            if date in self.daily_metrics:
                daily_growth.append({
                    "date": date,
                    "analyses": self.daily_metrics[date]["analyses"],
                    "users": len(self.daily_metrics[date]["users"])
                })
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "period": "last_7_days",
            "total_analyses": total_analyses,
            "successful_analyses": successful_analyses,
            "success_rate": round(success_rate, 2),
            "unique_users": unique_users,
            "analysis_types": dict(analysis_types),
            "daily_growth": daily_growth,
            "avg_analyses_per_user": round(total_analyses / unique_users, 2) if unique_users > 0 else 0
        }
    
    def _calculate_success_rate(self) -> float:
        """Calcula taxa de sucesso geral"""
        if not self.analysis_history:
            return 0
        
        successful = len([a for a in self.analysis_history if a["success"]])
        total = len(self.analysis_history)
        
        return (successful / total * 100) if total > 0 else 0

# Instâncias globais
application_metrics = ApplicationMetrics()
database_monitor = DatabaseMonitor()
business_metrics = BusinessMetrics() 