#!/usr/bin/env python3
"""
Script de teste: Geração de Relatórios Excel Automáticos
"""
import requests
import json
from datetime import datetime

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

def test_generate_excel_summary():
    """Teste 1: Gerar relatório Excel de resumo"""
    print("📊 1. Testando geração de relatório Excel - Resumo...")
    
    try:
        with open('test_data.csv', 'rb') as file:
            files = {'file': ('test_data.csv', file, 'text/csv')}
            data = {
                'report_type': 'summary',
                'title': 'Relatório de Vendas - Resumo',
                'include_summary': 'true',
                'include_charts': 'true'
            }
            
            response = requests.post(
                f"{BASE_URL}/reports/generate-excel?token={TOKEN}",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                # Salvar o arquivo Excel
                filename = f"relatorio_resumo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Relatório Excel gerado com sucesso: {filename}")
                return True
            else:
                print(f"❌ Erro: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        print(f"❌ Erro ao gerar relatório: {e}")
        return False

def test_generate_excel_geography():
    """Teste 2: Gerar relatório Excel de análise geográfica"""
    print("\n🌍 2. Testando geração de relatório Excel - Análise Geográfica...")
    
    try:
        with open('test_data.csv', 'rb') as file:
            files = {'file': ('test_data.csv', file, 'text/csv')}
            data = {
                'report_type': 'geography',
                'title': 'Relatório de Vendas por Região',
                'value_column': 'Total Sales',
                'region_column': 'Region',
                'include_summary': 'true',
                'include_charts': 'true'
            }
            
            response = requests.post(
                f"{BASE_URL}/reports/generate-excel?token={TOKEN}",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                filename = f"relatorio_geografia_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Relatório Excel geográfico gerado: {filename}")
                return True
            else:
                print(f"❌ Erro: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        print(f"❌ Erro ao gerar relatório geográfico: {e}")
        return False

def test_generate_excel_from_template():
    """Teste 3: Gerar relatório Excel usando template"""
    print("\n📋 3. Testando geração de relatório Excel com template...")
    
    try:
        # Primeiro, vamos listar os templates disponíveis
        templates_response = requests.get(f"{BASE_URL}/templates?token={TOKEN}")
        if templates_response.status_code == 200:
            templates = templates_response.json()
            if templates:
                template_id = templates[0]['id']  # Usar o primeiro template
                
                with open('test_data.csv', 'rb') as file:
                    files = {'file': ('test_data.csv', file, 'text/csv')}
                    data = {
                        'template_id': str(template_id),
                        'title': 'Relatório com Template'
                    }
                    
                    response = requests.post(
                        f"{BASE_URL}/reports/generate-excel-from-template?token={TOKEN}",
                        files=files,
                        data=data
                    )
                    
                    if response.status_code == 200:
                        filename = f"relatorio_template_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                        with open(filename, 'wb') as f:
                            f.write(response.content)
                        print(f"✅ Relatório Excel com template gerado: {filename}")
                        return True
                    else:
                        print(f"❌ Erro: {response.status_code} - {response.text}")
                        return False
            else:
                print("⚠️ Nenhum template encontrado. Criando um template primeiro...")
                return False
        else:
            print(f"❌ Erro ao listar templates: {templates_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro ao gerar relatório com template: {e}")
        return False

def test_generate_excel_risk():
    """Teste 4: Gerar relatório Excel de análise de risco"""
    print("\n⚠️ 4. Testando geração de relatório Excel - Análise de Risco...")
    
    try:
        with open('test_data.csv', 'rb') as file:
            files = {'file': ('test_data.csv', file, 'text/csv')}
            data = {
                'report_type': 'risk',
                'title': 'Relatório de Análise de Risco',
                'value_column': 'Total Sales',
                'include_summary': 'true',
                'include_charts': 'true'
            }
            
            response = requests.post(
                f"{BASE_URL}/reports/generate-excel?token={TOKEN}",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                filename = f"relatorio_risco_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Relatório Excel de risco gerado: {filename}")
                return True
            else:
                print(f"❌ Erro: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        print(f"❌ Erro ao gerar relatório de risco: {e}")
        return False

def main():
    """Função principal para testar geração de Excel"""
    
    print("🎯 TESTE: Geração de Relatórios Excel Automáticos")
    print("=" * 60)
    
    # Teste 1: Relatório de resumo
    test_generate_excel_summary()
    
    # Teste 2: Relatório geográfico
    test_generate_excel_geography()
    
    # Teste 3: Relatório com template
    test_generate_excel_from_template()
    
    # Teste 4: Relatório de risco
    test_generate_excel_risk()
    
    print("\n" + "=" * 60)
    print("✅ Testes de geração de Excel concluídos!")
    print("\n💡 Como usar no Swagger UI:")
    print("1. Acesse: http://localhost:8000/docs?token=SEU_TOKEN")
    print("2. Teste os endpoints:")
    print("   - POST /reports/generate-excel")
    print("   - POST /reports/generate-excel-from-template")
    print("3. Faça upload do arquivo e configure os parâmetros")
    print("4. O Excel será gerado automaticamente!")

if __name__ == "__main__":
    main() 