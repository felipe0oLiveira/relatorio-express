from fastapi import APIRouter, HTTPException, Query
from app.dependencies.auth import CurrentUser
from app.services.supabase_client import supabase
from typing import Optional, Dict, List
from datetime import datetime, timedelta
import pandas as pd

router = APIRouter()

@router.get("/analytics/dashboard")
async def get_dashboard_analytics(
    period: str = Query("30d", description="Período: 7d, 30d, 90d, 1y"),
    current_user: str = CurrentUser
):
    """Retorna métricas gerais do dashboard"""
    try:
        # Calcular data de início baseada no período
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Dados mock para teste (substituir por dados reais quando tabelas estiverem prontas)
        mock_data = {
            "period": period,
            "total_reports": 15,
            "total_templates": 8,
            "reports_by_day": {
                "2024-03-15": 3,
                "2024-03-16": 5,
                "2024-03-17": 2,
                "2024-03-18": 4,
                "2024-03-19": 1
            },
            "popular_templates": {
                "Relatório de Vendas": 5,
                "Análise Financeira": 3,
                "Dashboard Executivo": 2,
                "Relatório Mensal": 1
            },
            "growth_rate": 12.5,
            "user_id": current_user,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }
        
        return mock_data
        
    except Exception as e:
        # Retornar dados básicos em caso de erro
        return {
            "period": period,
            "total_reports": 0,
            "total_templates": 0,
            "reports_by_day": {},
            "popular_templates": {},
            "growth_rate": 0.0,
            "user_id": current_user,
            "error": "Dados mock - tabelas não configuradas"
        }

@router.get("/analytics/reports")
async def get_reports_analytics(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: str = CurrentUser
):
    """Analytics específicos de relatórios"""
    try:
        # Dados mock para teste
        mock_data = {
            "user_id": current_user,
            "total_reports": 25,
            "reports_by_month": {
                "2024-01": 8,
                "2024-02": 12,
                "2024-03": 5
            },
            "reports_by_type": {
                "vendas": 10,
                "financeiro": 8,
                "marketing": 4,
                "rh": 3
            },
            "average_generation_time": 2.5,
            "most_used_template": "Relatório de Vendas",
            "recent_reports": [
                {"id": 1, "name": "Relatório de Vendas Março", "created_at": "2024-03-19T10:30:00"},
                {"id": 2, "name": "Análise Financeira Q1", "created_at": "2024-03-18T15:45:00"},
                {"id": 3, "name": "Dashboard Marketing", "created_at": "2024-03-17T09:20:00"}
            ],
            "start_date": start_date,
            "end_date": end_date
        }
        
        return mock_data
        
    except Exception as e:
        return {
            "user_id": current_user,
            "total_reports": 0,
            "reports_by_month": {},
            "reports_by_type": {},
            "average_generation_time": 0,
            "most_used_template": None,
            "recent_reports": [],
            "error": "Dados mock - tabelas não configuradas"
        }

@router.get("/analytics/templates")
async def get_templates_analytics(current_user: str = CurrentUser):
    """Analytics específicos de templates"""
    try:
        # Dados mock para teste
        mock_data = {
            "user_id": current_user,
            "total_templates": 12,
            "templates_by_month": {
                "2024-01": 3,
                "2024-02": 5,
                "2024-03": 4
            },
            "config_analysis": {
                "with_charts": 8,
                "with_filters": 10,
                "with_formulas": 6,
                "with_conditional_formatting": 4
            },
            "recent_templates": [
                {"id": 1, "name": "Dashboard Executivo", "created_at": "2024-03-19T14:20:00"},
                {"id": 2, "name": "Relatório de Vendas", "created_at": "2024-03-18T11:30:00"},
                {"id": 3, "name": "Análise Financeira", "created_at": "2024-03-17T16:45:00"}
            ],
            "most_used_template": "Relatório de Vendas",
            "templates_by_category": {
                "vendas": 5,
                "financeiro": 4,
                "marketing": 2,
                "rh": 1
            }
        }
        
        return mock_data
        
    except Exception as e:
        return {
            "user_id": current_user,
            "total_templates": 0,
            "templates_by_month": {},
            "config_analysis": {},
            "recent_templates": [],
            "error": "Dados mock - tabelas não configuradas"
        }

@router.get("/analytics/usage")
async def get_usage_analytics(
    current_user: str = CurrentUser
):
    """Métricas de uso da plataforma"""
    try:
        # Dados mock para teste
        mock_data = {
            "user_id": current_user,
            "total_reports": 45,
            "total_templates": 12,
            "usage_by_weekday": {
                "Monday": 8,
                "Tuesday": 12,
                "Wednesday": 10,
                "Thursday": 7,
                "Friday": 6,
                "Saturday": 1,
                "Sunday": 1
            },
            "peak_hours": {
                9: 15,
                14: 12,
                16: 8
            },
            "avg_reports_per_day": 1.5,
            "user_since": "2024-01-15",
            "total_days_active": 75,
            "last_activity": "2024-03-19T16:30:00",
            "favorite_features": [
                "Excel Generation",
                "Chart Creation",
                "Template System"
            ]
        }
        
        return mock_data
        
    except Exception as e:
        return {
            "user_id": current_user,
            "total_reports": 0,
            "total_templates": 0,
            "usage_by_weekday": {},
            "peak_hours": {},
            "avg_reports_per_day": 0,
            "user_since": "N/A",
            "error": "Dados mock - tabelas não configuradas"
        }

def calculate_growth_rate(data: List[Dict], period: str) -> float:
    """Calcula taxa de crescimento"""
    if not data or len(data) < 2:
        return 0.0
    
    df = pd.DataFrame(data)
    df['created_at'] = pd.to_datetime(df['created_at'])
    
    # Dividir período em duas metades
    mid_point = df['created_at'].min() + (df['created_at'].max() - df['created_at'].min()) / 2
    
    first_half = len(df[df['created_at'] < mid_point])
    second_half = len(df[df['created_at'] >= mid_point])
    
    if first_half == 0:
        return 100.0 if second_half > 0 else 0.0
    
    return ((second_half - first_half) / first_half) * 100

def analyze_template_configs(configs: List[Dict]) -> Dict:
    """Analisa configurações dos templates"""
    analysis = {
        "chart_types": {},
        "analysis_types": {},
        "color_schemes": {}
    }
    
    for config in configs:
        if isinstance(config, dict):
            # Análise de tipos de gráfico
            if 'chart_type' in config:
                chart_type = config['chart_type']
                analysis["chart_types"][chart_type] = analysis["chart_types"].get(chart_type, 0) + 1
            
            # Análise de tipos de análise
            if 'analysis_type' in config:
                analysis_type = config['analysis_type']
                analysis["analysis_types"][analysis_type] = analysis["analysis_types"].get(analysis_type, 0) + 1
            
            # Análise de esquemas de cores
            if 'colors' in config:
                color_count = len(config['colors'])
                analysis["color_schemes"][f"{color_count}_colors"] = analysis["color_schemes"].get(f"{color_count}_colors", 0) + 1
    
    return analysis

def get_user_creation_date(user_id: str) -> str:
    """Obtém data de criação do usuário"""
    try:
        response = supabase.table("users").select("created_at").eq("id", user_id).single().execute()
        return response.data.get("created_at", "") if response.data else ""
    except:
        return "" 