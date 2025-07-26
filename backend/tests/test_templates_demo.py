#!/usr/bin/env python3
"""
Script de demonstração: Como criar e usar Templates no AutoReport SaaS
"""
import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_list_templates():
    """1. Listar templates existentes"""
    print("🔍 1. Listando templates existentes...")
    try:
        response = requests.get(f"{BASE_URL}/templates", headers=headers)
        if response.status_code == 200:
            templates = response.json()
            print(f"✅ Encontrados {len(templates)} templates:")
            for template in templates:
                print(f"   - ID: {template['id']}, Nome: {template['name']}")
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erro ao listar templates: {e}")

def create_template_geography():
    """2. Criar template de análise geográfica"""
    print("\n🌍 2. Criando template de análise geográfica...")
    
    template_data = {
        "name": "Análise de Vendas por Região",
        "description": "Template para análise de vendas por região geográfica com gráficos de barras",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "include_percentages": True,
            "sort_by": "value_desc",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
            "title": "Distribuição de Vendas por Região",
            "subtitle": "Análise geográfica das vendas totais"
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/templates", headers=headers, json=template_data)
        if response.status_code == 200:
            template = response.json()
            print(f"✅ Template criado com sucesso!")
            print(f"   - ID: {template['id']}")
            print(f"   - Nome: {template['name']}")
            return template['id']
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar template: {e}")
        return None

def create_template_trend():
    """3. Criar template de análise de tendências"""
    print("\n📈 3. Criando template de análise de tendências...")
    
    template_data = {
        "name": "Tendência Mensal de Vendas",
        "description": "Template para análise de tendências de vendas ao longo do tempo",
        "config": {
            "analysis_type": "trend",
            "date_column": "Date",
            "value_column": "Sales",
            "trend_period": "monthly",
            "forecast_periods": 3,
            "chart_type": "line",
            "include_forecast": True,
            "confidence_interval": 0.95,
            "title": "Tendência de Vendas Mensal",
            "subtitle": "Análise temporal com previsão"
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/templates", headers=headers, json=template_data)
        if response.status_code == 200:
            template = response.json()
            print(f"✅ Template criado com sucesso!")
            print(f"   - ID: {template['id']}")
            print(f"   - Nome: {template['name']}")
            return template['id']
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar template: {e}")
        return None

def create_template_risk():
    """4. Criar template de análise de risco"""
    print("\n⚠️ 4. Criando template de análise de risco...")
    
    template_data = {
        "name": "Análise de Risco de Clientes",
        "description": "Template para análise de risco baseada em múltiplos fatores",
        "config": {
            "analysis_type": "risk-score",
            "risk_factors": [
                {"column": "Payment_Delay", "weight": 0.3, "risk_type": "high"},
                {"column": "Credit_Score", "weight": 0.4, "risk_type": "low"},
                {"column": "Order_Value", "weight": 0.2, "risk_type": "high"},
                {"column": "Customer_Age", "weight": 0.1, "risk_type": "low"}
            ],
            "risk_thresholds": {
                "low": 0.3,
                "medium": 0.7,
                "high": 1.0
            },
            "chart_type": "scatter",
            "color_by_risk": True,
            "title": "Análise de Risco de Clientes",
            "subtitle": "Score de risco baseado em múltiplos fatores"
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/templates", headers=headers, json=template_data)
        if response.status_code == 200:
            template = response.json()
            print(f"✅ Template criado com sucesso!")
            print(f"   - ID: {template['id']}")
            print(f"   - Nome: {template['name']}")
            return template['id']
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar template: {e}")
        return None

def get_template_details(template_id):
    """5. Obter detalhes de um template específico"""
    print(f"\n📋 5. Obtendo detalhes do template ID {template_id}...")
    
    try:
        response = requests.get(f"{BASE_URL}/templates/{template_id}", headers=headers)
        if response.status_code == 200:
            template = response.json()
            print(f"✅ Template encontrado:")
            print(f"   - Nome: {template['name']}")
            print(f"   - Descrição: {template['description']}")
            print(f"   - Configuração: {json.dumps(template['config'], indent=2)}")
            return template
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro ao obter template: {e}")
        return None

def update_template(template_id):
    """6. Atualizar um template existente"""
    print(f"\n✏️ 6. Atualizando template ID {template_id}...")
    
    update_data = {
        "name": "Análise de Vendas por Região (Atualizado)",
        "description": "Template atualizado para análise geográfica com novas funcionalidades",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "include_percentages": True,
            "sort_by": "value_desc",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
            "title": "Distribuição de Vendas por Região",
            "subtitle": "Análise geográfica das vendas totais",
            "new_feature": "Análise de sazonalidade por região"
        }
    }
    
    try:
        response = requests.put(f"{BASE_URL}/templates/{template_id}", headers=headers, json=update_data)
        if response.status_code == 200:
            template = response.json()
            print(f"✅ Template atualizado com sucesso!")
            print(f"   - Novo nome: {template['name']}")
            return True
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro ao atualizar template: {e}")
        return False

def use_template_for_analysis(template_id):
    """7. Usar template para análise com arquivo de dados"""
    print(f"\n🚀 7. Usando template ID {template_id} para análise...")
    
    # Primeiro, vamos obter a configuração do template
    template = get_template_details(template_id)
    if not template:
        return False
    
    config = template['config']
    
    # Simular uso do template para análise
    print(f"📊 Configuração do template '{template['name']}':")
    print(f"   - Tipo de análise: {config.get('analysis_type')}")
    print(f"   - Coluna de valor: {config.get('value_column')}")
    print(f"   - Tipo de gráfico: {config.get('chart_type')}")
    
    # Aqui você usaria a configuração do template para fazer a análise
    # Por exemplo, se for análise geográfica:
    if config.get('analysis_type') == 'geography':
        print(f"   🌍 Análise geográfica configurada para região: {config.get('region_column')}")
        print(f"   📊 Incluir percentuais: {config.get('include_percentages')}")
    
    return True

def delete_template(template_id):
    """8. Deletar um template (opcional)"""
    print(f"\n🗑️ 8. Deletando template ID {template_id}...")
    
    try:
        response = requests.delete(f"{BASE_URL}/templates/{template_id}", headers=headers)
        if response.status_code == 200:
            print(f"✅ Template deletado com sucesso!")
            return True
        else:
            print(f"❌ Erro: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro ao deletar template: {e}")
        return False

def main():
    """Função principal para demonstrar o uso de templates"""
    print("🎯 DEMONSTRAÇÃO: Como criar e usar Templates no AutoReport SaaS")
    print("=" * 70)
    
    # 1. Listar templates existentes
    test_list_templates()
    
    # 2. Criar templates de exemplo
    geo_template_id = create_template_geography()
    trend_template_id = create_template_trend()
    risk_template_id = create_template_risk()
    
    # 3. Listar templates novamente
    test_list_templates()
    
    # 4. Obter detalhes de um template
    if geo_template_id:
        get_template_details(geo_template_id)
    
    # 5. Atualizar um template
    if geo_template_id:
        update_template(geo_template_id)
    
    # 6. Usar template para análise
    if geo_template_id:
        use_template_for_analysis(geo_template_id)
    
    print("\n" + "=" * 70)
    print("✅ Demonstração concluída!")
    print("\n💡 Como usar templates no Swagger UI:")
    print("1. Acesse: http://localhost:8000/docs")
    print("2. Use o token como query parameter: ?token=SEU_TOKEN")
    print("3. Teste os endpoints /templates")
    print("4. Use os templates criados para análises automatizadas")

if __name__ == "__main__":
    main() 