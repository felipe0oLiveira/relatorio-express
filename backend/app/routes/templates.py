from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPAuthorizationCredentials
from app.models import Template, TemplateCreate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from app.security import bearer_scheme
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/templates", response_model=List[Template])
def list_templates(current_user: str = CurrentUser):
    try:
        response = supabase.table("templates").select("*").eq("user_id", current_user).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates/{template_id}", response_model=Template)
def get_template(template_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("templates").select("*").eq("id", template_id).eq("user_id", current_user).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Template não encontrado")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Template não encontrado: " + str(e))

@router.post("/templates", response_model=Template)
def create_template(template: TemplateCreate, current_user: str = CurrentUser):
    try:
        data = template.dict()
        data["user_id"] = current_user
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("templates").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/templates/{template_id}", response_model=Template)
def update_template(template_id: int, template: TemplateCreate, current_user: str = CurrentUser):
    try:
        data = template.dict()
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("templates").update(data).eq("id", template_id).eq("user_id", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Template não encontrado ou sem permissão")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/templates/{template_id}")
def delete_template(template_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("templates").delete().eq("id", template_id).eq("user_id", current_user).execute()
        return {"message": "Template deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 