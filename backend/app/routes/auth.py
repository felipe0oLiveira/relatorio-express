from fastapi import APIRouter, HTTPException, status, Body
import os
import httpx
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

@router.post("/auth/signup")
async def signup(email: str = Body(...), password: str = Body(...)):
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
    data = {"email": email, "password": password}
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=data)
        print(resp.json())  # Debug: ver a resposta real do Supabase
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.json())
        result = resp.json()
        user_id = result.get("id")
        if not user_id and "user" in result and result["user"]:
            user_id = result["user"].get("id")
        if not user_id:
            raise HTTPException(status_code=500, detail="Usuário criado, mas user_id não retornado.")
        # Cria o registro em user_settings
        try:
            supabase.table("user_settings").insert({"user_id": user_id}).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao criar user_settings: {str(e)}")
        return result

@router.post("/auth/signin")
async def signin(email: str = Body(...), password: str = Body(...)):
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
    data = {"email": email, "password": password}
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=data)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.json())
        return resp.json()

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