#!/usr/bin/env python3
"""
Script para testar toda a configuração do Supabase
"""

import asyncio
import httpx
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

async def test_supabase_setup():
    """Testa toda a configuração do Supabase"""
    
    print("🔧 Testando configuração do Supabase...\n")
    
    # Verificar variáveis de ambiente
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not all([supabase_url, supabase_anon_key, supabase_service_key]):
        print("❌ Variáveis de ambiente não configuradas!")
        print("📝 Crie um arquivo .env no diretório backend/ com:")
        print("   SUPABASE_URL=https://seu-projeto.supabase.co")
        print("   SUPABASE_ANON_KEY=sua-chave-anon")
        print("   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role")
        return False
    
    print("✅ Variáveis de ambiente configuradas")
    print(f"🔗 URL: {supabase_url}")
    print(f"🔑 Anon Key: {supabase_anon_key[:20]}...")
    print(f"🔐 Service Key: {supabase_service_key[:20]}...\n")
    
    # Testar conexão com Supabase
    headers = {
        "apikey": supabase_anon_key,
        "Authorization": f"Bearer {supabase_anon_key}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Testar API REST
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            
            if response.status_code == 200:
                print("✅ Conexão com Supabase estabelecida")
            else:
                print(f"❌ Erro na conexão: {response.status_code}")
                return False
            
            # Testar se as tabelas existem
            tables_to_test = ["reports", "templates", "user_settings"]
            
            for table in tables_to_test:
                response = await client.get(f"{supabase_url}/rest/v1/{table}?select=count", headers=headers)
                
                if response.status_code == 200:
                    print(f"✅ Tabela '{table}' existe e está acessível")
                else:
                    print(f"❌ Tabela '{table}' não encontrada ou não acessível")
            
            # Testar autenticação
            print("\n🔐 Testando autenticação...")
            
            # Tentar fazer login com usuário de teste
            auth_data = {
                "email": "test@autoreport.com",
                "password": "sua-senha-teste-aqui"  # Substitua pela senha real
            }
            
            auth_response = await client.post(
                f"{supabase_url}/auth/v1/token?grant_type=password",
                headers={
                    "apikey": supabase_anon_key,
                    "Content-Type": "application/json"
                },
                json=auth_data
            )
            
            if auth_response.status_code == 200:
                auth_result = auth_response.json()
                token = auth_result.get("access_token")
                user_id = auth_result.get("user", {}).get("id")
                
                print("✅ Login realizado com sucesso!")
                print(f"👤 User ID: {user_id}")
                print(f"🔑 Token: {token[:50]}...")
                
                # Testar o token no nosso backend
                print("\n🧪 Testando token no backend...")
                
                backend_response = await client.get(
                    "http://localhost:8000/auth/test",
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if backend_response.status_code == 200:
                    backend_result = backend_response.json()
                    print("✅ Backend respondeu corretamente!")
                    print(f"📋 Resposta: {backend_result}")
                else:
                    print(f"❌ Erro no backend: {backend_response.status_code}")
                    print(f"📋 Resposta: {backend_response.text}")
                
            else:
                print("❌ Erro no login:")
                print(f"📋 Resposta: {auth_response.text}")
                print("\n💡 Dica: Crie um usuário no dashboard do Supabase:")
                print("   1. Authentication → Users → Add User")
                print("   2. Email: test@autoreport.com")
                print("   3. Password: sua-senha-teste-aqui")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False
    
    print("\n🎉 Configuração testada com sucesso!")
    return True

if __name__ == "__main__":
    asyncio.run(test_supabase_setup()) 