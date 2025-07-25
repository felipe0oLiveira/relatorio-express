from fastapi import Depends, HTTPException, status, Header, Query
from typing import Optional
from ..auth.jwt_handler import jwt_validator

async def get_current_user(
    authorization: Optional[str] = Header(None, convert_underscores=False),
    token: Optional[str] = Query(None, description="Token JWT para autenticação"),
    auth_token: Optional[str] = Query(None, alias="auth_token", description="Token JWT alternativo")
) -> str:
    """
    Dependência FastAPI para autenticação.
    Valida o token JWT do Supabase e retorna o user_id.
    
    Aceita token via:
    1. Header Authorization: "Bearer <token>"
    2. Query parameter: ?token=<token>
    
    Args:
        authorization: Header Authorization com o token Bearer
        token: Token JWT via query parameter (para facilitar testes)
        
    Returns:
        str: ID do usuário autenticado
        
    Raises:
        HTTPException: Se o token for inválido ou não fornecido
    """
    # Determinar qual token usar
    jwt_token = None
    
    if authorization:
        # Verificar se o header começa com "Bearer "
        if authorization.startswith("Bearer "):
            jwt_token = authorization.replace("Bearer ", "")
        elif not authorization.startswith("Bearer "):
            # Se não tem "Bearer ", assume que é o token direto
            jwt_token = authorization
    
    elif token:
        # Usar token via query parameter
        jwt_token = token
    elif auth_token:
        # Usar token alternativo via query parameter
        jwt_token = auth_token
    
    if not jwt_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização não fornecido. Use 'Bearer <token>' no header ou ?token=<token> na URL",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Validar o token
        payload = await jwt_validator.validate_token(jwt_token)
        
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