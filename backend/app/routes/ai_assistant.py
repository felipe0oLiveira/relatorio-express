from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, List, Any
import pandas as pd
from app.services.ai_assistant import AIAssistant
from app.dependencies.auth import get_current_user
from app.services.supabase_client import supabase

router = APIRouter(prefix="/ai-assistant", tags=["AI Assistant"])

ai_assistant = AIAssistant()

@router.post("/ask")
async def ask_question(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Faz uma pergunta em linguagem natural sobre os dados
    """
    try:
        question = request.get('question')
        data_id = request.get('data_id')
        
        if not question or not data_id:
            raise HTTPException(status_code=400, detail="Pergunta e data_id são obrigatórios")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Processa a pergunta
        result = await ai_assistant.ask_question(question, data, current_user['id'])
        
        return {
            'success': True,
            'result': result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar pergunta: {str(e)}")

@router.post("/automated-insights")
async def get_automated_insights(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Gera insights automatizados sobre os dados
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Gera insights automatizados
        insights = await ai_assistant.get_automated_insights(data, current_user['id'])
        
        return {
            'success': True,
            'insights': insights
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar insights: {str(e)}")

@router.post("/advanced-analysis")
async def advanced_analysis(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Realiza análises avançadas específicas
    """
    try:
        data_id = request.get('data_id')
        analysis_type = request.get('analysis_type', 'general')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Realiza análise avançada
        analysis = await ai_assistant.ai_service.analyze_data(data, analysis_type)
        
        return {
            'success': True,
            'analysis': analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise avançada: {str(e)}")

@router.post("/seasonality-analysis")
async def seasonality_analysis(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Análise específica de sazonalidade
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Análise de sazonalidade
        analysis = await ai_assistant.ai_service._seasonality_analysis(data)
        
        return {
            'success': True,
            'seasonality': analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise de sazonalidade: {str(e)}")

@router.post("/clustering-analysis")
async def clustering_analysis(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Análise específica de clustering
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Análise de clustering
        analysis = await ai_assistant.ai_service._clustering_analysis(data)
        
        return {
            'success': True,
            'clustering': analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise de clustering: {str(e)}")

@router.post("/distribution-analysis")
async def distribution_analysis(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Análise específica de distribuição
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Análise de distribuição
        analysis = await ai_assistant.ai_service._distribution_analysis(data)
        
        return {
            'success': True,
            'distribution': analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise de distribuição: {str(e)}")

@router.post("/prediction-analysis")
async def prediction_analysis(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Análise preditiva específica
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Análise preditiva
        analysis = await ai_assistant.ai_service._prediction_analysis(data)
        
        return {
            'success': True,
            'prediction': analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise preditiva: {str(e)}")

@router.post("/suggest-questions")
async def suggest_questions(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Sugere perguntas baseadas nos dados
    """
    try:
        data_id = request.get('data_id')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Gera sugestões baseadas nos tipos de dados
        suggestions = []
        
        numeric_cols = data.select_dtypes(include=['number']).columns
        categorical_cols = data.select_dtypes(include=['object']).columns
        
        if len(numeric_cols) > 0:
            suggestions.append({
                'question': f'Qual é a média de {numeric_cols[0]}?',
                'category': 'descriptive',
                'confidence': 0.9
            })
            
            if len(numeric_cols) > 1:
                suggestions.append({
                    'question': f'Existe correlação entre {numeric_cols[0]} e {numeric_cols[1]}?',
                    'category': 'correlation',
                    'confidence': 0.8
                })
                
                suggestions.append({
                    'question': f'Quais são os outliers em {numeric_cols[0]}?',
                    'category': 'outlier',
                    'confidence': 0.8
                })
                
                suggestions.append({
                    'question': f'Como é a distribuição de {numeric_cols[0]}?',
                    'category': 'distribution',
                    'confidence': 0.9
                })
        
        if len(categorical_cols) > 0:
            suggestions.append({
                'question': f'Qual é a distribuição de {categorical_cols[0]}?',
                'category': 'descriptive',
                'confidence': 0.9
            })
        
        # Verifica se há colunas de data
        date_cols = []
        for col in data.columns:
            if data[col].dtype == 'object':
                try:
                    pd.to_datetime(data[col].iloc[0])
                    date_cols.append(col)
                except:
                    continue
        
        if date_cols:
            suggestions.append({
                'question': f'Como {numeric_cols[0] if len(numeric_cols) > 0 else "os dados"} variam ao longo do tempo?',
                'category': 'trend',
                'confidence': 0.8
            })
            
            suggestions.append({
                'question': f'Existe sazonalidade em {numeric_cols[0] if len(numeric_cols) > 0 else "os dados"}?',
                'category': 'seasonality',
                'confidence': 0.7
            })
        
        # Sugestões avançadas
        if len(numeric_cols) >= 2:
            suggestions.append({
                'question': f'Posso identificar grupos naturais nos dados?',
                'category': 'clustering',
                'confidence': 0.7
            })
            
            suggestions.append({
                'question': f'Posso prever {numeric_cols[0]} baseado em {numeric_cols[1]}?',
                'category': 'prediction',
                'confidence': 0.6
            })
        
        return {
            'success': True,
            'suggestions': suggestions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar sugestões: {str(e)}")

@router.get("/conversation-history")
async def get_conversation_history(
    data_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém histórico de conversas sobre um dataset
    """
    try:
        response = supabase.table('ai_conversations').select('*').eq('data_id', data_id).eq('user_id', current_user['id']).order('created_at', desc=True).execute()
        
        conversations = []
        for conv in response.data:
            conversations.append({
                'id': conv['id'],
                'question': conv['question'],
                'answer': conv['answer'],
                'created_at': conv['created_at'],
                'confidence': conv.get('confidence', 0.8)
            })
        
        return {
            'success': True,
            'conversations': conversations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar histórico: {str(e)}")

@router.post("/save-conversation")
async def save_conversation(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Salva uma conversa no histórico
    """
    try:
        data_id = request.get('data_id')
        question = request.get('question')
        answer = request.get('answer')
        confidence = request.get('confidence', 0.8)
        
        if not all([data_id, question, answer]):
            raise HTTPException(status_code=400, detail="data_id, question e answer são obrigatórios")
        
        conversation_data = {
            'data_id': data_id,
            'user_id': current_user['id'],
            'question': question,
            'answer': answer,
            'confidence': confidence,
            'created_at': pd.Timestamp.now().isoformat()
        }
        
        response = supabase.table('ai_conversations').insert(conversation_data).execute()
        
        if response.data:
            return {
                'success': True,
                'message': 'Conversa salva com sucesso'
            }
        
        raise HTTPException(status_code=500, detail="Erro ao salvar conversa")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar conversa: {str(e)}") 