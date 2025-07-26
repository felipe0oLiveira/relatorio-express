#!/usr/bin/env python3
"""
Script para verificar se a configuração do AutoReport SaaS está correta
Execute: python verify_setup.py
"""

import os
import sys
import requests
from dotenv import load_dotenv

def check_env_file():
    """Verifica se o arquivo .env existe e tem as variáveis necessárias"""
    print("🔍 Verificando arquivo .env...")
    
    env_path = "app/.env"
    if not os.path.exists(env_path):
        print("❌ Arquivo .env não encontrado em app/.env!")
        print("💡 Crie o arquivo .env em app/ com suas variáveis do Supabase")
        return False
    
    load_dotenv(env_path)
    
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY", 
        "SUPABASE_SERVICE_ROLE_KEY",
        "JWT_SECRET"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variáveis de ambiente faltando: {', '.join(missing_vars)}")
        return False
    
    print("✅ Arquivo config.env configurado corretamente")
    return True

def check_supabase_connection():
    """Verifica conexão com o Supabase"""
    print("\n🔍 Verificando conexão com Supabase...")
    
    load_dotenv("app/.env")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Credenciais do Supabase não configuradas")
        return False
    
    try:
        # Testar conexão básica
        response = requests.get(
            f"{supabase_url}/rest/v1/",
            headers={"apikey": supabase_key},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Conexão com Supabase estabelecida")
            return True
        else:
            print(f"❌ Erro na conexão: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erro de conexão: {str(e)}")
        return False

def check_database_tables():
    """Verifica se as tabelas do banco existem"""
    print("\n🔍 Verificando tabelas do banco...")
    
    load_dotenv("app/.env")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    required_tables = [
        "reports",
        "templates", 
        "user_settings",
        "backup_schedules",
        "backup_history",
        "notifications",
        "webhooks",
        "audit_logs"
    ]
    
    try:
        for table in required_tables:
            response = requests.get(
                f"{supabase_url}/rest/v1/{table}?select=count",
                headers={"apikey": supabase_key},
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Tabela {table} existe")
            else:
                print(f"❌ Tabela {table} não encontrada")
                return False
                
        return True
        
    except Exception as e:
        print(f"❌ Erro ao verificar tabelas: {str(e)}")
        return False

def check_server_status():
    """Verifica se o servidor está rodando"""
    print("\n🔍 Verificando status do servidor...")
    
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Servidor está rodando")
            return True
        else:
            print(f"❌ Servidor respondeu com status: {response.status_code}")
            return False
    except:
        print("❌ Servidor não está rodando")
        print("💡 Execute: uvicorn app.main:app --reload")
        return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print("\n🔍 Verificando dependências...")
    
    required_packages = [
        "fastapi",
        "uvicorn", 
        "supabase",
        "pandas",
        "requests"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Dependências faltando: {', '.join(missing_packages)}")
        print("💡 Execute: pip install -r app/requirements.txt")
        return False
    
    print("✅ Todas as dependências estão instaladas")
    return True

def main():
    """Função principal"""
    print("🚀 VERIFICAÇÃO DE CONFIGURAÇÃO - AUTOREPORT SAAS")
    print("=" * 60)
    
    checks = [
        ("Arquivo .env", check_env_file),
        ("Dependências", check_dependencies),
        ("Conexão Supabase", check_supabase_connection),
        ("Tabelas do Banco", check_database_tables),
        ("Status do Servidor", check_server_status)
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"❌ Erro ao verificar {check_name}: {str(e)}")
            results.append((check_name, False))
    
    # Resumo
    print("\n" + "=" * 60)
    print("📋 RESUMO DA VERIFICAÇÃO")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{status} - {check_name}")
        if result:
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} verificações passaram")
    
    if passed == total:
        print("\n🎉 CONFIGURAÇÃO COMPLETA!")
        print("✅ Seu backend está pronto para uso")
        print("\n🚀 Próximos passos:")
        print("1. Teste os endpoints no Swagger: http://localhost:8000/docs")
        print("2. Execute os testes: python test_simple.py")
        print("3. Comece o desenvolvimento do frontend")
    else:
        print("\n⚠️ CONFIGURAÇÃO INCOMPLETA")
        print("❌ Algumas verificações falharam")
        print("\n💡 Consulte o guia: GUIA_CONFIGURACAO_COMPLETA.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 