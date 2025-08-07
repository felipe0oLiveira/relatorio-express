from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reports, auth, templates, users, analytics, backup, ai_assistant, data_preparation, collaboration
from app.services.supabase_client import supabase
from app.limiter import limiter, UPLOAD_LIMIT, REPORT_GENERATION_LIMIT, GENERAL_LIMIT, AUTH_LIMIT
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from slowapi.errors import RateLimitExceeded
from app.security import bearer_scheme

app = FastAPI(
    title="AutoReport SaaS",
    version="0.1.0",
    description="API para automação de relatórios personalizados",
    docs_url="/docs",
    redoc_url=None
)

app.include_router(reports.router)
app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(users.router)
app.include_router(analytics.router)
app.include_router(backup.router)
app.include_router(ai_assistant.router)
app.include_router(data_preparation.router)
app.include_router(collaboration.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend local
        "http://localhost:3001",  # Frontend alternativo
        "http://127.0.0.1:3000",  # Frontend local (IP)
        "http://127.0.0.1:3001",  # Frontend alternativo (IP)
        "https://accounts.google.com",  # Google Auth
        "https://www.googleapis.com",   # Google APIs
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
)

app.state.limiter = limiter

@app.middleware("http")
async def add_user_id_to_request(request: Request, call_next):
    # Tenta extrair o user_id do JWT (se autenticado)
    user_id = None
    authorization = request.headers.get("authorization")
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        try:
            from app.auth.jwt_handler import jwt_validator
            payload = await jwt_validator.validate_token(token)
            user_id = jwt_validator.get_user_id(payload)
        except Exception:
            pass
    request.state.user_id = user_id
    response = await call_next(request)
    return response

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Tente novamente em instantes."}
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/test-supabase")
def test_supabase():
    # Tenta buscar os dados de uma tabela de exemplo
    try:
        response = supabase.table("reports").select("*").limit(5).execute()
        return {"data": response.data}
    except Exception as e:
        return {"error": str(e)}

@app.post("/test-supabase")
def insert_supabase():
    # Tenta inserir um registro de exemplo
    try:
        response = supabase.table("test_table").insert({"name": "Exemplo"}).execute()
        return {"data": response.data}
    except Exception as e:
        return {"error": str(e)}

@app.get("/test-uploaded-data")
def test_uploaded_data():
    """
    Endpoint de teste para verificar se a tabela uploaded_data está funcionando
    """
    try:
        # Teste 1: Verificar se a tabela existe
        response = supabase.table("uploaded_data").select("id").limit(1).execute()
        return {
            "status": "success",
            "message": "Tabela uploaded_data existe e está acessível",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erro ao acessar tabela uploaded_data: {str(e)}",
            "error": str(e)
        }

@app.post("/test-direct-insert")
def test_direct_insert():
    """
    Endpoint de teste para inserção direta no banco (bypass RLS)
    """
    try:
        from datetime import datetime
        
        # Dados de teste - usar um UUID que existe ou remover user_id
        test_data = {
            # 'user_id': '00000000-0000-0000-0000-000000000000',  # Comentado para evitar FK constraint
            'workspace_name': 'Teste Direto',
            'description': 'Teste de inserção direta',
            'file_type': 'excel',
            'data_location': 'local',
            'table_name': 'teste_direto',
            'first_row_headers': True,
            'date_format': 'dd MMM yyyy HH:mm:ss',
            'error_handling': 'empty',
            'original_filename': 'teste.xlsx',
            'data': [{"coluna": "valor"}],  # JSONB
            'columns': ['coluna'],  # Array
            'row_count': 1,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        print(f"🧪 Tentando inserção direta: {test_data}")
        
        # Tentar inserir
        response = supabase.table("uploaded_data").insert(test_data).execute()
        
        print(f"✅ Resposta da inserção: {response}")
        
        return {
            "status": "success",
            "message": "Inserção direta realizada com sucesso",
            "data": response.data
        }
    except Exception as e:
        print(f"❌ Erro na inserção direta: {e}")
        return {
            "status": "error",
            "message": f"Erro na inserção direta: {str(e)}",
            "error": str(e)
        } 