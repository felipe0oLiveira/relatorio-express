from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel
import os
import httpx
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str = None
    company: str = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    access_token: str

@router.post("/auth/signup")
async def signup(request: SignupRequest):
    """
    Endpoint para cadastro de novo usuário no Supabase Auth e criação do registro em user_settings.
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Supabase não configurado.")
    
    url = f"{SUPABASE_URL}/auth/v1/signup"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    # Dados para o Supabase Auth
    auth_data = {
        "email": request.email, 
        "password": request.password
    }
    
    # Adicionar dados customizados se fornecidos
    if request.name or request.company:
        auth_data["data"] = {}
        if request.name:
            auth_data["data"]["name"] = request.name
        if request.company:
            auth_data["data"]["company"] = request.company
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=auth_data)
        print(f"Supabase response: {resp.json()}")  # Debug
        
        if resp.status_code != 200:
            error_detail = resp.json()
            print(f"Supabase error: {error_detail}")  # Debug
            raise HTTPException(status_code=resp.status_code, detail=error_detail)
        
        result = resp.json()
        user_id = result.get("id")
        if not user_id and "user" in result and result["user"]:
            user_id = result["user"].get("id")
        
        if not user_id:
            raise HTTPException(status_code=500, detail="Usuário criado, mas user_id não retornado.")
        
        # Cria o registro em user_settings com dados adicionais
        try:
            user_settings_data = {"user_id": user_id}
            if request.name:
                user_settings_data["name"] = request.name
            if request.company:
                user_settings_data["company"] = request.company
            
            supabase.table("user_settings").insert(user_settings_data).execute()
            print(f"User settings created for user_id: {user_id}")  # Debug
        except Exception as e:
            print(f"Error creating user_settings: {str(e)}")  # Debug
            raise HTTPException(status_code=500, detail=f"Erro ao criar user_settings: {str(e)}")
        
        return result

@router.post("/auth/signin")
async def signin(request: LoginRequest):
    """
    Endpoint para login de usuário no Supabase Auth e obtenção do token JWT.
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Supabase não configurado.")
    
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    data = {"email": request.email, "password": request.password}
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=data)
        if resp.status_code != 200:
            error_detail = resp.json()
            print(f"Login error: {error_detail}")  # Debug
            raise HTTPException(status_code=resp.status_code, detail=error_detail)
        
        result = resp.json()
        print(f"Login successful: {result}")  # Debug
        return result

@router.post("/auth/google")
async def google_auth(request: GoogleAuthRequest):
    """
    Endpoint para autenticação com Google usando verificação manual de JWT.
    """
    print(f"Google auth request received: {request.access_token[:50]}...")  # Debug
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("❌ Supabase não configurado")
        raise HTTPException(status_code=500, detail="Supabase não configurado.")
    
    if not GOOGLE_CLIENT_ID:
        print("❌ Google Client ID não configurado")
        raise HTTPException(status_code=500, detail="Google Client ID não configurado.")
    
    print(f"✅ Configurações verificadas - Supabase: {SUPABASE_URL}, Google Client ID: {GOOGLE_CLIENT_ID}")
    
    # Verificar formato básico do token
    if not request.access_token or len(request.access_token) < 10:
        print("❌ Token muito curto ou vazio")
        raise HTTPException(status_code=400, detail="Token inválido: muito curto")
    
    # Verificar se o token tem o formato JWT correto (3 partes)
    token_parts = request.access_token.split('.')
    if len(token_parts) != 3:
        print(f"❌ Token não tem formato JWT correto: {len(token_parts)} partes")
        raise HTTPException(status_code=400, detail=f"Token inválido: formato incorreto ({len(token_parts)} partes)")
    
    print(f"✅ Token tem formato correto: {len(token_parts)} partes")
    
    # Verificar o token do Google
    try:
        # Decodificar o JWT do Google para obter informações do usuário
        import jwt
        from jwt import PyJWKClient
        
        # URL para obter as chaves públicas do Google
        jwks_url = "https://www.googleapis.com/oauth2/v3/certs"
        
        print("🔍 Decodificando token JWT do Google...")
        
        # Decodificar o token sem verificar a assinatura primeiro para obter o kid
        try:
            unverified_token = jwt.decode(request.access_token, options={"verify_signature": False})
            print(f"📋 Token decodificado (não verificado): {unverified_token}")
        except Exception as e:
            print(f"❌ Erro ao decodificar token (não verificado): {str(e)}")
            raise HTTPException(status_code=400, detail="Token inválido: não pode ser decodificado")
        
        # Obter as chaves públicas do Google
        print("🔑 Obtendo chaves públicas do Google...")
        async with httpx.AsyncClient() as client:
            jwks_response = await client.get(jwks_url)
            if jwks_response.status_code != 200:
                print(f"❌ Erro ao obter chaves do Google: {jwks_response.status_code}")
                raise HTTPException(status_code=400, detail="Erro ao obter chaves de verificação do Google")
            
            jwks = jwks_response.json()
            print(f"✅ Chaves obtidas: {len(jwks['keys'])} chaves disponíveis")
            
            # Encontrar a chave correta
            kid = unverified_token.get('kid')
            print(f"🔍 Procurando chave com kid: {kid}")
            
            key = None
            for k in jwks['keys']:
                if k['kid'] == kid:
                    key = k
                    break
            
            if not key:
                print(f"❌ Chave com kid {kid} não encontrada")
                raise HTTPException(status_code=400, detail="Chave de verificação não encontrada")
            
            print("✅ Chave de verificação encontrada")
            
            # Verificar o token
            print("🔐 Verificando assinatura do token...")
            try:
                decoded_token = jwt.decode(
                    request.access_token,
                    key,
                    algorithms=['RS256'],
                    audience=GOOGLE_CLIENT_ID,
                    issuer='https://accounts.google.com'
                )
                
                print(f"✅ Token verificado com sucesso: {decoded_token}")
            except jwt.InvalidTokenError as e:
                print(f"❌ Erro na verificação do token: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Token inválido: {str(e)}")
            
            # Extrair informações do usuário
            user_email = decoded_token.get('email')
            user_name = decoded_token.get('name', '')
            user_picture = decoded_token.get('picture', '')
            
            if not user_email:
                print("❌ Email não encontrado no token")
                raise HTTPException(status_code=400, detail="Email não encontrado no token")
            
            print(f"👤 Informações do usuário: {user_email}, {user_name}")
            
            # Criar ou obter usuário no Supabase
            print("🔄 Criando/obtendo usuário no Supabase...")
            url = f"{SUPABASE_URL}/auth/v1/admin/users"
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            }
            
            # Verificar se o usuário já existe
            user_data = {
                "email": user_email,
                "email_confirm": True,
                "user_metadata": {
                    "name": user_name,
                    "picture": user_picture,
                    "provider": "google"
                }
            }
            
            print(f"📤 Enviando dados para Supabase: {user_data}")
            
            # Tentar criar o usuário (se não existir, será criado)
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, headers=headers, json=user_data)
                print(f"📥 Resposta do Supabase: {resp.status_code}")
                
                if resp.status_code == 200:
                    user_result = resp.json()
                    user_id = user_result.get('id')
                    print(f"✅ Usuário criado/obtido com sucesso: {user_id}")
                    
                    # Gerar token de acesso
                    print("🔑 Gerando token de acesso...")
                    token_url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
                    token_data = {
                        "email": user_email,
                        "password": "google_auth_user"  # Senha temporária
                    }
                    
                    token_resp = await client.post(token_url, headers=headers, json=token_data)
                    print(f"📥 Resposta do token: {token_resp.status_code}")
                    
                    if token_resp.status_code == 200:
                        token_result = token_resp.json()
                        print("✅ Token gerado com sucesso")
                        return token_result
                    else:
                        print(f"⚠️ Não foi possível gerar token, retornando dados do usuário")
                        # Se não conseguir gerar token, retornar dados do usuário
                        return {
                            "access_token": f"google_{user_id}",
                            "refresh_token": f"google_refresh_{user_id}",
                            "user": user_result
                        }
                else:
                    print(f"❌ Erro ao criar usuário no Supabase: {resp.status_code}")
                    print(f"📋 Resposta: {resp.text}")
                    # Se não conseguir criar usuário, retornar erro
                    raise HTTPException(status_code=400, detail="Erro ao criar usuário no Supabase")
                    
    except jwt.InvalidTokenError as e:
        print(f"❌ Erro de validação JWT: {str(e)}")
        raise HTTPException(status_code=400, detail="Token do Google inválido")
    except Exception as e:
        print(f"❌ Exceção na autenticação Google: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro na autenticação Google: {str(e)}")

@router.get("/auth/test")
async def test_auth(current_user: str = CurrentUser):
    """
    Endpoint de teste para verificar se a autenticação está funcionando.
    Retorna informações do usuário autenticado.
    """
    return {
        "message": "Autenticação funcionando!",
        "user_id": current_user,
        "authenticated": True
    } 