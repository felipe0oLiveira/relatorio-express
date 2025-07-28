from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, List, Any
import pandas as pd
from app.services.data_preparation import DataPreparationService
from app.dependencies.auth import get_current_user
from app.services.supabase_client import supabase

router = APIRouter(prefix="/data-preparation", tags=["Data Preparation"])

data_prep_service = DataPreparationService()

@router.post("/prepare")
async def prepare_data(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Executa operações de preparação de dados
    """
    try:
        data_id = request.get('data_id')
        operations = request.get('operations', [])
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Executa as operações de preparação
        result = await data_prep_service.prepare_data(data, operations)
        
        # Salva os dados processados
        processed_data = result['data'].to_dict('records')
        
        # Atualiza os dados no banco
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'preparation_report': result['report'],
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'report': result['report'],
            'operations': result['operations'],
            'message': f'Dados preparados com sucesso. {result["report"]["operations_applied"]} operações aplicadas.'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao preparar dados: {str(e)}")

@router.post("/quality-report")
async def get_quality_report(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Gera relatório de qualidade dos dados
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
        
        # Gera relatório de qualidade
        quality_report = await data_prep_service.get_data_quality_report(data)
        
        return {
            'success': True,
            'quality_report': quality_report
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar relatório: {str(e)}")

@router.post("/suggest-operations")
async def suggest_operations(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Sugere operações de preparação baseadas na qualidade dos dados
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
        
        # Sugere operações
        suggestions = await data_prep_service.suggest_preparation_steps(data)
        
        return {
            'success': True,
            'suggestions': suggestions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar sugestões: {str(e)}")

@router.post("/clean-missing")
async def clean_missing_values(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Limpa valores ausentes dos dados
    """
    try:
        data_id = request.get('data_id')
        strategy = request.get('strategy', 'drop')
        fill_value = request.get('fill_value')
        columns = request.get('columns')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Aplica limpeza
        cleaned_data = data_prep_service._clean_missing_values(data, strategy, fill_value, columns)
        
        # Salva os dados limpos
        processed_data = cleaned_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': f'Valores ausentes limpos com sucesso usando estratégia: {strategy}',
            'rows_removed': len(data) - len(cleaned_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar valores ausentes: {str(e)}")

@router.post("/remove-duplicates")
async def remove_duplicates(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Remove linhas duplicadas dos dados
    """
    try:
        data_id = request.get('data_id')
        subset = request.get('subset')
        keep = request.get('keep', 'first')
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Remove duplicatas
        cleaned_data = data_prep_service._remove_duplicates(data, subset, keep)
        
        # Salva os dados limpos
        processed_data = cleaned_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': 'Duplicatas removidas com sucesso',
            'rows_removed': len(data) - len(cleaned_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao remover duplicatas: {str(e)}")

@router.post("/convert-types")
async def convert_data_types(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Converte tipos de dados das colunas
    """
    try:
        data_id = request.get('data_id')
        conversions = request.get('conversions', {})
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Converte tipos
        converted_data = data_prep_service._convert_data_types(data, conversions)
        
        # Salva os dados convertidos
        processed_data = converted_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': f'Tipos de dados convertidos: {list(conversions.keys())}'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao converter tipos: {str(e)}")

@router.post("/create-features")
async def create_derived_features(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Cria novas features derivadas dos dados existentes
    """
    try:
        data_id = request.get('data_id')
        features = request.get('features', [])
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Cria features
        enhanced_data = data_prep_service._create_derived_features(data, features)
        
        # Salva os dados com novas features
        processed_data = enhanced_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': f'{len(features)} novas features criadas com sucesso',
            'new_columns': [feature['name'] for feature in features]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar features: {str(e)}")

@router.post("/filter-data")
async def filter_data(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Filtra dados baseado em condições
    """
    try:
        data_id = request.get('data_id')
        conditions = request.get('conditions', [])
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Filtra dados
        filtered_data = data_prep_service._filter_data(data, conditions)
        
        # Salva os dados filtrados
        processed_data = filtered_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': f'Dados filtrados com sucesso. {len(filtered_data)} linhas mantidas.',
            'rows_removed': len(data) - len(filtered_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao filtrar dados: {str(e)}")

@router.post("/aggregate-data")
async def aggregate_data(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Agrega dados por grupos
    """
    try:
        data_id = request.get('data_id')
        group_by = request.get('group_by', [])
        aggregations = request.get('aggregations', {})
        
        if not data_id:
            raise HTTPException(status_code=400, detail="data_id é obrigatório")
        
        # Busca os dados do banco
        response = supabase.table('uploaded_data').select('*').eq('id', data_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Dados não encontrados")
        
        # Converte para DataFrame
        data = pd.DataFrame(response.data[0]['data'])
        
        # Agrega dados
        aggregated_data = data_prep_service._aggregate_data(data, group_by, aggregations)
        
        # Salva os dados agregados
        processed_data = aggregated_data.to_dict('records')
        
        supabase.table('uploaded_data').update({
            'data': processed_data,
            'updated_at': pd.Timestamp.now().isoformat()
        }).eq('id', data_id).execute()
        
        return {
            'success': True,
            'message': f'Dados agregados com sucesso por {len(group_by)} coluna(s)',
            'rows_after_aggregation': len(aggregated_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao agregar dados: {str(e)}") 