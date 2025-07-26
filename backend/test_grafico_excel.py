#!/usr/bin/env python3
"""
Teste específico para verificar geração de gráficos no Excel
"""

import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjZMaWIzaEE4cEJMb1owbTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3ZwdG9xenVxY2F6cmpienBrbXN4LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiY2Y5NzEwMC0wYTQxLTQxZWUtYTg5OS05NmQzNzJkMjViZjMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzNDg0MDQxLCJpYXQiOjE3NTM0ODA0NDEsImVtYWlsIjoibWVzc2lAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6Im1lc3NpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImJjZjk3MTAwLTBhNDEtNDFlZS1hODk5LTk2ZDM3MmQyNWJmMyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzUzNDgwNDQxfV0sInNlc3Npb25faWQiOiI4YjA3NjAyYS01MDU1LTQ5ZmMtOTFiYi05OTZlZjBkZWU1YWMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.SYMjzRe8_Tk-Hkl5TEB-NeRkPvsOvS-XasO9GT1yhMo"

def test_excel_with_charts():
    """Testa geração de Excel com gráficos"""
    
    print("🧪 Testando geração de Excel com gráficos...")
    
    # Dados de teste
    test_data = """Region,Total,Date,Product
West,270000000,2024-01-01,Product A
Northeast,186000000,2024-01-02,Product B
Southeast,163000000,2024-01-03,Product C
South,145000000,2024-01-04,Product A
Midwest,136000000,2024-01-05,Product B
West,250000000,2024-01-06,Product C
Northeast,180000000,2024-01-07,Product A
Southeast,160000000,2024-01-08,Product B"""
    
    # Preparar arquivo
    files = {
        'file': ('test_charts.csv', test_data, 'text/csv')
    }
    
    data = {
        'report_type': 'geography',
        'title': 'Teste de Gráficos',
        'include_charts': 'true',
        'include_summary': 'true',
        'value_column': 'Total',
        'region_column': 'Region'
    }
    
    headers = {
        'Authorization': f'Bearer {TOKEN}'
    }
    
    try:
        print("📤 Enviando requisição...")
        response = requests.post(
            f"{BASE_URL}/reports/generate-excel",
            files=files,
            data=data,
            headers=headers
        )
        
        if response.status_code == 200:
            print("✅ Excel gerado com sucesso!")
            print(f"📊 Tamanho do arquivo: {len(response.content)} bytes")
            
            # Salvar arquivo para verificar
            with open('teste_graficos.xlsx', 'wb') as f:
                f.write(response.content)
            print("💾 Arquivo salvo como 'teste_graficos.xlsx'")
            print("🔍 Abra o arquivo e verifique se há gráficos na aba 'Análise Geográfica'")
            
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📝 Resposta: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {str(e)}")

def test_openpyxl_charts():
    """Testa se o openpyxl.chart está funcionando"""
    
    print("\n🔧 Testando módulo openpyxl.chart...")
    
    try:
        from openpyxl.chart import BarChart, Reference
        from openpyxl.chart.label import DataLabelList
        print("✅ openpyxl.chart importado com sucesso!")
        
        # Testar criação de gráfico
        chart = BarChart()
        print("✅ Gráfico criado com sucesso!")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erro ao importar openpyxl.chart: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Erro ao criar gráfico: {str(e)}")
        return False

if __name__ == "__main__":
    print("🎯 TESTE DE GRÁFICOS NO EXCEL")
    print("=" * 50)
    
    # Testar módulo primeiro
    if test_openpyxl_charts():
        # Se o módulo funciona, testar endpoint
        test_excel_with_charts()
    else:
        print("❌ Módulo openpyxl.chart não está funcionando!")
        print("💡 Tente: pip install openpyxl --upgrade") 