from fastapi import Depends, HTTPException, status, Header
from typing import Optional
from ..auth.jwt_handler import jwt_validator

async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> str:
    """
    Dependência FastAPI para autenticação.
    Valida o token JWT do Supabase e retorna o user_id.
    
    Args:
        authorization: Header Authorization com o token Bearer
        
    Returns:
        str: ID do usuário autenticado
        
    Raises:
        HTTPException: Se o token for inválido ou não fornecido
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar se o header começa com "Bearer "
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de autorização inválido. Use 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extrair o token
    token = authorization.replace("Bearer ", "")
    
    try:
        # Validar o token
        payload = await jwt_validator.validate_token(token)
        
        # Extrair o user_id
        user_id = jwt_validator.get_user_id(payload)
        
        return user_id
        
    except HTTPException:
        # Re-raise HTTPExceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro na autenticação: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Alias para facilitar o uso
CurrentUser = Depends(get_current_user) 