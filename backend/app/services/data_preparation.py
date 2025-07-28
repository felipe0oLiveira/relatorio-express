import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import re

class DataPreparationService:
    """
    Serviço de preparação de dados similar ao Data Studio do Zoho Analytics
    Oferece limpeza, transformação e enriquecimento de dados
    """
    
    def __init__(self):
        self.transformations = {
            'clean_missing': self._clean_missing_values,
            'remove_duplicates': self._remove_duplicates,
            'convert_types': self._convert_data_types,
            'normalize_text': self._normalize_text_columns,
            'create_features': self._create_derived_features,
            'filter_data': self._filter_data,
            'aggregate_data': self._aggregate_data,
            'split_columns': self._split_columns,
            'merge_columns': self._merge_columns,
            'date_operations': self._date_operations
        }
    
    async def prepare_data(self, data: pd.DataFrame, operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executa uma série de operações de preparação de dados
        """
        original_shape = data.shape
        processed_data = data.copy()
        applied_operations = []
        
        for operation in operations:
            op_type = operation.get('type')
            params = operation.get('params', {})
            
            if op_type in self.transformations:
                try:
                    processed_data = self.transformations[op_type](processed_data, **params)
                    applied_operations.append({
                        'type': op_type,
                        'params': params,
                        'status': 'success'
                    })
                except Exception as e:
                    applied_operations.append({
                        'type': op_type,
                        'params': params,
                        'status': 'error',
                        'error': str(e)
                    })
        
        # Gera relatório de preparação
        preparation_report = self._generate_preparation_report(
            original_shape, processed_data.shape, applied_operations
        )
        
        return {
            'data': processed_data,
            'report': preparation_report,
            'operations': applied_operations
        }
    
    def _clean_missing_values(self, data: pd.DataFrame, strategy: str = 'drop', 
                             fill_value: Any = None, columns: Optional[List[str]] = None) -> pd.DataFrame:
        """
        Limpa valores ausentes usando diferentes estratégias
        """
        if columns is None:
            columns = data.columns
        
        if strategy == 'drop':
            return data.dropna(subset=columns)
        elif strategy == 'fill':
            if fill_value is not None:
                return data[columns].fillna(fill_value)
            else:
                # Preenchimento inteligente baseado no tipo de dados
                for col in columns:
                    if data[col].dtype in ['int64', 'float64']:
                        data[col] = data[col].fillna(data[col].median())
                    else:
                        data[col] = data[col].fillna(data[col].mode().iloc[0] if not data[col].mode().empty else 'Unknown')
                return data
        elif strategy == 'interpolate':
            return data.interpolate(method='linear')
        
        return data
    
    def _remove_duplicates(self, data: pd.DataFrame, subset: Optional[List[str]] = None, 
                          keep: str = 'first') -> pd.DataFrame:
        """
        Remove linhas duplicadas
        """
        return data.drop_duplicates(subset=subset, keep=keep)
    
    def _convert_data_types(self, data: pd.DataFrame, conversions: Dict[str, str]) -> pd.DataFrame:
        """
        Converte tipos de dados das colunas
        """
        for column, target_type in conversions.items():
            if column in data.columns:
                try:
                    if target_type == 'datetime':
                        data[column] = pd.to_datetime(data[column], errors='coerce')
                    elif target_type == 'numeric':
                        data[column] = pd.to_numeric(data[column], errors='coerce')
                    elif target_type == 'category':
                        data[column] = data[column].astype('category')
                    elif target_type == 'string':
                        data[column] = data[column].astype(str)
                except Exception:
                    pass  # Mantém o tipo original se a conversão falhar
        
        return data
    
    def _normalize_text_columns(self, data: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
        """
        Normaliza colunas de texto (remove acentos, converte para minúsculas, etc.)
        """
        for column in columns:
            if column in data.columns:
                # Remove acentos e converte para minúsculas
                data[column] = data[column].astype(str).str.lower()
                # Remove caracteres especiais
                data[column] = data[column].str.replace(r'[^\w\s]', '', regex=True)
                # Remove espaços extras
                data[column] = data[column].str.strip()
        
        return data
    
    def _create_derived_features(self, data: pd.DataFrame, features: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Cria novas features derivadas dos dados existentes
        """
        for feature in features:
            feature_name = feature.get('name')
            operation = feature.get('operation')
            source_columns = feature.get('source_columns', [])
            
            if operation == 'sum':
                data[feature_name] = data[source_columns].sum(axis=1)
            elif operation == 'average':
                data[feature_name] = data[source_columns].mean(axis=1)
            elif operation == 'difference':
                if len(source_columns) == 2:
                    data[feature_name] = data[source_columns[0]] - data[source_columns[1]]
            elif operation == 'ratio':
                if len(source_columns) == 2:
                    data[feature_name] = data[source_columns[0]] / data[source_columns[1]].replace(0, np.nan)
            elif operation == 'concatenate':
                data[feature_name] = data[source_columns].astype(str).agg('_'.join, axis=1)
            elif operation == 'extract_year':
                if len(source_columns) == 1:
                    data[feature_name] = pd.to_datetime(data[source_columns[0]], errors='coerce').dt.year
            elif operation == 'extract_month':
                if len(source_columns) == 1:
                    data[feature_name] = pd.to_datetime(data[source_columns[0]], errors='coerce').dt.month
        
        return data
    
    def _filter_data(self, data: pd.DataFrame, conditions: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Filtra dados baseado em condições
        """
        mask = pd.Series([True] * len(data))
        
        for condition in conditions:
            column = condition.get('column')
            operator = condition.get('operator')
            value = condition.get('value')
            
            if column in data.columns:
                if operator == 'equals':
                    mask &= (data[column] == value)
                elif operator == 'not_equals':
                    mask &= (data[column] != value)
                elif operator == 'greater_than':
                    mask &= (data[column] > value)
                elif operator == 'less_than':
                    mask &= (data[column] < value)
                elif operator == 'contains':
                    mask &= data[column].astype(str).str.contains(str(value), na=False)
                elif operator == 'in':
                    mask &= data[column].isin(value)
        
        return data[mask]
    
    def _aggregate_data(self, data: pd.DataFrame, group_by: List[str], 
                       aggregations: Dict[str, List[str]]) -> pd.DataFrame:
        """
        Agrega dados por grupos
        """
        agg_dict = {}
        for agg_type, columns in aggregations.items():
            for column in columns:
                if column in data.columns:
                    if agg_type == 'sum':
                        agg_dict[f'{column}_sum'] = column
                    elif agg_type == 'mean':
                        agg_dict[f'{column}_mean'] = column
                    elif agg_type == 'count':
                        agg_dict[f'{column}_count'] = column
                    elif agg_type == 'min':
                        agg_dict[f'{column}_min'] = column
                    elif agg_type == 'max':
                        agg_dict[f'{column}_max'] = column
        
        if agg_dict:
            return data.groupby(group_by).agg(agg_dict).reset_index()
        
        return data
    
    def _split_columns(self, data: pd.DataFrame, column: str, delimiter: str = ' ', 
                      new_columns: Optional[List[str]] = None) -> pd.DataFrame:
        """
        Divide uma coluna em múltiplas colunas
        """
        if column in data.columns:
            split_data = data[column].astype(str).str.split(delimiter, expand=True)
            
            if new_columns:
                split_data.columns = new_columns[:len(split_data.columns)]
            else:
                split_data.columns = [f'{column}_part_{i}' for i in range(len(split_data.columns))]
            
            # Remove a coluna original e adiciona as novas
            data = data.drop(columns=[column])
            data = pd.concat([data, split_data], axis=1)
        
        return data
    
    def _merge_columns(self, data: pd.DataFrame, columns: List[str], 
                      new_column: str, separator: str = ' ') -> pd.DataFrame:
        """
        Combina múltiplas colunas em uma única coluna
        """
        if all(col in data.columns for col in columns):
            data[new_column] = data[columns].astype(str).agg(separator.join, axis=1)
            # Remove as colunas originais
            data = data.drop(columns=columns)
        
        return data
    
    def _date_operations(self, data: pd.DataFrame, date_column: str, 
                        operations: List[str]) -> pd.DataFrame:
        """
        Realiza operações com datas
        """
        if date_column in data.columns:
            try:
                data[date_column] = pd.to_datetime(data[date_column], errors='coerce')
                
                for operation in operations:
                    if operation == 'extract_year':
                        data[f'{date_column}_year'] = data[date_column].dt.year
                    elif operation == 'extract_month':
                        data[f'{date_column}_month'] = data[date_column].dt.month
                    elif operation == 'extract_day':
                        data[f'{date_column}_day'] = data[date_column].dt.day
                    elif operation == 'extract_weekday':
                        data[f'{date_column}_weekday'] = data[date_column].dt.day_name()
                    elif operation == 'extract_quarter':
                        data[f'{date_column}_quarter'] = data[date_column].dt.quarter
                    elif operation == 'days_since_epoch':
                        data[f'{date_column}_days_since_epoch'] = (data[date_column] - pd.Timestamp('1970-01-01')).dt.days
            except Exception:
                pass
        
        return data
    
    def _generate_preparation_report(self, original_shape: tuple, final_shape: tuple, 
                                   operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Gera um relatório detalhado das operações de preparação
        """
        successful_ops = [op for op in operations if op['status'] == 'success']
        failed_ops = [op for op in operations if op['status'] == 'error']
        
        return {
            'original_rows': original_shape[0],
            'original_columns': original_shape[1],
            'final_rows': final_shape[0],
            'final_columns': final_shape[1],
            'rows_removed': original_shape[0] - final_shape[0],
            'columns_added': final_shape[1] - original_shape[1],
            'operations_applied': len(successful_ops),
            'operations_failed': len(failed_ops),
            'success_rate': len(successful_ops) / len(operations) if operations else 0,
            'failed_operations': failed_ops
        }
    
    async def get_data_quality_report(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera um relatório de qualidade dos dados
        """
        quality_report = {
            'total_rows': len(data),
            'total_columns': len(data.columns),
            'missing_values': {},
            'duplicate_rows': len(data) - len(data.drop_duplicates()),
            'data_types': {},
            'unique_values': {},
            'outliers': {}
        }
        
        for column in data.columns:
            # Valores ausentes
            missing_count = data[column].isnull().sum()
            missing_percentage = (missing_count / len(data)) * 100
            quality_report['missing_values'][column] = {
                'count': missing_count,
                'percentage': missing_percentage
            }
            
            # Tipos de dados
            quality_report['data_types'][column] = str(data[column].dtype)
            
            # Valores únicos
            unique_count = data[column].nunique()
            quality_report['unique_values'][column] = {
                'count': unique_count,
                'percentage': (unique_count / len(data)) * 100
            }
            
            # Outliers (apenas para dados numéricos)
            if data[column].dtype in ['int64', 'float64']:
                Q1 = data[column].quantile(0.25)
                Q3 = data[column].quantile(0.75)
                IQR = Q3 - Q1
                outliers = data[(data[column] < Q1 - 1.5*IQR) | (data[column] > Q3 + 1.5*IQR)]
                quality_report['outliers'][column] = len(outliers)
        
        return quality_report
    
    async def suggest_preparation_steps(self, data: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Sugere passos de preparação baseados na qualidade dos dados
        """
        suggestions = []
        quality_report = await self.get_data_quality_report(data)
        
        # Sugestão para valores ausentes
        high_missing_cols = [
            col for col, info in quality_report['missing_values'].items() 
            if info['percentage'] > 20
        ]
        if high_missing_cols:
            suggestions.append({
                'type': 'clean_missing',
                'priority': 'high',
                'description': f'Colunas com muitos valores ausentes: {", ".join(high_missing_cols)}',
                'recommended_action': 'Considerar remoção ou preenchimento inteligente'
            })
        
        # Sugestão para linhas duplicadas
        if quality_report['duplicate_rows'] > 0:
            suggestions.append({
                'type': 'remove_duplicates',
                'priority': 'medium',
                'description': f'Encontradas {quality_report["duplicate_rows"]} linhas duplicadas',
                'recommended_action': 'Remover duplicatas para melhorar qualidade'
            })
        
        # Sugestão para conversão de tipos
        for column, dtype in quality_report['data_types'].items():
            if dtype == 'object':
                # Tenta converter para datetime
                try:
                    pd.to_datetime(data[column].iloc[0])
                    suggestions.append({
                        'type': 'convert_types',
                        'priority': 'low',
                        'description': f'Coluna "{column}" parece ser uma data',
                        'recommended_action': 'Converter para tipo datetime'
                    })
                except:
                    pass
        
        return suggestions 