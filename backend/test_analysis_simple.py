#!/usr/bin/env python3
"""
Script simples para testar análise geográfica
"""

import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

def test_analysis_geography():
    """Testa análise geográfica"""
    print("🌍 Testando análise geográfica...")
    
    # Criar dados de teste
    test_data = """Region,Total Sale,Units Sold
Norte,1000,50
Sul,2000,100
Leste,1500,75
Oeste,3000,150
Norte,800,40
Sul,2500,125"""
    
    # Configuração do teste
    files = {
        'file': ('test_data.csv', test_data, 'text/csv')
    }
    
    data = {
        'geo_col': 'Region',
        'value_col': 'Total Sale',
        'agg': 'sum'
    }
    
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/reports/analyze/geography",
            headers=headers,
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