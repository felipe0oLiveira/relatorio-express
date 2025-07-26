#!/usr/bin/env python3
"""
EXEMPLO PRÁTICO: Templates + Geração de Gráficos
Este script mostra como usar templates para gerar gráficos automaticamente
"""
import requests
import json
import pandas as pd
from io import BytesIO
import base64

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

def criar_dados_exemplo():
    """Cria dados de exemplo para teste"""
    dados = {
        'Region': ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
        'Total Sales': [15000, 25000, 18000, 22000, 30000],
        'Date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05']
    }
    return pd.DataFrame(dados)

def salvar_csv_exemplo():
    """Salva dados de exemplo em CSV"""
    df = criar_dados_exemplo()
    df.to_csv('dados_exemplo.csv', index=False)
    print("✅ Arquivo 'dados_exemplo.csv' criado com sucesso!")
    return 'dados_exemplo.csv'

def criar_template_geografico():
    """Cria um template para análise geográfica"""
    print_step(1, "CRIANDO TEMPLATE PARA ANÁLISE GEOGRÁFICA")
    
    template_data = {
        "name": "Análise Geográfica de Vendas",
        "description": "Template para análise de vendas por região",
        "config": {
            "analysis_type": "geography",
            "value_column": "Total Sales",
            "region_column": "Region",
            "chart_type": "bar",
            "include_percentages": True,
            "sort_by": "value_desc",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFE66D"],
            "title": "Vendas por Região",
            "subtitle": "Análise geográfica das vendas totais"
        }
    }
    
    print("📝 Template que será criado:")
    print(json.dumps(template_data, indent=2))
    
    # Fazer requisição para criar template
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.post(
        f"{BASE_URL}/templates",
        json=template_data,
        headers=headers
    )
    
    if response.status_code == 200:
        template_id = response.json()["id"]
        print(f"✅ Template criado com ID: {template_id}")
        return template_id
    else:
        print(f"❌ Erro ao criar template: {response.text}")
        return None

def gerar_grafico_com_template(template_id, arquivo_csv):
    """Gera gráfico usando template"""
    print_step(2, "GERANDO GRÁFICO COM TEMPLATE")
    
    # Ler o template para obter configurações
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.get(
        f"{BASE_URL}/templates/{template_id}",
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"❌ Erro ao obter template: {response.text}")
        return
    
    template = response.json()
    config = template["config"]
    
    print(f"📊 Usando template: {template['name']}")
    print(f"🔧 Configurações:")
    print(f"   • Tipo de análise: {config['analysis_type']}")
    print(f"   • Coluna de valor: {config['value_column']}")
    print(f"   • Coluna de região: {config['region_column']}")
    print(f"   • Tipo de gráfico: {config['chart_type']}")
    
    # Fazer análise geográfica com as configurações do template
    with open(arquivo_csv, 'rb') as f:
        files = {'file': f}
        data = {
            'geo_col': config['region_column'],
            'value_col': config['value_column'],
            'agg': 'sum'
        }
        
        response = requests.post(
            f"{BASE_URL}/reports/analyze/geography?token={TOKEN}",
            files=files,
            data=data
        )
    
    if response.status_code == 200:
        resultado = response.json()
        print("✅ Gráfico gerado com sucesso!")
        print("📊 Resultados da análise:")
        print(json.dumps(resultado, indent=2))
        return resultado
    else:
        print(f"❌ Erro ao gerar gráfico: {response.text}")
        return None

def gerar_excel_com_template(template_id, arquivo_csv):
    """Gera relatório Excel usando template"""
    print_step(3, "GERANDO RELATÓRIO EXCEL COM TEMPLATE")
    
    with open(arquivo_csv, 'rb') as f:
        files = {'file': f}
        data = {
            'template_id': template_id,
            'title': 'Relatório de Vendas por Região'
        }
        
        response = requests.post(
            f"{BASE_URL}/reports/generate-excel-from-template?token={TOKEN}",
            files=files,
            data=data
        )
    
    if response.status_code == 200:
        # Salvar arquivo Excel
        with open('relatorio_com_template.xlsx', 'wb') as f:
            f.write(response.content)
        print("✅ Relatório Excel gerado: 'relatorio_com_template.xlsx'")
        return True
    else:
        print(f"❌ Erro ao gerar Excel: {response.text}")
        return False

def comparar_com_sem_template(arquivo_csv):
    """Compara o processo com e sem template"""
    print_step(4, "COMPARAÇÃO: COM vs SEM TEMPLATE")
    
    print("❌ SEM TEMPLATE (Processo manual):")
    print("   1. Upload do arquivo CSV")
    print("   2. Definir 'Total Sales' como coluna de valor")
    print("   3. Definir 'Region' como coluna de região")
    print("   4. Escolher gráfico de barras")
    print("   5. Configurar cores")
    print("   6. Definir título")
    print("   7. Ativar porcentagens")
    print("   8. Ordenar por valor")
    print("   ⏱️  Tempo estimado: 15 minutos")
    
    print("\n✅ COM TEMPLATE (Processo automático):")
    print("   1. Upload do arquivo CSV")
    print("   2. Selecionar template 'Análise Geográfica de Vendas'")
    print("   3. Sistema aplica automaticamente todas as configurações")
    print("   ⚡ Tempo estimado: 2 minutos")
    
    print("\n🎯 ECONOMIA DE TEMPO: 87% (13 minutos economizados)")

def mostrar_resultados_visuais():
    """Mostra como os resultados ficariam visualmente"""
    print_step(5, "RESULTADOS VISUAIS")
    
    # Simular dados de resultado
    dados_resultado = {
        "Norte": 15000,
        "Sul": 25000,
        "Leste": 18000,
        "Oeste": 22000,
        "Centro": 30000
    }
    
    print("📊 Gráfico de Barras Gerado:")
    print("┌─────────────────────────────────────┐")
    print("│         VENDAS POR REGIÃO           │")
    print("├─────────────────────────────────────┤")
    
    max_valor = max(dados_resultado.values())
    for regiao, valor in dados_resultado.items():
        barra = "█" * int((valor / max_valor) * 20)
        print(f"│ {regiao:8} │ {barra:20} │ {valor:6,} │")
    
    print("└─────────────────────────────────────┘")
    
    total = sum(dados_resultado.values())
    print(f"\n📈 Total de Vendas: R$ {total:,}")
    print(f"🏆 Região com mais vendas: Centro (R$ {max(dados_resultado.values()):,})")

def main():
    """Função principal"""
    print_header("TEMPLATES + GERAÇÃO DE GRÁFICOS")
    
    print("🎯 Este exemplo mostra como usar templates para gerar gráficos automaticamente!")
    print("📊 Vamos criar um template e gerar um gráfico de vendas por região")
    
    # Criar dados de exemplo
    arquivo_csv = salvar_csv_exemplo()
    
    # Criar template
    template_id = criar_template_geografico()
    
    if template_id:
        # Gerar gráfico com template
        resultado = gerar_grafico_com_template(template_id, arquivo_csv)
        
        if resultado:
            # Gerar Excel com template
            gerar_excel_com_template(template_id, arquivo_csv)
            
            # Mostrar comparação
            comparar_com_sem_template(arquivo_csv)
            
            # Mostrar resultados visuais
            mostrar_resultados_visuais()
    
    print_header("RESUMO FINAL")
    print("🎯 Template + Gráfico = Análise Automática!")
    print("⚡ Economia de tempo: 87%")
    print("🔄 Configuração consistente")
    print("📊 Resultados padronizados")
    print("💾 Templates salvos para reutilização")
    print("\n✨ Agora você pode gerar gráficos com um clique!")

if __name__ == "__main__":
    main() 