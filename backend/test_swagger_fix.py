#!/usr/bin/env python3
"""
Script para testar e corrigir problemas de autenticação no Swagger UI
"""

import requests
import json

# Configurações
BASE_URL = "http://localhost:8000"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token JWT

def test_server():
    """Testa se o servidor está funcionando"""
    print("🔍 Testando se o servidor está funcionando...")
    
    try:
        response = requests.get(f"{BASE_URL}/test-auth")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Servidor funcionando!")
            print(f"Resposta: {response.json()}")
        else:
            print(f"❌ Erro no servidor: {response.text}")
    except Exception as e:
        print(f"❌ Erro ao conectar com servidor: {e}")

def test_reports_with_query():
    """Testa /reports com token via query parameter"""
    print("\n🔍 Testando /reports com token via query parameter...")
    
    try:
        response = requests.get(f"{BASE_URL}/reports?token={TOKEN}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Autenticação via query parameter funcionando!")
            data = response.json()
            print(f"📊 Encontrados {len(data)} relatórios")
        else:
            print(f"❌ Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

def test_reports_with_auth_token():
    """Testa /reports com auth_token via query parameter"""
    print("\n🔍 Testando /reports com auth_token via query parameter...")
    
    try:
        response = requests.get(f"{BASE_URL}/reports?auth_token={TOKEN}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Autenticação via auth_token funcionando!")
            data = response.json()
            print(f"📊 Encontrados {len(data)} relatórios")
        else:
            print(f"❌ Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

def test_reports_with_header():
    """Testa /reports com token via header"""
    print("\n🔍 Testando /reports com token via header...")
    
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "accept": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/reports", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Autenticação via header funcionando!")
            data = response.json()
            print(f"📊 Encontrados {len(data)} relatórios")
        else:
            print(f"❌ Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

if __name__ == "__main__":
    print("🚀 Testando diferentes métodos de autenticação...")
    print(f"📡 Servidor: {BASE_URL}")
    print(f"🔑 Token: {TOKEN[:50]}...")
    
    test_server()
    test_reports_with_query()
    test_reports_with_auth_token()
    test_reports_with_header()
    
    print("\n✅ Testes concluídos!")
    print("\n📝 Para usar no Swagger UI:")
    print("1. Use o endpoint /reports?token=SEU_TOKEN")
    print("2. Ou use o endpoint /reports?auth_token=SEU_TOKEN")
    print("3. Ou configure o header Authorization: Bearer SEU_TOKEN") 