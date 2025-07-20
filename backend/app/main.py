from fastapi import FastAPI
from app.routes import reports, auth
from app.services.supabase_client import supabase

app = FastAPI()
app.include_router(reports.router)
app.include_router(auth.router)

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