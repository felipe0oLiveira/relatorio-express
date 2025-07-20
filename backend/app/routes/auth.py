from fastapi import APIRouter
from app.dependencies.auth import CurrentUser

router = APIRouter()

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