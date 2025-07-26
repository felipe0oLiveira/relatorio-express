#!/usr/bin/env python3
"""
EXEMPLO PRÁTICO: Personalização de Templates
Este script mostra como personalizar templates de diferentes formas
"""
import requests
import json

# Configuração
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🎨 {title}")
    print(f"{'='*60}")

def print_step(step, description):
    print(f"\n📋 PASSO {step}: {description}")
    print("-" * 50)

def criar_template_basico():
    """Cria um template básico"""
    print_step(1, "CRIANDO TEMPLATE BÁSICO")
    
    template_basico = {
        "name": "Template Básico",
        "description": "Template inicial para personalização",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar"
        }
    }
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.post(
        f"{BASE_URL}/templates",
        json=template_basico,
        headers=headers
    )
    
    if response.status_code == 200:
        template_id = response.json()["id"]
        print(f"✅ Template básico criado com ID: {template_id}")
        return template_id
    else:
        print(f"❌ Erro ao criar template: {response.text}")
        return None

def personalizar_cores(template_id):
    """Personaliza as cores do template"""
    print_step(2, "PERSONALIZANDO CORES")
    
    # Diferentes paletas de cores
    paletas = {
        "corporativa": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"],
        "marketing": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"],
        "neutra": ["#34495e", "#7f8c8d", "#95a5a6", "#bdc3c7", "#ecf0f1"],
        "vibrante": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFE66D"]
    }
    
    print("🎨 Paletas de cores disponíveis:")
    for nome, cores in paletas.items():
        print(f"   • {nome}: {cores}")
    
    # Escolher paleta corporativa
    cores_escolhidas = paletas["corporativa"]
    
    template_atualizado = {
        "name": "Template com Cores Corporativas",
        "description": "Template personalizado com cores profissionais",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "colors": cores_escolhidas,
            "title": "Vendas por Região - Relatório Corporativo",
            "subtitle": "Análise geográfica com cores profissionais"
        }
    }
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.put(
        f"{BASE_URL}/templates/{template_id}",
        json=template_atualizado,
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"✅ Cores personalizadas aplicadas!")
        print(f"🎨 Cores escolhidas: {cores_escolhidas}")
        return True
    else:
        print(f"❌ Erro ao personalizar cores: {response.text}")
        return False

def personalizar_tipo_grafico(template_id):
    """Personaliza o tipo de gráfico"""
    print_step(3, "PERSONALIZANDO TIPO DE GRÁFICO")
    
    tipos_grafico = {
        "bar": "Gráfico de Barras",
        "line": "Gráfico de Linha",
        "pie": "Gráfico de Pizza",
        "scatter": "Gráfico de Dispersão"
    }
    
    print("📊 Tipos de gráfico disponíveis:")
    for tipo, descricao in tipos_grafico.items():
        print(f"   • {tipo}: {descricao}")
    
    # Escolher gráfico de linha
    tipo_escolhido = "line"
    
    template_atualizado = {
        "name": "Template com Gráfico de Linha",
        "description": "Template para análise temporal",
        "config": {
            "analysis_type": "trend",
            "date_column": "Date",
            "value_column": "Total Sales",
            "chart_type": tipo_escolhido,
            "colors": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"],
            "title": "Tendência de Vendas",
            "subtitle": "Análise temporal com gráfico de linha",
            "trend_period": "daily",
            "include_forecast": True
        }
    }
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.put(
        f"{BASE_URL}/templates/{template_id}",
        json=template_atualizado,
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"✅ Tipo de gráfico personalizado: {tipos_grafico[tipo_escolhido]}")
        return True
    else:
        print(f"❌ Erro ao personalizar gráfico: {response.text}")
        return False

def personalizar_filtros(template_id):
    """Personaliza filtros do template"""
    print_step(4, "PERSONALIZANDO FILTROS")
    
    template_com_filtros = {
        "name": "Template com Filtros Avançados",
        "description": "Template com filtros personalizados",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"],
            "title": "Vendas por Região - Filtrado",
            "subtitle": "Análise com filtros aplicados",
            "filters": {
                "date_range": {
                    "start": "2024-01-01",
                    "end": "2024-12-31"
                },
                "value_threshold": 1000,
                "exclude_regions": ["Teste", "Demo"],
                "include_only": ["Active", "Premium"]
            },
            "sort_by": "value_desc",
            "top_n": 10
        }
    }
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.put(
        f"{BASE_URL}/templates/{template_id}",
        json=template_com_filtros,
        headers=headers
    )
    
    if response.status_code == 200:
        print("✅ Filtros personalizados aplicados!")
        print("🔍 Filtros configurados:")
        print("   • Período: 2024-01-01 a 2024-12-31")
        print("   • Valor mínimo: R$ 1.000")
        print("   • Excluir: Teste, Demo")
        print("   • Incluir apenas: Active, Premium")
        return True
    else:
        print(f"❌ Erro ao personalizar filtros: {response.text}")
        return False

def personalizar_analise_risco(template_id):
    """Personaliza template para análise de risco"""
    print_step(5, "PERSONALIZANDO ANÁLISE DE RISCO")
    
    template_risco = {
        "name": "Template de Análise de Risco",
        "description": "Template para análise de risco de clientes",
        "config": {
            "analysis_type": "risk-score",
            "risk_factors": [
                {
                    "column": "Credit_Score",
                    "weight": 0.4,
                    "risk_type": "low"
                },
                {
                    "column": "Payment_History",
                    "weight": 0.3,
                    "risk_type": "high"
                },
                {
                    "column": "Income_Level",
                    "weight": 0.2,
                    "risk_type": "low"
                },
                {
                    "column": "Debt_Ratio",
                    "weight": 0.1,
                    "risk_type": "high"
                }
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
            "show_risk_zones": True
        }
    }
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.put(
        f"{BASE_URL}/templates/{template_id}",
        json=template_risco,
        headers=headers
    )
    
    if response.status_code == 200:
        print("✅ Template de risco personalizado!")
        print("⚠️  Fatores de risco configurados:")
        print("   • Credit Score (40% peso)")
        print("   • Payment History (30% peso)")
        print("   • Income Level (20% peso)")
        print("   • Debt Ratio (10% peso)")
        return True
    else:
        print(f"❌ Erro ao personalizar análise de risco: {response.text}")
        return False

def listar_templates():
    """Lista todos os templates do usuário"""
    print_step(6, "LISTANDO TEMPLATES PERSONALIZADOS")
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.get(f"{BASE_URL}/templates", headers=headers)
    
    if response.status_code == 200:
        templates = response.json()
        print(f"📋 Total de templates: {len(templates)}")
        
        for i, template in enumerate(templates, 1):
            print(f"\n{i}. {template['name']}")
            print(f"   📝 Descrição: {template['description']}")
            print(f"   🆔 ID: {template['id']}")
            print(f"   📅 Criado: {template['created_at']}")
            
            config = template.get('config', {})
            if 'analysis_type' in config:
                print(f"   📊 Tipo: {config['analysis_type']}")
            if 'chart_type' in config:
                print(f"   📈 Gráfico: {config['chart_type']}")
        
        return templates
    else:
        print(f"❌ Erro ao listar templates: {response.text}")
        return []

def mostrar_exemplos_personalizacao():
    """Mostra exemplos de personalização"""
    print_step(7, "EXEMPLOS DE PERSONALIZAÇÃO")
    
    exemplos = {
        "Corporativo": {
            "colors": ["#1f4e79", "#2e5984", "#3c7aa3"],
            "title": "Relatório Executivo",
            "company_logo": True
        },
        "Marketing": {
            "colors": ["#e74c3c", "#f39c12", "#f1c40f"],
            "title": "Análise de Campanhas",
            "animation": True
        },
        "Financeiro": {
            "colors": ["#27ae60", "#f39c12", "#e74c3c"],
            "title": "Análise de Risco",
            "show_grid": True
        }
    }
    
    print("🎨 Exemplos de personalização por área:")
    for area, config in exemplos.items():
        print(f"\n🏢 {area}:")
        print(f"   • Cores: {config['colors']}")
        print(f"   • Título: {config['title']}")
        for key, value in config.items():
            if key not in ['colors', 'title']:
                print(f"   • {key}: {value}")

def main():
    """Função principal"""
    print_header("PERSONALIZAÇÃO DE TEMPLATES")
    
    print("🎨 Este exemplo mostra como personalizar templates de diferentes formas!")
    print("📊 Vamos criar e personalizar um template passo a passo")
    
    # Criar template básico
    template_id = criar_template_basico()
    
    if template_id:
        # Personalizar cores
        personalizar_cores(template_id)
        
        # Personalizar tipo de gráfico
        personalizar_tipo_grafico(template_id)
        
        # Personalizar filtros
        personalizar_filtros(template_id)
        
        # Personalizar análise de risco
        personalizar_analise_risco(template_id)
        
        # Listar templates
        listar_templates()
        
        # Mostrar exemplos
        mostrar_exemplos_personalizacao()
    
    print_header("RESUMO DA PERSONALIZAÇÃO")
    print("🎨 Templates podem ser personalizados em:")
    print("   • 🎨 Cores e estilos visuais")
    print("   • 📊 Tipos de gráfico")
    print("   • 🔍 Filtros e configurações")
    print("   • ⚠️  Análises específicas (risco, tendências)")
    print("   • 📱 Responsividade e interatividade")
    print("\n✨ Personalização = Templates únicos para suas necessidades!")

if __name__ == "__main__":
    main() 