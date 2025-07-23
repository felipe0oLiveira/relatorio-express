from fastapi import FastAPI
from app.routes import reports, auth, templates, users
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