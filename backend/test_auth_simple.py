#!/usr/bin/env python3
"""
Script simples para testar autenticação
"""

import requests

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

def test_auth_header():
    """Testa autenticação via header"""
    print("🔍 Testando autenticação via header...")
    
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "accept": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/reports", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Autenticação via header funcionando!")
        data = response.json()
        print(f"📊 Encontrados {len(data)} relatórios")
    else:
        print(f"❌ Erro: {response.text}")

def test_auth_query():
    """Testa autenticação via query parameter"""
    print("\n🔍 Testando autenticação via query parameter...")
    
    response = requests.get(f"{BASE_URL}/reports?token={TOKEN}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Autenticação via query parameter funcionando!")
        data = response.json()
        print(f"📊 Encontrados {len(data)} relatórios")
    else:
        print(f"❌ Erro: {response.text}")

def test_auth_direct():
    """Testa autenticação com token direto no header"""
    print("\n🔍 Testando autenticação com token direto...")
    
    headers = {
        "Authorization": TOKEN,  # Sem "Bearer "
        "accept": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/reports", headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Autenticação com token direto funcionando!")
        data = response.json()
        print(f"📊 Encontrados {len(data)} relatórios")
    else:
        print(f"❌ Erro: {response.text}")

if __name__ == "__main__":
    print("🚀 Testando diferentes métodos de autenticação...")
    print(f"📡 Servidor: {BASE_URL}")
    print(f"🔑 Token: {TOKEN[:50]}...")
    
    test_auth_header()
    test_auth_query()
    test_auth_direct()
    
    print("\n✅ Testes concluídos!") 