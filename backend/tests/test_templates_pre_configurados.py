#!/usr/bin/env python3
"""
EXEMPLO PRÁTICO: Templates Pré-configurados
Este script mostra como usar os templates pré-configurados
"""
import requests
import json

# Configuração
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🎯 {title}")
    print(f"{'='*60}")

def print_step(step, description):
    print(f"\n📋 PASSO {step}: {description}")
    print("-" * 50)

def listar_templates_pre_configurados():
    """Lista todos os templates pré-configurados"""
    print_step(1, "LISTANDO TEMPLATES PRÉ-CONFIGURADOS")
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.get(f"{BASE_URL}/templates/predefined", headers=headers)
    
    if response.status_code == 200:
        templates = response.json()
        print(f"📋 Total de templates disponíveis: {len(templates)}")
        
        for i, template in enumerate(templates, 1):
            print(f"\n{i}. {template['name']}")
            print(f"   🆔 ID: {template['id']}")
            print(f"   📝 Descrição: {template['description']}")
            print(f"   🏷️  Categoria: {template['category']}")
            print(f"   ⚡ Dificuldade: {template['difficulty']}")
            print(f"   ⏱️  Tempo estimado: {template['estimated_time']}")
        
        return templates
    else:
        print(f"❌ Erro ao listar templates: {response.text}")
        return []

def ver_template_especifico(template_id):
    """Ver detalhes de um template específico"""
    print_step(2, f"VER DETALHES DO TEMPLATE: {template_id}")
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.get(f"{BASE_URL}/templates/predefined/{template_id}", headers=headers)
    
    if response.status_code == 200:
        template = response.json()
        print(f"📋 Nome: {template['name']}")
        print(f"📝 Descrição: {template['description']}")
        print(f"🏷️  Categoria: {template['category']}")
        print(f"⚡ Dificuldade: {template['difficulty']}")
        print(f"⏱️  Tempo estimado: {template['estimated_time']}")
        print(f"📋 Instruções: {template['usage_instructions']}")
        
        config = template['config']
        print(f"\n🔧 Configurações:")
        print(f"   • Tipo de análise: {config.get('analysis_type', 'N/A')}")
        print(f"   • Tipo de gráfico: {config.get('chart_type', 'N/A')}")
        if 'colors' in config:
            print(f"   • Cores: {config['colors']}")
        if 'title' in config:
            print(f"   • Título: {config['title']}")
        
        return template
    else:
        print(f"❌ Erro ao obter template: {response.text}")
        return None

def criar_template_personalizado(template_id):
    """Criar template personalizado baseado no pré-configurado"""
    print_step(3, f"CRIANDO TEMPLATE PERSONALIZADO: {template_id}")
    
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.post(f"{BASE_URL}/templates/from-predefined/{template_id}", headers=headers)
    
    if response.status_code == 200:
        template = response.json()
        print(f"✅ Template personalizado criado com sucesso!")
        print(f"🆔 ID: {template['id']}")
        print(f"📋 Nome: {template['name']}")
        print(f"📝 Descrição: {template['description']}")
        print(f"📅 Criado em: {template['created_at']}")
        print(f"🔗 Template base: {template.get('source_template', 'N/A')}")
        return template
    else:
        print(f"❌ Erro ao criar template: {response.text}")
        return None

def mostrar_exemplos_uso():
    """Mostra exemplos de uso dos templates"""
    print_step(4, "EXEMPLOS DE USO DOS TEMPLATES")
    
    exemplos = {
        "geography_sales": {
            "caso_uso": "Relatório mensal de vendas por região",
            "dados_exemplo": "CSV com colunas: Total Sales, Region",
            "frequencia": "Mensal",
            "publico": "Equipe de vendas, gerentes"
        },
        "trend_monthly": {
            "caso_uso": "Análise de tendências de vendas",
            "dados_exemplo": "CSV com colunas: Date, Total Sales",
            "frequencia": "Semanal/Mensal",
            "publico": "Diretores, analistas"
        },
        "marketing_campaigns": {
            "caso_uso": "Performance de campanhas de marketing",
            "dados_exemplo": "CSV com colunas: Campaign_Date, Conversions",
            "frequencia": "Diária/Semanal",
            "publico": "Equipe de marketing"
        },
        "financial_summary": {
            "caso_uso": "Relatório financeiro executivo",
            "dados_exemplo": "CSV com colunas: Revenue, Territory",
            "frequencia": "Mensal/Trimestral",
            "publico": "Diretores financeiros, executivos"
        }
    }
    
    print("🎯 Casos de uso por template:")
    for template_id, info in exemplos.items():
        print(f"\n📊 {template_id}:")
        print(f"   • Caso de uso: {info['caso_uso']}")
        print(f"   • Dados necessários: {info['dados_exemplo']}")
        print(f"   • Frequência: {info['frequencia']}")
        print(f"   • Público: {info['publico']}")

def comparar_templates():
    """Compara diferentes templates"""
    print_step(5, "COMPARAÇÃO DE TEMPLATES")
    
    comparacao = {
        "geography_sales": {
            "facilidade": "⭐⭐⭐⭐⭐",
            "tempo": "2 min",
            "complexidade": "Baixa",
            "melhor_para": "Iniciantes"
        },
        "trend_monthly": {
            "facilidade": "⭐⭐⭐⭐",
            "tempo": "3 min",
            "complexidade": "Média",
            "melhor_para": "Analistas"
        },
        "risk_credit": {
            "facilidade": "⭐⭐⭐",
            "tempo": "5 min",
            "complexidade": "Alta",
            "melhor_para": "Especialistas"
        },
        "marketing_campaigns": {
            "facilidade": "⭐⭐⭐⭐",
            "tempo": "3 min",
            "complexidade": "Média",
            "melhor_para": "Marketing"
        }
    }
    
    print("📊 Comparação de templates:")
    for template_id, info in comparacao.items():
        print(f"\n🎯 {template_id}:")
        print(f"   • Facilidade: {info['facilidade']}")
        print(f"   • Tempo: {info['tempo']}")
        print(f"   • Complexidade: {info['complexidade']}")
        print(f"   • Melhor para: {info['melhor_para']}")

def demonstrar_fluxo_completo():
    """Demonstra o fluxo completo de uso"""
    print_step(6, "FLUXO COMPLETO DE USO")
    
    print("🚀 Fluxo completo para usar templates pré-configurados:")
    print("\n1️⃣ Listar templates disponíveis")
    print("   GET /templates/predefined")
    
    print("\n2️⃣ Escolher template")
    print("   GET /templates/predefined/geography_sales")
    
    print("\n3️⃣ Criar template personalizado")
    print("   POST /templates/from-predefined/geography_sales")
    
    print("\n4️⃣ Usar template na análise")
    print("   POST /reports/analyze/geography")
    print("   (com configurações do template)")
    
    print("\n5️⃣ Gerar relatório Excel")
    print("   POST /reports/generate-excel-from-template")
    
    print("\n✨ Resultado: Análise profissional em minutos!")

def main():
    """Função principal"""
    print_header("TEMPLATES PRÉ-CONFIGURADOS")
    
    print("🎯 Este exemplo mostra como usar templates pré-configurados!")
    print("📊 Agora você pode simplesmente selecionar e usar!")
    
    # Listar templates disponíveis
    templates = listar_templates_pre_configurados()
    
    if templates:
        # Ver template específico
        template_id = "geography_sales"
        template = ver_template_especifico(template_id)
        
        if template:
            # Criar template personalizado
            template_personalizado = criar_template_personalizado(template_id)
            
            if template_personalizado:
                print(f"\n✅ Template '{template_id}' criado com sucesso!")
                print(f"🆔 ID do template personalizado: {template_personalizado['id']}")
        
        # Mostrar exemplos de uso
        mostrar_exemplos_uso()
        
        # Comparar templates
        comparar_templates()
        
        # Demonstrar fluxo completo
        demonstrar_fluxo_completo()
    
    print_header("RESUMO DOS TEMPLATES PRÉ-CONFIGURADOS")
    print("🎯 Benefícios:")
    print("   • ⚡ Comece em 2 minutos")
    print("   • 🎯 Configurações otimizadas")
    print("   • 🎨 Cores profissionais")
    print("   • 📊 Análises completas")
    print("   • 🔄 Reutilizáveis")
    print("   • 📱 Responsivos")
    print("\n✨ Templates pré-configurados = Análises profissionais instantâneas!")

if __name__ == "__main__":
    main() 