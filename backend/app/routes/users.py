from fastapi import APIRouter, HTTPException
from app.models import UserProfile, UserProfileUpdate, UserSettings, UserSettingsUpdate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from typing import Optional
from datetime import datetime

router = APIRouter()

@router.get("/users/me", response_model=UserProfile)
def get_profile(current_user: str = CurrentUser):
    try:
        # Buscar dados do usuário na tabela auth.users do Supabase
        response = supabase.table("users").select("id, email, full_name, phone, created_at").eq("id", current_user).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/me", response_model=UserProfile)
def update_profile(update: UserProfileUpdate, current_user: str = CurrentUser):
    try:
        data = update.dict(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("users").update(data).eq("id", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users/me/settings", response_model=UserSettings)
def get_settings(current_user: str = CurrentUser):
    try:
        response = supabase.table("user_settings").select("*").eq("user_id", current_user).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Configurações não encontradas")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/me/settings", response_model=UserSettings)
def update_settings(update: UserSettingsUpdate, current_user: str = CurrentUser):
    try:
        data = update.dict(exclude_unset=True)
        if not data:
            raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("user_settings").update(data).eq("user_id", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Configurações não encontradas")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 