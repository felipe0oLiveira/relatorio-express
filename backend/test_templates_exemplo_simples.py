#!/usr/bin/env python3
"""
EXEMPLO PRÁTICO: Como usar Templates no AutoReport SaaS
Demonstração simples e visual
"""
import requests
import json

# Configuração
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token

def print_header(title):
    print(f"\n{'='*50}")
    print(f"🎯 {title}")
    print(f"{'='*50}")

def print_step(step, description):
    print(f"\n📋 PASSO {step}: {description}")
    print("-" * 40)

def test_templates_exemplo():
    """Exemplo prático de como usar templates"""
    
    print_header("EXEMPLO PRÁTICO: TEMPLATES")
    
    print("🤔 Imagine que você trabalha em uma empresa de e-commerce")
    print("📊 Todo mês você precisa fazer o mesmo relatório de vendas por região")
    print("⏱️  Sem template: 15 minutos configurando")
    print("⚡ Com template: 2 minutos usando")
    
    # PASSO 1: Criar um template
    print_step(1, "CRIANDO UM TEMPLATE")
    
    template_data = {
        "name": "Relatório Mensal de Vendas",
        "description": "Template para relatório mensal de vendas por região",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "include_percentages": True,
            "sort_by": "value_desc",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
            "title": "Vendas Mensais por Região",
            "subtitle": "Relatório mensal de performance"
        }
    }
    
    print("📝 Template que vamos criar:")
    print(json.dumps(template_data, indent=2))
    
    # Simular criação (sem fazer requisição real)
    print("\n✅ Template criado com sucesso!")
    print("🆔 ID do template: 1")
    
    # PASSO 2: Mostrar como usar o template
    print_step(2, "COMO USAR O TEMPLATE")
    
    print("📊 Agora, quando você quiser fazer análise geográfica:")
    print("1. Upload do arquivo CSV")
    print("2. Selecionar template 'Relatório Mensal de Vendas'")
    print("3. Sistema aplica automaticamente:")
    
    config = template_data["config"]
    print(f"   • Coluna de valor: {config['value_column']}")
    print(f"   • Coluna de região: {config['region_column']}")
    print(f"   • Tipo de gráfico: {config['chart_type']}")
    print(f"   • Incluir porcentagens: {config['include_percentages']}")
    print(f"   • Cores: {config['colors']}")
    print(f"   • Título: {config['title']}")
    
    # PASSO 3: Comparação antes/depois
    print_step(3, "COMPARAÇÃO: COM vs SEM TEMPLATE")
    
    print("❌ SEM TEMPLATE (Trabalho manual):")
    print("   • Escolher arquivo CSV")
    print("   • Definir 'Total Sales' como valor")
    print("   • Definir 'Region' como região")
    print("   • Escolher gráfico de barras")
    print("   • Configurar cores")
    print("   • Definir título")
    print("   • Ativar porcentagens")
    print("   • Ordenar por valor")
    print("   ⏱️  Tempo: 15 minutos")
    
    print("\n✅ COM TEMPLATE (Automático):")
    print("   • Escolher arquivo CSV")
    print("   • Selecionar template 'Relatório Mensal'")
    print("   • ⚡ Tempo: 2 minutos")
    
    # PASSO 4: Benefícios
    print_step(4, "BENEFÍCIOS DOS TEMPLATES")
    
    beneficios = [
        "⏱️  Economia de 90% do tempo",
        "🔄 Configuração consistente",
        "❌ Menos erros de configuração",
        "📊 Resultados padronizados",
        "👥 Pode ser compartilhado com equipe",
        "💾 Salva suas configurações favoritas"
    ]
    
    for beneficio in beneficios:
        print(f"   {beneficio}")
    
    # PASSO 5: Exemplo de uso real
    print_step(5, "EXEMPLO DE USO REAL")
    
    print("🏢 Cenário: Empresa de E-commerce")
    print("📅 Todo mês: Relatório de vendas por região")
    print("\n📊 Janeiro:")
    print("   • Upload: vendas_janeiro.csv")
    print("   • Template: 'Relatório Mensal de Vendas'")
    print("   • Resultado: Gráfico pronto em 2 minutos")
    
    print("\n📊 Fevereiro:")
    print("   • Upload: vendas_fevereiro.csv")
    print("   • Template: 'Relatório Mensal de Vendas'")
    print("   • Resultado: Gráfico pronto em 2 minutos")
    
    print("\n📊 Março:")
    print("   • Upload: vendas_marco.csv")
    print("   • Template: 'Relatório Mensal de Vendas'")
    print("   • Resultado: Gráfico pronto em 2 minutos")
    
    print("\n🎯 RESULTADO:")
    print("   • Antes: 45 minutos (3 meses × 15 min)")
    print("   • Depois: 6 minutos (3 meses × 2 min)")
    print("   • Economia: 39 minutos por trimestre!")

def mostrar_como_criar_template():
    """Mostra como criar um template no Swagger UI"""
    
    print_header("COMO CRIAR TEMPLATE NO SWAGGER UI")
    
    print("🌐 1. Acesse o Swagger UI:")
    print("   http://localhost:8000/docs?token=SEU_TOKEN")
    
    print("\n📋 2. Procure por 'POST /templates'")
    
    print("\n✏️ 3. Clique em 'Try it out'")
    
    print("\n📝 4. Cole este JSON:")
    template_exemplo = {
        "name": "Meu Primeiro Template",
        "description": "Template para análise básica",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region"
        }
    }
    print(json.dumps(template_exemplo, indent=2))
    
    print("\n🚀 5. Clique em 'Execute'")
    print("✅ Template criado!")

def main():
    """Função principal"""
    print("🎯 EXEMPLO PRÁTICO: TEMPLATES NO AUTOREPORT SAAS")
    print("=" * 60)
    
    # Executar exemplo prático
    test_templates_exemplo()
    
    # Mostrar como criar no Swagger
    mostrar_como_criar_template()
    
    print_header("RESUMO FINAL")
    print("🎯 Template = Receita de cozinha salva")
    print("⚡ Economiza tempo e esforço")
    print("🔄 Garante consistência")
    print("📊 Resultados sempre iguais")
    print("\n✨ É como ter um 'botão mágico' para suas análises!")

if __name__ == "__main__":
    main() 