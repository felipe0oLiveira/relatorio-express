#!/usr/bin/env python3
"""
Script para testar análise geográfica
"""

import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

def test_analysis_geography():
    """Testa análise geográfica"""
    print("🌍 Testando análise geográfica...")
    
    # Criar dados de teste baseados na planilha
    test_data = """Region,Total Sale,Operating Profit,Units Sold
Northeast,600000,300000,1000
South,500000,150000,1250
West,625000,312500,900
Northeast,400000,200000,800
South,300000,90000,600
West,450000,225000,750"""
    
    # Configuração do teste
    files = {
        'file': ('test_data.csv', test_data, 'text/csv')
    }
    
    data = {
        'geo_col': 'Region',
        'value_col': 'Total Sale',
        'agg': 'sum'
    }
    
    params = {
        'token': TOKEN
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/reports/analyze/geography",
            params=params,
            files=files,
            data=data
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Análise geográfica realizada com sucesso!")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Erro: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

if __name__ == "__main__":
    print("🚀 Testando análise geográfica...")
    print(f"📡 Servidor: {BASE_URL}")
    print(f"🔑 Token: {TOKEN[:50]}...")
    
    test_analysis_geography()
    
    print("\n✅ Teste concluído!") 