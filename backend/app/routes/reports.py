import pandas as pd
from io import BytesIO
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from app.models import Report, ReportCreate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from typing import List
from datetime import datetime

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.get("/reports", response_model=List[Report])
def list_reports(current_user: str = CurrentUser):
    try:
        response = supabase.table("reports").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/{report_id}", response_model=Report)
def get_report(report_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("reports").select("*").eq("id", report_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Relatório não encontrado: " + str(e))

@router.post("/reports", response_model=Report)
def create_report(report: ReportCreate, current_user: str = CurrentUser):
    try:
        data = report.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("reports").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reports/{report_id}")
def delete_report(report_id: int, current_user: str = CurrentUser):
    try:
        response = supabase.table("reports").delete().eq("id", report_id).execute()
        return {"message": "Relatório deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reports/upload")
async def upload_report_file(
    file: UploadFile = File(...),
    max_rows: int = Query(None, description="Número máximo de linhas a retornar no preview. Se não informado, retorna tudo."),
    current_user: str = CurrentUser
):
    content = await file.read()
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo sem nome não suportado")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo excede o tamanho máximo de 5MB")
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        df = df.where(pd.notnull(df), None)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar arquivo: {str(e)}")
    if max_rows is not None:
        preview = df.head(max_rows).to_dict(orient="records")
    else:
        preview = df.to_dict(orient="records")
    return {
        "columns": df.columns.tolist(),
        "preview": preview
    } 