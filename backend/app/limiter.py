from slowapi import Limiter
from slowapi.util import get_remote_address

# Instância do rate limiter, usando o IP do cliente como chave
limiter = Limiter(key_func=get_remote_address)

# Limites customizados para diferentes tipos de endpoints
UPLOAD_LIMIT = "30/minute"            # Uploads de arquivos: mais restritivo
REPORT_GENERATION_LIMIT = "5/minute"  # Geração de relatórios: processamento pesado
GENERAL_LIMIT = "100/minute"          # Consultas gerais: mais permissivo
AUTH_LIMIT = "10/minute"              # Autenticação: prevenir brute force 