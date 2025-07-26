from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List
from app.services.monitoring_service import application_metrics, database_monitor, business_metrics
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/monitoring", tags=["monitoring"])

@router.get("/health")
async def get_health():
    """Retorna saúde geral da aplicação"""
    try:
        health_data = application_metrics.get_application_health()
        db_health = await database_monitor.check_database_health()
        
        return {
            "application": health_data,
            "database": db_health,
            "overall_status": "healthy" if health_data["status"] == "healthy" and db_health["status"] == "healthy" else "warning"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar saúde: {str(e)}")

@router.get("/performance")
async def get_performance():
    """Retorna métricas de performance da aplicação"""
    try:
        return application_metrics.get_performance_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter métricas de performance: {str(e)}")

@router.get("/business")
async def get_business_metrics():
    """Retorna métricas de negócio"""
    try:
        return await business_metrics.get_business_insights()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter métricas de negócio: {str(e)}")

@router.get("/dashboard")
async def get_dashboard():
    """Retorna dashboard completo com todas as métricas"""
    try:
        # Coletar todas as métricas
        health = application_metrics.get_application_health()
        performance = application_metrics.get_performance_metrics()
        business = await business_metrics.get_business_insights()
        database = await database_monitor.get_database_metrics()
        
        return {
            "timestamp": health["timestamp"],
            "overall_status": health["status"],
            "health": health,
            "performance": performance,
            "business": business,
            "database": database,
            "summary": {
                "active_users": health["active_users"],
                "error_rate": health["error_rate"],
                "avg_response_time": health["avg_response_time"],
                "total_analyses_today": business["total_analyses"],
                "success_rate": business["success_rate"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar dashboard: {str(e)}")

@router.get("/endpoints")
async def get_endpoint_metrics():
    """Retorna métricas detalhadas por endpoint"""
    try:
        performance = application_metrics.get_performance_metrics()
        return {
            "timestamp": performance["timestamp"],
            "top_endpoints": performance["top_endpoints"],
            "total_endpoints": len(application_metrics.endpoint_metrics)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter métricas de endpoints: {str(e)}")

@router.get("/users")
async def get_user_activity():
    """Retorna atividade dos usuários"""
    try:
        active_users = []
        for user_id, activity in application_metrics.user_activity.items():
            if activity["last_activity"]:
                active_users.append({
                    "user_id": user_id,
                    "last_activity": activity["last_activity"],
                    "request_count": activity["request_count"],
                    "files_uploaded": activity["files_uploaded"],
                    "analyses_performed": activity["analyses_performed"]
                })
        
        # Ordenar por última atividade
        active_users.sort(key=lambda x: x["last_activity"], reverse=True)
        
        return {
            "timestamp": application_metrics.get_application_health()["timestamp"],
            "active_users": active_users[:20],  # Top 20 usuários mais ativos
            "total_active_users": len(active_users)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter atividade dos usuários: {str(e)}")

@router.get("/history")
async def get_metrics_history():
    """Retorna histórico de métricas"""
    try:
        return {
            "timestamp": application_metrics.get_application_health()["timestamp"],
            "response_times": list(application_metrics.metrics_history["response_times"]),
            "request_count": list(application_metrics.metrics_history["request_count"]),
            "error_count": list(application_metrics.metrics_history["error_count"]),
            "analyses_performed": list(application_metrics.metrics_history["analyses_performed"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter histórico: {str(e)}")

@router.post("/record")
async def record_custom_metric(metric_type: str, value: float, user_id: str = Depends(get_current_user)):
    """Registra métrica customizada"""
    try:
        application_metrics.record_metric(metric_type, value)
        return {"message": "Métrica registrada com sucesso", "metric_type": metric_type, "value": value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao registrar métrica: {str(e)}")

@router.get("/database")
async def get_database_metrics():
    """Retorna métricas específicas do banco de dados"""
    try:
        return await database_monitor.get_database_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter métricas do banco: {str(e)}")

@router.get("/analytics")
async def get_analytics_summary():
    """Retorna resumo das análises realizadas"""
    try:
        business = await business_metrics.get_business_insights()
        return {
            "timestamp": business["timestamp"],
            "analytics_summary": {
                "total_analyses": business["total_analyses"],
                "success_rate": business["success_rate"],
                "unique_users": business["unique_users"],
                "avg_analyses_per_user": business["avg_analyses_per_user"],
                "analysis_types": business["analysis_types"],
                "daily_growth": business["daily_growth"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter resumo de análises: {str(e)}") 