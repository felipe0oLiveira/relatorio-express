from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from app.dependencies.auth import CurrentUser
from app.services.supabase_client import supabase
from typing import List, Optional
from datetime import datetime
import httpx
import json

router = APIRouter()

class NotificationService:
    @staticmethod
    async def send_email_notification(user_email: str, subject: str, message: str):
        """Envia notificação por email (integração futura com SendGrid/Mailgun)"""
        # TODO: Implementar integração com serviço de email
        print(f"📧 Email enviado para {user_email}: {subject}")
        return True
    
    @staticmethod
    async def send_webhook_notification(webhook_url: str, data: dict):
        """Envia notificação via webhook"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    webhook_url,
                    json=data,
                    headers={"Content-Type": "application/json"}
                )
                return response.status_code == 200
        except Exception as e:
            print(f"❌ Erro ao enviar webhook: {e}")
            return False

@router.post("/notifications/send")
async def send_notification(
    background_tasks: BackgroundTasks,
    user_id: str,
    notification_type: str,
    message: str,
    webhook_url: Optional[str] = None,
    current_user: str = CurrentUser
):
    """Envia notificação para um usuário específico"""
    try:
        # Buscar dados do usuário
        user_response = supabase.table("users").select("email").eq("id", user_id).single().execute()
        if not user_response.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        user_email = user_response.data["email"]
        
        # Criar registro de notificação
        notification_data = {
            "user_id": user_id,
            "type": notification_type,
            "message": message,
            "sent_at": datetime.utcnow().isoformat(),
            "status": "pending"
        }
        
        response = supabase.table("notifications").insert(notification_data).execute()
        
        # Enviar notificação em background
        background_tasks.add_task(
            NotificationService.send_email_notification,
            user_email,
            f"AutoReport - {notification_type}",
            message
        )
        
        # Enviar webhook se configurado
        if webhook_url:
            background_tasks.add_task(
                NotificationService.send_webhook_notification,
                webhook_url,
                {
                    "user_id": user_id,
                    "type": notification_type,
                    "message": message,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        
        return {"message": "Notificação enviada com sucesso", "notification_id": response.data[0]["id"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notifications")
async def list_notifications(current_user: str = CurrentUser):
    """Lista notificações do usuário atual"""
    try:
        response = supabase.table("notifications").select("*").eq("user_id", current_user).order("sent_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int, current_user: str = CurrentUser):
    """Marca notificação como lida"""
    try:
        response = supabase.table("notifications").update({"read_at": datetime.utcnow().isoformat()}).eq("id", notification_id).eq("user_id", current_user).execute()
        return {"message": "Notificação marcada como lida"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhooks/configure")
async def configure_webhook(
    webhook_url: str,
    events: List[str],
    current_user: str = CurrentUser
):
    """Configura webhook para o usuário"""
    try:
        webhook_data = {
            "user_id": current_user,
            "url": webhook_url,
            "events": events,
            "active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("webhooks").insert(webhook_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 