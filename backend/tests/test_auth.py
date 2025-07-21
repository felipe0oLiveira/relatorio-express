#!/usr/bin/env python3
"""
Script para testar autenticação com Supabase
"""

import asyncio
import httpx
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

async def test_supabase_auth():
    """Testa autenticação com Supabase"""
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_anon_key:
        print("❌ SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados no .env")
        print("📝 Veja o arquivo SUPABASE_SETUP.md para instruções")
        return
    
    print(f"🔗 Conectando ao Supabase: {supabase_url}")
    
    # Headers para Supabase
    headers = {
        "apikey": supabase_anon_key,
        "Authorization": f"Bearer {supabase_anon_key}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Testar conexão com Supabase
            response = await client.get(f"{supabase_url}/rest/v1/", headers=headers)
            
            if response.status_code == 200:
                print("✅ Conexão com Supabase estabelecida!")
                print("\n📋 Para obter um token válido:")
                print("1. Acesse o dashboard do Supabase")
                print("2. Vá para Authentication → Users")
                print("3. Crie um usuário ou use um existente")
                print("4. Use o frontend para fazer login e obter o token")
                print("\n🔧 Ou use o script de teste JavaScript:")
                print("   node test_token.js")
            else:
                print(f"❌ Erro ao conectar com Supabase: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_supabase_auth()) 