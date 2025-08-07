from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPAuthorizationCredentials
from app.models import Template, TemplateCreate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from app.security import bearer_scheme
from typing import List
from datetime import datetime

router = APIRouter()

# Templates pré-configurados disponíveis
PREDEFINED_TEMPLATES = {
    "geography_sales": {
        "name": "Análise de Vendas por Região",
        "description": "Template para análise geográfica de vendas com cores corporativas",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"],
            "title": "Vendas por Região",
            "subtitle": "Análise geográfica das vendas totais",
            "include_percentages": True,
            "sort_by": "value_desc",
            "show_grid": True,
            "legend_position": "bottom"
        }
    },
    "trend_monthly": {
        "name": "Tendência Mensal de Vendas",
        "description": "Template para análise de tendências temporais com previsão",
        "config": {
            "analysis_type": "trend",
            "date_column": "Date",
            "value_column": "Total Sales",
            "trend_period": "monthly",
            "forecast_periods": 3,
            "chart_type": "line",
            "colors": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"],
            "title": "Tendência de Vendas Mensal",
            "subtitle": "Análise temporal com previsão",
            "include_forecast": True,
            "confidence_interval": 0.95,
            "show_target_line": True,
            "animation": True
        }
    },
    "risk_credit": {
        "name": "Análise de Risco de Crédito",
        "description": "Template para análise de risco de clientes com múltiplos fatores",
        "config": {
            "analysis_type": "risk-score",
            "risk_factors": [
                {"column": "Credit_Score", "weight": 0.4, "risk_type": "low"},
                {"column": "Payment_History", "weight": 0.3, "risk_type": "high"},
                {"column": "Income_Level", "weight": 0.2, "risk_type": "low"},
                {"column": "Debt_Ratio", "weight": 0.1, "risk_type": "high"}
            ],
            "risk_thresholds": {
                "low": 0.3,
                "medium": 0.7,
                "high": 1.0
            },
            "chart_type": "scatter",
            "colors": ["#27ae60", "#f39c12", "#e74c3c"],
            "title": "Análise de Risco de Crédito",
            "subtitle": "Score vs Fatores de Risco",
            "show_risk_zones": True,
            "color_by_risk": True
        }
    },
    "marketing_campaigns": {
        "name": "Análise de Campanhas de Marketing",
        "description": "Template para análise de performance de campanhas de marketing",
        "config": {
            "analysis_type": "trend",
            "date_column": "Campaign_Date",
            "value_column": "Conversions",
            "chart_type": "line",
            "colors": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"],
            "title": "Performance de Campanhas",
            "subtitle": "Taxa de Conversão ao Longo do Tempo",
            "trend_period": "daily",
            "include_forecast": True,
            "forecast_periods": 7,
            "show_target_line": True,
            "target_value": 0.05,
            "animation": True
        }
    },
    "financial_summary": {
        "name": "Resumo Financeiro Executivo",
        "description": "Template para relatórios financeiros executivos",
        "config": {
            "analysis_type": "geography",
            "value_column": "Revenue",
            "region_column": "Territory",
            "chart_type": "bar",
            "colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"],
            "title": "Receita por Território",
            "subtitle": "Relatório Executivo Financeiro",
            "include_percentages": True,
            "sort_by": "value_desc",
            "company_logo": True,
            "footer_text": "Confidencial - Uso Interno",
            "export_formats": ["png", "pdf"]
        }
    },
    "customer_segmentation": {
        "name": "Segmentação de Clientes",
        "description": "Template para análise de segmentação de clientes",
        "config": {
            "analysis_type": "geography",
            "value_column": "Customer_Count",
            "region_column": "Segment",
            "chart_type": "pie",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFE66D"],
            "title": "Distribuição de Clientes por Segmento",
            "subtitle": "Análise de Segmentação",
            "include_percentages": True,
            "show_legend": True,
            "legend_position": "right",
            "animation": True
        }
    },
    "product_performance": {
        "name": "Performance de Produtos",
        "description": "Template para análise de performance de produtos",
        "config": {
            "analysis_type": "geography",
            "value_column": "Sales_Volume",
            "region_column": "Product_Category",
            "chart_type": "bar",
            "colors": ["#34495e", "#7f8c8d", "#95a5a6", "#bdc3c7", "#ecf0f1"],
            "title": "Performance de Produtos por Categoria",
            "subtitle": "Análise de Vendas por Produto",
            "include_percentages": True,
            "sort_by": "value_desc",
            "top_n": 10,
            "show_grid": True
        }
    },
    "seasonal_analysis": {
        "name": "Análise Sazonal",
        "description": "Template para análise de padrões sazonais",
        "config": {
            "analysis_type": "trend",
            "date_column": "Date",
            "value_column": "Sales",
            "chart_type": "line",
            "colors": ["#8e44ad", "#9b59b6", "#a569bd", "#bb8fce", "#d2b4de"],
            "title": "Análise Sazonal de Vendas",
            "subtitle": "Padrões sazonais ao longo do ano",
            "trend_period": "monthly",
            "seasonality": True,
            "include_forecast": True,
            "forecast_periods": 12,
            "show_seasonal_patterns": True
        }
    }
}

@router.get("/templates/predefined")
def list_predefined_templates():
    """Lista todos os templates pré-configurados disponíveis"""
    try:
        templates = []
        for template_id, template_data in PREDEFINED_TEMPLATES.items():
            templates.append({
                "id": template_id,
                "name": template_data["name"],
                "description": template_data["description"],
                "category": get_template_category(template_id),
                "difficulty": get_template_difficulty(template_id),
                "estimated_time": get_template_time(template_id),
                "preview_config": template_data["config"]
            })
        return templates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates/predefined/{template_id}")
def get_predefined_template(template_id: str):
    """Obtém um template pré-configurado específico"""
    try:
        if template_id not in PREDEFINED_TEMPLATES:
            raise HTTPException(status_code=404, detail="Template pré-configurado não encontrado")
        
        template_data = PREDEFINED_TEMPLATES[template_id]
        return {
            "id": template_id,
            "name": template_data["name"],
            "description": template_data["description"],
            "category": get_template_category(template_id),
            "difficulty": get_template_difficulty(template_id),
            "estimated_time": get_template_time(template_id),
            "config": template_data["config"],
            "usage_instructions": get_usage_instructions(template_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/templates/from-predefined/{template_id}")
def create_from_predefined_template(template_id: str, current_user: str = CurrentUser):
    """Cria um template personalizado baseado em um template pré-configurado"""
    try:
        if template_id not in PREDEFINED_TEMPLATES:
            raise HTTPException(status_code=404, detail="Template pré-configurado não encontrado")
        
        predefined = PREDEFINED_TEMPLATES[template_id]
        
        # Criar template personalizado baseado no pré-configurado
        template_data = {
            "name": f"{predefined['name']} - Personalizado",
            "description": f"Template personalizado baseado em: {predefined['description']}",
            "config": predefined["config"],
            "user_id": current_user,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("templates").insert(template_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_template_category(template_id: str) -> str:
    """Retorna a categoria do template"""
    categories = {
        "geography_sales": "Vendas",
        "trend_monthly": "Tendências",
        "risk_credit": "Risco",
        "marketing_campaigns": "Marketing",
        "financial_summary": "Financeiro",
        "customer_segmentation": "Clientes",
        "product_performance": "Produtos",
        "seasonal_analysis": "Sazonal"
    }
    return categories.get(template_id, "Geral")

def get_template_difficulty(template_id: str) -> str:
    """Retorna a dificuldade do template"""
    difficulties = {
        "geography_sales": "Fácil",
        "trend_monthly": "Médio",
        "risk_credit": "Avançado",
        "marketing_campaigns": "Médio",
        "financial_summary": "Fácil",
        "customer_segmentation": "Fácil",
        "product_performance": "Fácil",
        "seasonal_analysis": "Avançado"
    }
    return difficulties.get(template_id, "Médio")

def get_template_time(template_id: str) -> str:
    """Retorna o tempo estimado para usar o template"""
    times = {
        "geography_sales": "2 minutos",
        "trend_monthly": "3 minutos",
        "risk_credit": "5 minutos",
        "marketing_campaigns": "3 minutos",
        "financial_summary": "2 minutos",
        "customer_segmentation": "2 minutos",
        "product_performance": "2 minutos",
        "seasonal_analysis": "4 minutos"
    }
    return times.get(template_id, "3 minutos")

def get_usage_instructions(template_id: str) -> str:
    """Retorna instruções de uso do template"""
    instructions = {
        "geography_sales": "Upload de arquivo CSV com colunas 'Total Sales' e 'Region'",
        "trend_monthly": "Upload de arquivo CSV com colunas 'Date' e 'Total Sales'",
        "risk_credit": "Upload de arquivo CSV com colunas de fatores de risco",
        "marketing_campaigns": "Upload de arquivo CSV com colunas 'Campaign_Date' e 'Conversions'",
        "financial_summary": "Upload de arquivo CSV com colunas 'Revenue' e 'Territory'",
        "customer_segmentation": "Upload de arquivo CSV com colunas 'Customer_Count' e 'Segment'",
        "product_performance": "Upload de arquivo CSV com colunas 'Sales_Volume' e 'Product_Category'",
        "seasonal_analysis": "Upload de arquivo CSV com colunas 'Date' e 'Sales'"
    }
    return instructions.get(template_id, "Upload de arquivo CSV com dados apropriados")

@router.get("/templates", response_model=List[Template])
def list_templates(current_user: str = CurrentUser):
    try:
        print(f"🔍 Buscando templates para usuário: {current_user}")
        response = supabase.table("templates").select("*").eq("user_id", current_user).order("created_at", desc=True).execute()
        print(f"📊 Templates encontrados: {len(response.data)}")
        return response.data
    except Exception as e:
        print(f"❌ Erro ao buscar templates: {e}")
        # Retornar lista vazia em caso de erro para evitar loop infinito
        return []

@router.get("/templates/{template_id}", response_model=Template)
def get_template(template_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("templates").select("*").eq("id", template_id).eq("user_id", current_user).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Template não encontrado")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Template não encontrado: " + str(e))

@router.post("/templates", response_model=Template)
def create_template(template: TemplateCreate, current_user: str = CurrentUser):
    try:
        data = template.dict()
        data["user_id"] = current_user
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("templates").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/templates/{template_id}", response_model=Template)
def update_template(template_id: int, template: TemplateCreate, current_user: str = CurrentUser):
    try:
        data = template.dict()
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("templates").update(data).eq("id", template_id).eq("user_id", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Template não encontrado ou sem permissão")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/templates/{template_id}")
def delete_template(template_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("templates").delete().eq("id", template_id).eq("user_id", current_user).execute()
        return {"message": "Template deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 