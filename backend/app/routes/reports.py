import pandas as pd
from io import BytesIO
from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Request, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import bearer_scheme
from app.models import Report, ReportCreate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from typing import List, Optional
from datetime import datetime
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from app.limiter import limiter, UPLOAD_LIMIT, REPORT_GENERATION_LIMIT, GENERAL_LIMIT, AUTH_LIMIT
from app.utils.crypto_utils import encrypt_file_bytes, decrypt_file_bytes, encrypt_data, decrypt_data

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

@router.post("/reports/upload")
@limiter.limit("30/minute")
async def upload_report_file(
    file: UploadFile = File(...),
    max_rows: int = Query(None, description="Número máximo de linhas a retornar no preview. Se não informado, retorna tudo."),
    current_user: str = CurrentUser,
    request: Request = None,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    content = await file.read()
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo sem nome não suportado")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo excede o tamanho máximo de 5MB")
    try:
        # Criptografa o arquivo antes de processar
        encrypted_content = encrypt_file_bytes(content)
        # Para processar o DataFrame, descriptografa
        decrypted_content = decrypt_file_bytes(encrypted_content)
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(decrypted_content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(decrypted_content))
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

@router.post("/reports", response_model=Report)
@limiter.limit("5/minute")
def create_report(report: ReportCreate, current_user: str = CurrentUser, request: Request = None, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        data = report.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        # Exemplo: criptografar campo sensível se existir
        if "token" in data:
            data["token"] = encrypt_data(data["token"])
        if "cpf" in data:
            data["cpf"] = encrypt_data(data["cpf"])
        response = supabase.table("reports").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reports/{report_id}")
@limiter.limit("5/minute")
def delete_report(report_id: int, current_user: str = CurrentUser, request: Request = None, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        response = supabase.table("reports").delete().eq("id", report_id).execute()
        return {"message": "Relatório deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reports/analyze")
async def analyze_report_file(
    file: UploadFile = File(...),
    current_user: str = CurrentUser
):
    import pandas as pd
    from io import BytesIO
    content = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        # Estatísticas descritivas
        stats = df.describe(include='all').to_dict()
        # Tipos de dados
        dtypes = df.dtypes.apply(lambda x: str(x)).to_dict()
        # Nulos por coluna
        nulls = df.isnull().sum().to_dict()
        # Sugestão de gráficos
        suggestions = []
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                suggestions.append({"column": col, "suggestion": "histogram/bar"})
            elif pd.api.types.is_categorical_dtype(df[col]) or df[col].dtype == object:
                suggestions.append({"column": col, "suggestion": "pie/bar"})
        return {
            "columns": list(df.columns),
            "dtypes": dtypes,
            "nulls": nulls,
            "stats": stats,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar arquivo: {str(e)}")

@router.post("/reports/analyze/custom")
async def analyze_custom_report_file(
    file: UploadFile = File(...),
    question: str = Form(...),
    current_user: str = CurrentUser
):
    import pandas as pd
    from io import BytesIO
    content = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        # Lógica simples para perguntas comuns
        q = question.lower()
        if "média" in q or "media" in q or "mean" in q:
            for col in df.select_dtypes(include='number').columns:
                if col in q:
                    return {"column": col, "mean": df[col].mean()}
            return {"means": df.mean(numeric_only=True).to_dict()}
        elif "soma" in q or "sum" in q:
            for col in df.select_dtypes(include='number').columns:
                if col in q:
                    return {"column": col, "sum": df[col].sum()}
            return {"sums": df.sum(numeric_only=True).to_dict()}
        elif "contar" in q or "count" in q:
            return {"count": len(df)}
        # Pronto para integração futura com IA
        return {"message": "Pergunta recebida, mas só posso responder perguntas simples de média, soma ou contagem por enquanto.", "question": question}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar arquivo: {str(e)}")

@router.get("/reports/dashboard/summary")
async def dashboard_summary(current_user: str = CurrentUser):
    try:
        response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
        import pandas as pd
        df = pd.DataFrame(response.data)
        if df.empty:
            return {"message": "Nenhum dado para dashboard"}
        # Exemplo de sumarização: total, por mês, por título
        summary = {
            "total_reports": len(df),
            "created_per_month": df["created_at"].str[:7].value_counts().sort_index().to_dict(),
            "reports_by_title": df["title"].value_counts().to_dict() if "title" in df.columns else {}
        }
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Função utilitária para aplicar filtros em DataFrame
def apply_filters(df, start_date: Optional[str], end_date: Optional[str], filter_col: Optional[str], filter_val: Optional[str]):
    if start_date:
        df = df[df['created_at'] >= start_date]
    if end_date:
        df = df[df['created_at'] <= end_date]
    if filter_col and filter_val and filter_col in df.columns:
        df = df[df[filter_col] == filter_val]
    return df

@router.get("/reports/dashboard/column/{col}")
async def dashboard_column(
    col: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    filter_col: Optional[str] = None,
    filter_val: Optional[str] = None,
    current_user: str = CurrentUser
):
    response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
    import pandas as pd
    df = pd.DataFrame(response.data)
    if col not in df.columns:
        raise HTTPException(status_code=400, detail="Coluna não encontrada")
    df = apply_filters(df, start_date, end_date, filter_col, filter_val)
    counts = df[col].value_counts().to_dict()
    return {"column": col, "distribution": counts}

@router.get("/reports/dashboard/stats/{col}")
async def dashboard_stats(
    col: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    filter_col: Optional[str] = None,
    filter_val: Optional[str] = None,
    current_user: str = CurrentUser
):
    response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
    import pandas as pd
    df = pd.DataFrame(response.data)
    if col not in df.columns or not pd.api.types.is_numeric_dtype(df[col]):
        raise HTTPException(status_code=400, detail="Coluna numérica não encontrada")
    df = apply_filters(df, start_date, end_date, filter_col, filter_val)
    stats = df[col].describe().to_dict()
    return {"column": col, "stats": stats}

@router.get("/reports/dashboard/timeseries")
async def dashboard_timeseries(
    col: str = "created_at",
    freq: str = "M",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    filter_col: Optional[str] = None,
    filter_val: Optional[str] = None,
    current_user: str = CurrentUser
):
    response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
    import pandas as pd
    df = pd.DataFrame(response.data)
    if col not in df.columns:
        raise HTTPException(status_code=400, detail="Coluna não encontrada")
    df = apply_filters(df, start_date, end_date, filter_col, filter_val)
    df[col] = pd.to_datetime(df[col], errors="coerce")
    ts = df.groupby(df[col].dt.to_period(freq)).size().sort_index().to_dict()
    return {"column": col, "freq": freq, "timeseries": ts}

@router.get("/reports/dashboard/pivot")
async def dashboard_pivot(
    col1: str,
    col2: str,
    agg: str = "count",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    filter_col: Optional[str] = None,
    filter_val: Optional[str] = None,
    current_user: str = CurrentUser
):
    response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
    import pandas as pd
    df = pd.DataFrame(response.data)
    if col1 not in df.columns or col2 not in df.columns:
        raise HTTPException(status_code=400, detail="Colunas não encontradas")
    df = apply_filters(df, start_date, end_date, filter_col, filter_val)
    if agg == "count":
        pivot = pd.pivot_table(df, index=col1, columns=col2, aggfunc="size", fill_value=0)
    elif agg == "sum":
        num_cols = df.select_dtypes(include='number').columns
        if len(num_cols) == 0:
            raise HTTPException(status_code=400, detail="Nenhuma coluna numérica para somar")
        pivot = pd.pivot_table(df, index=col1, columns=col2, values=num_cols[0], aggfunc="sum", fill_value=0)
    else:
        raise HTTPException(status_code=400, detail="Agregação não suportada")
    return {"pivot": pivot.to_dict()}

@router.get("/reports/dashboard/outliers/{col}")
async def dashboard_outliers(
    col: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    filter_col: Optional[str] = None,
    filter_val: Optional[str] = None,
    current_user: str = CurrentUser
):
    response = supabase.table("reports").select("*").eq("user_id", current_user).execute()
    import pandas as pd
    df = pd.DataFrame(response.data)
    if col not in df.columns or not pd.api.types.is_numeric_dtype(df[col]):
        raise HTTPException(status_code=400, detail="Coluna numérica não encontrada")
    df = apply_filters(df, start_date, end_date, filter_col, filter_val)
    q1 = df[col].quantile(0.25)
    q3 = df[col].quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    outliers = df[(df[col] < lower) | (df[col] > upper)][col].tolist()
    return {"column": col, "outliers": outliers, "lower": lower, "upper": upper} 