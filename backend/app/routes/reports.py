import pandas as pd
from io import BytesIO
from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Request, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from app.security import bearer_scheme
from app.models import Report, ReportCreate
from app.services.supabase_client import supabase
from app.dependencies.auth import CurrentUser
from typing import List, Optional, Dict
from datetime import datetime
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from app.limiter import limiter, UPLOAD_LIMIT, REPORT_GENERATION_LIMIT, GENERAL_LIMIT, AUTH_LIMIT
from app.utils.crypto_utils import encrypt_file_bytes, decrypt_file_bytes, encrypt_data, decrypt_data
import numpy as np

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.get("/test-auth")
def test_auth():
    """Endpoint de teste para verificar se o servidor está funcionando"""
    return {"message": "Servidor funcionando!", "status": "ok"}

@router.get("/test-token")
def test_token(token: str = Query(..., description="Token para teste")):
    """Endpoint de teste para verificar se o token está funcionando"""
    try:
        import jwt
        # Decodificar sem verificar assinatura
        payload = jwt.decode(token.strip(), options={"verify_signature": False})
        return {
            "message": "Token válido!",
            "user_id": payload.get('sub'),
            "email": payload.get('email'),
            "exp": payload.get('exp')
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

@router.post("/analyze-columns-simple")
async def analyze_columns_simple(
    file: UploadFile = File(...)
):
    """Lista as colunas disponíveis no arquivo (sem autenticação)"""
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
        
        return {
            "columns": df.columns.tolist(),
            "sample_data": df.head(3).to_dict(orient="records"),
            "total_rows": len(df)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar colunas: {str(e)}")

@router.post("/reports/analyze/columns")
async def analyze_columns(
    file: UploadFile = File(...),
    token: str = Query(None, description="Token JWT para autenticação"),
    current_user: str = CurrentUser
):
    """Lista as colunas disponíveis no arquivo"""
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
        
        return {
            "columns": df.columns.tolist(),
            "sample_data": df.head(3).to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar colunas: {str(e)}")

@router.get("/reports", response_model=List[Report])
def list_reports(current_user: str = CurrentUser):
    try:
        print(f"🔍 Usuário autenticado: {current_user}")
        response = supabase.table("reports").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"❌ Erro ao buscar relatórios: {e}")
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

@router.post("/reports/analyze/trend")
async def analyze_trend(
    file: UploadFile = File(...),
    date_col: str = Form(...),
    value_col: str = Form(...),
    freq: str = Form("M"),  # Mês por padrão
    current_user: str = CurrentUser
):
    """
    Analisa tendências e sazonalidade de uma métrica ao longo do tempo.
    """
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
        df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
        df = df.dropna(subset=[date_col, value_col])
        df = df.sort_values(date_col)
        ts = df.groupby(df[date_col].dt.to_period(freq))[value_col].sum()
        trend = ts.rolling(window=3, min_periods=1).mean().tolist()
        return {
            "periods": ts.index.astype(str).tolist(),
            "values": ts.tolist(),
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar tendência: {str(e)}")

@router.post("/reports/analyze/risk-score")
async def analyze_risk_score(
    file: UploadFile = File(...),
    score_cols: str = Form(...),  # Ex: "idade,renda,dividas"
    weights: str = Form(None),    # Ex: "0.3,0.5,0.2"
    current_user: str = CurrentUser
):
    """
    Calcula score de risco/probabilidade baseado em variáveis do Excel.
    """
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
        cols = [c.strip() for c in score_cols.split(",")]
        if weights:
            w = [float(x) for x in weights.split(",")]
            if len(w) != len(cols):
                raise HTTPException(status_code=400, detail="Número de pesos diferente do número de colunas")
        else:
            w = [1.0/len(cols)]*len(cols)
        df = df.dropna(subset=cols)
        # Normalizar colunas
        for i, c in enumerate(cols):
            col_min = df[c].min()
            col_max = df[c].max()
            if col_max > col_min:
                df[c] = (df[c] - col_min) / (col_max - col_min)
            else:
                df[c] = 0.0
        df["risk_score"] = np.dot(df[cols], w)
        return {
            "scores": df["risk_score"].round(3).tolist(),
            "summary": {
                "min": float(df["risk_score"].min()),
                "max": float(df["risk_score"].max()),
                "mean": float(df["risk_score"].mean()),
                "std": float(df["risk_score"].std())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao calcular score de risco: {str(e)}")

@router.post("/reports/analyze/geography")
async def analyze_geography(
    file: UploadFile = File(...),
    geo_col: str = Form(...),
    value_col: str = Form(None),
    agg: str = Form("count"),  # count, sum, mean
    token: str = Query(None, description="Token JWT para autenticação"),
    current_user: str = CurrentUser
):
    """
    Agrupa e sumariza dados por região, estado ou cidade.
    """
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
        if geo_col not in df.columns:
            raise HTTPException(status_code=400, detail="Coluna geográfica não encontrada")
        if agg == "count":
            result = df[geo_col].value_counts().to_dict()
        elif agg in ("sum", "mean") and value_col:
            if value_col not in df.columns:
                raise HTTPException(status_code=400, detail="Coluna de valor não encontrada")
            if agg == "sum":
                result = df.groupby(geo_col)[value_col].sum().to_dict()
            else:
                result = df.groupby(geo_col)[value_col].mean().to_dict()
        else:
            raise HTTPException(status_code=400, detail="Agregação não suportada ou coluna de valor ausente")
        return {"geo_summary": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao analisar geografia: {str(e)}")

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

@router.post("/reports/generate-excel")
@limiter.limit("10/minute")
async def generate_excel_report(
    file: UploadFile = File(...),
    report_type: str = Form(..., description="Tipo de relatório: 'summary', 'geography', 'trend', 'risk', 'custom'"),
    title: str = Form("Relatório Automático", description="Título do relatório"),
    include_charts: bool = Form(True, description="Incluir gráficos no Excel"),
    include_summary: bool = Form(True, description="Incluir resumo executivo"),
    custom_analysis: Optional[str] = Form(None, description="Análise customizada (para report_type='custom')"),
    value_column: Optional[str] = Form(None, description="Coluna de valores para análises"),
    region_column: Optional[str] = Form(None, description="Coluna de região para análise geográfica"),
    date_column: Optional[str] = Form(None, description="Coluna de data para análise temporal"),
    current_user: str = CurrentUser,
    request: Request = None
):
    """
    Gera relatório em Excel automaticamente com base nos dados fornecidos
    """
    try:
        # Ler o arquivo
        content = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        
        # Criar arquivo Excel na memória
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Aba 1: Dados Originais
            df.to_excel(writer, sheet_name='Dados Originais', index=False)
            
            # Aba 2: Resumo Estatístico
            if include_summary:
                summary_stats = df.describe()
                summary_stats.to_excel(writer, sheet_name='Resumo Estatístico')
                
                # Adicionar informações gerais
                summary_info = pd.DataFrame({
                    'Métrica': ['Total de Registros', 'Total de Colunas', 'Data de Geração'],
                    'Valor': [len(df), len(df.columns), datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
                })
                summary_info.to_excel(writer, sheet_name='Resumo Estatístico', startrow=len(summary_stats) + 3, index=False)
            
            # Aba 3: Análise Específica baseada no tipo
            if report_type == 'summary':
                # Análise geral
                analysis_sheet = pd.DataFrame({
                    'Análise': ['Tipo de Relatório', 'Total de Registros', 'Colunas Disponíveis'],
                    'Valor': ['Resumo Geral', len(df), ', '.join(df.columns.tolist())]
                })
                analysis_sheet.to_excel(writer, sheet_name='Análise Geral', index=False)
                
            elif report_type == 'geography' and region_column and value_column:
                # Análise geográfica
                if region_column in df.columns and value_column in df.columns:
                    geo_analysis = df.groupby(region_column)[value_column].agg(['sum', 'mean', 'count']).reset_index()
                    geo_analysis.columns = [region_column, 'Total', 'Média', 'Quantidade']
                    geo_analysis['Percentual'] = (geo_analysis['Total'] / geo_analysis['Total'].sum() * 100).round(2)
                    geo_analysis.to_excel(writer, sheet_name='Análise Geográfica', index=False)
                
            elif report_type == 'trend' and date_column and value_column:
                # Análise temporal
                if date_column in df.columns and value_column in df.columns:
                    # Converter para datetime se possível
                    try:
                        df[date_column] = pd.to_datetime(df[date_column])
                        trend_analysis = df.groupby(df[date_column].dt.to_period('M'))[value_column].agg(['sum', 'mean']).reset_index()
                        trend_analysis.columns = ['Período', 'Total', 'Média']
                        trend_analysis.to_excel(writer, sheet_name='Análise Temporal', index=False)
                    except:
                        # Se não conseguir converter, agrupar por valores únicos
                        trend_analysis = df.groupby(date_column)[value_column].agg(['sum', 'mean']).reset_index()
                        trend_analysis.columns = [date_column, 'Total', 'Média']
                        trend_analysis.to_excel(writer, sheet_name='Análise Temporal', index=False)
                
            elif report_type == 'risk' and value_column:
                # Análise de risco
                if value_column in df.columns:
                    # Calcular estatísticas de risco
                    risk_stats = pd.DataFrame({
                        'Métrica': ['Média', 'Desvio Padrão', 'Mínimo', 'Máximo', 'Mediana'],
                        'Valor': [
                            df[value_column].mean(),
                            df[value_column].std(),
                            df[value_column].min(),
                            df[value_column].max(),
                            df[value_column].median()
                        ]
                    })
                    risk_stats.to_excel(writer, sheet_name='Análise de Risco', index=False)
                    
                    # Identificar outliers
                    Q1 = df[value_column].quantile(0.25)
                    Q3 = df[value_column].quantile(0.75)
                    IQR = Q3 - Q1
                    outliers = df[(df[value_column] < Q1 - 1.5 * IQR) | (df[value_column] > Q3 + 1.5 * IQR)]
                    if len(outliers) > 0:
                        outliers.to_excel(writer, sheet_name='Outliers', index=False)
                
            elif report_type == 'custom' and custom_analysis:
                # Análise customizada
                custom_sheet = pd.DataFrame({
                    'Análise Customizada': [custom_analysis],
                    'Data de Geração': [datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
                    'Total de Registros': [len(df)]
                })
                custom_sheet.to_excel(writer, sheet_name='Análise Customizada', index=False)
            
            # Aba 4: Metadados
            metadata = pd.DataFrame({
                'Campo': ['Título do Relatório', 'Tipo de Análise', 'Arquivo Original', 'Data de Geração', 'Usuário'],
                'Valor': [title, report_type, file.filename, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), current_user]
            })
            metadata.to_excel(writer, sheet_name='Metadados', index=False)
        
        # Preparar resposta
        output.seek(0)
        filename = f"relatorio_{report_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            BytesIO(output.getvalue()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar relatório Excel: {str(e)}")

@router.post("/reports/generate-excel-from-template")
@limiter.limit("10/minute")
async def generate_excel_from_template(
    file: UploadFile = File(...),
    template_id: int = Form(..., description="ID do template a ser usado"),
    title: str = Form("Relatório com Template", description="Título do relatório"),
    current_user: str = CurrentUser,
    request: Request = None
):
    """
    Gera relatório em Excel usando um template pré-configurado
    """
    try:
        # Buscar o template
        template_response = supabase.table("templates").select("*").eq("id", template_id).eq("user_id", current_user).single().execute()
        if not template_response.data:
            raise HTTPException(status_code=404, detail="Template não encontrado")
        
        template = template_response.data
        config = template['config']
        
        # Ler o arquivo
        content = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        
        # Criar arquivo Excel na memória
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Aba 1: Dados Originais
            df.to_excel(writer, sheet_name='Dados Originais', index=False)
            
            # Aba 2: Análise baseada no template
            analysis_type = config.get('analysis_type')
            
            if analysis_type == 'geography':
                value_col = config.get('value_column')
                region_col = config.get('region_column')
                
                if value_col in df.columns and region_col in df.columns:
                    geo_analysis = df.groupby(region_col)[value_col].agg(['sum', 'mean', 'count']).reset_index()
                    geo_analysis.columns = [region_col, 'Total', 'Média', 'Quantidade']
                    geo_analysis['Percentual'] = (geo_analysis['Total'] / geo_analysis['Total'].sum() * 100).round(2)
                    geo_analysis.to_excel(writer, sheet_name='Análise Geográfica', index=False)
            
            elif analysis_type == 'trend':
                date_col = config.get('date_column')
                value_col = config.get('value_column')
                
                if date_col in df.columns and value_col in df.columns:
                    try:
                        df[date_col] = pd.to_datetime(df[date_col])
                        trend_analysis = df.groupby(df[date_col].dt.to_period('M'))[value_col].agg(['sum', 'mean']).reset_index()
                        trend_analysis.columns = ['Período', 'Total', 'Média']
                        trend_analysis.to_excel(writer, sheet_name='Análise Temporal', index=False)
                    except:
                        trend_analysis = df.groupby(date_col)[value_col].agg(['sum', 'mean']).reset_index()
                        trend_analysis.columns = [date_col, 'Total', 'Média']
                        trend_analysis.to_excel(writer, sheet_name='Análise Temporal', index=False)
            
            elif analysis_type == 'risk-score':
                # Análise de risco baseada no template
                risk_factors = config.get('risk_factors', [])
                if risk_factors:
                    risk_data = []
                    for factor in risk_factors:
                        col = factor.get('column')
                        if col in df.columns:
                            risk_data.append({
                                'Fator': col,
                                'Média': df[col].mean(),
                                'Desvio Padrão': df[col].std(),
                                'Peso': factor.get('weight', 0)
                            })
                    
                    if risk_data:
                        risk_df = pd.DataFrame(risk_data)
                        risk_df.to_excel(writer, sheet_name='Análise de Risco', index=False)
            
            # Aba 3: Configuração do Template
            template_info = pd.DataFrame({
                'Campo': ['Nome do Template', 'Descrição', 'Tipo de Análise', 'Configuração'],
                'Valor': [template['name'], template['description'], analysis_type, str(config)]
            })
            template_info.to_excel(writer, sheet_name='Template Info', index=False)
            
            # Aba 4: Metadados
            metadata = pd.DataFrame({
                'Campo': ['Título do Relatório', 'Template Usado', 'Arquivo Original', 'Data de Geração', 'Usuário'],
                'Valor': [title, template['name'], file.filename, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), current_user]
            })
            metadata.to_excel(writer, sheet_name='Metadados', index=False)
        
        # Preparar resposta
        output.seek(0)
        filename = f"relatorio_template_{template['name'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            BytesIO(output.getvalue()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar relatório Excel com template: {str(e)}") 