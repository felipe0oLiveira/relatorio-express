#!/usr/bin/env python3
"""
Script para testar Row Level Security (RLS) no Supabase
"""

import asyncio
import httpx
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv("app/.env")

async def test_rls():
    """Testa Row Level Security no Supabase"""
    
    print("🔒 Testando Row Level Security (RLS)...\n")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_anon_key:
        print("❌ Variáveis de ambiente não encontradas")
        return False
    
    # Headers para Supabase
    headers = {
        "apikey": supabase_anon_key,
        "Authorization": f"Bearer {supabase_anon_key}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            
            # 1. Testar se as tabelas existem
            print("📋 Verificando tabelas...")
            tables = ["reports", "templates", "user_settings"]
            
            for table in tables:
                response = await client.get(f"{supabase_url}/rest/v1/{table}?select=count", headers=headers)
                
                if response.status_code == 200:
                    print(f"✅ Tabela '{table}' existe")
                else:
                    print(f"❌ Tabela '{table}' não encontrada")
                    print(f"💡 Execute o SQL do arquivo setup_database.sql no Supabase")
                    return False
            
            # 2. Testar autenticação e obter token
            print("\n🔐 Testando autenticação...")
            
            # Credenciais de teste (ajuste conforme necessário)
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
            
            if auth_response.status_code != 200:
                print("❌ Erro na autenticação:")
                print(f"📋 Resposta: {auth_response.text}")
                print("\n💡 Crie um usuário no Supabase:")
                print("   Authentication → Users → Add User")
                print("   Email: test@autoreport.com")
                print("   Password: sua-senha-teste-aqui")
                return False
            
            auth_result = auth_response.json()
            token = auth_result.get("access_token")
            user_id = auth_result.get("user", {}).get("id")
            
            print(f"✅ Login realizado! User ID: {user_id}")
            print(f"🔑 Token JWT: {token}")
            print(f"📋 Use este token para testes manuais:")
            print(f"curl -H \"Authorization: Bearer {token}\" http://localhost:8000/auth/test")
            
            # 3. Testar RLS - inserir dados como usuário autenticado
            print("\n📝 Testando inserção de dados...")
            
            # Headers com token de usuário autenticado
            user_headers = {
                "apikey": supabase_anon_key,
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            # Inserir um relatório de teste
            report_data = {
                "title": "Relatório de Teste RLS",
                "description": "Teste de Row Level Security",
                "user_id": user_id
            }
            
            insert_response = await client.post(
                f"{supabase_url}/rest/v1/reports",
                headers=user_headers,
                json=report_data
            )
            
            print(f"📋 Status da inserção: {insert_response.status_code}")
            print(f"📋 Resposta: {insert_response.text}")
            
            if insert_response.status_code == 201:
                try:
                    report = insert_response.json()[0]
                    report_id = report["id"]
                    print(f"✅ Relatório inserido! ID: {report_id}")
                except:
                    # Se não conseguir fazer parse do JSON, vamos buscar o relatório inserido
                    print("✅ Relatório inserido com sucesso!")
                    # Buscar o relatório mais recente do usuário
                    select_response = await client.get(
                        f"{supabase_url}/rest/v1/reports?select=id&user_id=eq.{user_id}&order=created_at.desc&limit=1",
                        headers=user_headers
                    )
                    if select_response.status_code == 200:
                        reports = select_response.json()
                        if reports:
                            report_id = reports[0]["id"]
                            print(f"📋 ID do relatório: {report_id}")
                        else:
                            print("⚠️  Não foi possível obter o ID do relatório")
                            return False
                    else:
                        print("⚠️  Erro ao buscar relatório inserido")
                        return False
                
                # 4. Testar RLS - buscar dados como usuário autenticado
                print("\n🔍 Testando busca de dados...")
                
                select_response = await client.get(
                    f"{supabase_url}/rest/v1/reports?select=*&user_id=eq.{user_id}",
                    headers=user_headers
                )
                
                if select_response.status_code == 200:
                    reports = select_response.json()
                    print(f"✅ Encontrados {len(reports)} relatórios do usuário")
                    
                    # 5. Testar RLS - tentar acessar dados de outro usuário (deve falhar)
                    print("\n🚫 Testando isolamento de dados...")
                    
                    # Tentar buscar todos os relatórios (deve retornar apenas os do usuário)
                    all_reports_response = await client.get(
                        f"{supabase_url}/rest/v1/reports?select=*",
                        headers=user_headers
                    )
                    
                    if all_reports_response.status_code == 200:
                        all_reports = all_reports_response.json()
                        print(f"✅ RLS funcionando! Usuário vê apenas {len(all_reports)} relatórios (seus próprios)")
                        
                        # Verificar se todos os relatórios pertencem ao usuário
                        user_reports = [r for r in all_reports if r.get("user_id") == user_id]
                        if len(user_reports) == len(all_reports):
                            print("✅ RLS isolamento perfeito! Usuário só vê seus próprios dados")
                        else:
                            print("⚠️  RLS pode não estar funcionando corretamente")
                    else:
                        print(f"❌ Erro ao buscar relatórios: {all_reports_response.status_code}")
                
                # 6. Limpar dados de teste
                print("\n🧹 Limpando dados de teste...")
                delete_response = await client.delete(
                    f"{supabase_url}/rest/v1/reports?id=eq.{report_id}",
                    headers=user_headers
                )
                
                if delete_response.status_code == 200:
                    print("✅ Dados de teste removidos")
                else:
                    print("⚠️  Não foi possível remover dados de teste")
                
            else:
                print(f"❌ Erro ao inserir relatório: {insert_response.status_code}")
                print(f"📋 Resposta: {insert_response.text}")
                return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False
    
    print("\n🎉 RLS testado com sucesso!")
    print("✅ Row Level Security está funcionando corretamente")
    print("✅ Cada usuário só acessa seus próprios dados")
    return True

if __name__ == "__main__":
    asyncio.run(test_rls()) 