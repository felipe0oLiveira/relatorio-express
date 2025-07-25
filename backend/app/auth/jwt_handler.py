import jwt
import httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class SupabaseJWTValidator:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "https://example.supabase.co")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "example-key")
        
        # Apenas avisar se as variáveis não estiverem configuradas
        if not os.getenv("SUPABASE_URL") or not os.getenv("SUPABASE_ANON_KEY"):
            print("⚠️  AVISO: SUPABASE_URL e SUPABASE_ANON_KEY não configurados. Usando valores padrão para desenvolvimento.")
    
    async def validate_token(self, token: str) -> Dict[str, Any]:
        """
        Validação simplificada do token JWT do Supabase.
        Em produção, implemente validação completa com JWKS.
        """
        try:
            # Limpar o token de possíveis espaços ou caracteres extras
            token = token.strip()
            
            # Remover "Bearer " se presente
            if token.startswith("Bearer "):
                token = token[7:]
            
            # Para teste, vamos apenas decodificar sem verificar assinatura
            # Em produção, você deve validar com as chaves públicas do Supabase
            payload = jwt.decode(
                token,
                options={"verify_signature": False}  # ⚠️ APENAS PARA TESTE
            )
            
            # Verificar se o token não expirou
            if 'exp' in payload:
                import time
                if time.time() > payload['exp']:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Token expirado"
                    )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado"
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Erro na validação do token: {str(e)}"
            )
    
    def get_user_id(self, payload: Dict[str, Any]) -> str:
        """Extrai o user_id do payload do JWT"""
        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID não encontrado no token"
            )
        return user_id

# Instância global do validador
jwt_validator = SupabaseJWTValidator() 