from typing import Dict, List, Any
import pandas as pd
import json
from app.services.ai_service import AIAnalysisService

class AIAssistant:
    """
    Assistente de IA conversacional similar ao Zia do Zoho Analytics
    Permite perguntas em linguagem natural e gera insights automáticos
    """
    
    def __init__(self):
        self.ai_service = AIAnalysisService()
        
    async def ask_question(self, question: str, data: pd.DataFrame, user_id: str) -> Dict[str, Any]:
        """
        Processa perguntas em linguagem natural sobre os dados
        """
        try:
            # Analisa a pergunta para entender o tipo de análise necessária
            analysis_type = self._classify_question(question)
            
            # Gera resposta baseada no tipo de análise
            if analysis_type == "descriptive":
                response = await self._generate_descriptive_insight(question, data)
            elif analysis_type == "trend":
                response = await self._generate_trend_insight(question, data)
            elif analysis_type == "correlation":
                response = await self._generate_correlation_insight(question, data)
            elif analysis_type == "seasonality":
                response = await self._generate_seasonality_insight(question, data)
            elif analysis_type == "clustering":
                response = await self._generate_clustering_insight(question, data)
            elif analysis_type == "distribution":
                response = await self._generate_distribution_insight(question, data)
            elif analysis_type == "prediction":
                response = await self._generate_prediction_insight(question, data)
            elif analysis_type == "outlier":
                response = await self._generate_outlier_insight(question, data)
            else:
                response = await self._generate_general_insight(question, data)
            
            return {
                "question": question,
                "answer": response["answer"],
                "visualization": response.get("visualization"),
                "confidence": response.get("confidence", 0.8),
                "suggestions": response.get("suggestions", []),
                "analysis_type": analysis_type
            }
            
        except Exception as e:
            return {
                "error": f"Erro ao processar pergunta: {str(e)}",
                "question": question
            }
    
    def _classify_question(self, question: str) -> str:
        """
        Classifica o tipo de pergunta para determinar a análise necessária
        """
        question_lower = question.lower()
        
        # Análise de sazonalidade
        if any(word in question_lower for word in ["sazonalidade", "sazonal", "estacional", "padrão mensal", "padrão semanal"]):
            return "seasonality"
        
        # Análise de tendências
        elif any(word in question_lower for word in ["tendência", "crescimento", "evolução", "mudança", "cresce", "diminui"]):
            return "trend"
        
        # Análise de correlações
        elif any(word in question_lower for word in ["correlação", "relação", "associação", "conectado", "ligado"]):
            return "correlation"
        
        # Análise de outliers
        elif any(word in question_lower for word in ["outlier", "atípico", "anômalo", "estranho", "diferente"]):
            return "outlier"
        
        # Análise de distribuição
        elif any(word in question_lower for word in ["distribuição", "normal", "assimétrico", "curtose", "assimetria"]):
            return "distribution"
        
        # Análise de clustering
        elif any(word in question_lower for word in ["grupo", "cluster", "segmento", "categoria", "tipo"]):
            return "clustering"
        
        # Análise preditiva
        elif any(word in question_lower for word in ["previsão", "futuro", "próximo", "predição", "prognóstico"]):
            return "prediction"
        
        # Análise descritiva (padrão)
        else:
            return "descriptive"
    
    async def _generate_descriptive_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights descritivos avançados sobre os dados
        """
        analysis = await self.ai_service._general_analysis(data)
        
        insights = []
        
        for insight in analysis["insights"]:
            if insight["type"] == "numeric":
                col = insight["column"]
                insights.append(f"A coluna '{col}' tem média de {insight['mean']:.2f}, mediana de {insight['median']:.2f} e desvio padrão de {insight['std']:.2f}")
                
                if insight["is_normal"]:
                    insights.append(f"A distribuição de '{col}' é aproximadamente normal")
                else:
                    insights.append(f"A distribuição de '{col}' não é normal (assimetria: {insight['skewness']:.2f})")
            
            elif insight["type"] == "categorical":
                col = insight["column"]
                insights.append(f"A coluna '{col}' tem {insight['unique_count']} valores únicos, sendo '{insight['most_common']}' o mais frequente")
                
                if insight["diversity"] > 0.7:
                    insights.append(f"A coluna '{col}' tem alta diversidade")
                elif insight["diversity"] < 0.3:
                    insights.append(f"A coluna '{col}' tem baixa diversidade")
        
        quality_score = analysis.get("data_quality_score", 0)
        if quality_score < 0.9:
            insights.append(f"⚠️ Score de qualidade dos dados: {quality_score:.1%} - Considere limpar os dados")
        
        return {
            "answer": f"Baseado na análise dos seus dados: {' '.join(insights)}",
            "visualization": "descriptive_chart",
            "suggestions": [
                "Quer ver a distribuição de alguma coluna específica?",
                "Posso criar um gráfico de barras para mostrar as frequências",
                "Gostaria de analisar as correlações entre as variáveis?",
                "Posso fazer análise de outliers nos dados"
            ]
        }
    
    async def _generate_trend_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights avançados sobre tendências nos dados
        """
        analysis = await self.ai_service._trend_analysis(data)
        
        if not analysis.get("trends"):
            return {
                "answer": "Não foi possível identificar tendências claras nos dados. Verifique se há dados temporais suficientes.",
                "suggestions": [
                    "Certifique-se de que há uma coluna com datas",
                    "Posso fazer análise descritiva dos dados",
                    "Quer ver as estatísticas básicas?"
                ]
            }
        
        insights = []
        for trend in analysis["trends"]:
            col = trend["column"]
            direction = trend["trend"]
            confidence = trend["confidence"]
            significance = "significativa" if trend["is_significant"] else "não significativa"
            
            insights.append(f"A coluna '{col}' mostra tendência {direction} ({confidence} confiança, {significance})")
            
            if trend["r_squared"] > 0.7:
                insights.append(f"A tendência é bem explicada pelo modelo (R² = {trend['r_squared']:.2f})")
        
        return {
            "answer": f"Análise de tendências: {' '.join(insights)}",
            "visualization": "trend_chart",
            "suggestions": [
                "Quer ver um gráfico de linha da tendência?",
                "Posso identificar padrões sazonais nos dados",
                "Gostaria de fazer uma previsão para o futuro?",
                "Posso analisar a sazonalidade dos dados"
            ]
        }
    
    async def _generate_correlation_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights avançados sobre correlações entre variáveis
        """
        analysis = await self.ai_service._correlation_analysis(data)
        
        if not analysis.get("correlations"):
            return {
                "answer": "Não encontrei correlações significativas entre as variáveis numéricas. Isso pode indicar que as variáveis são independentes.",
                "suggestions": [
                    "Quer ver a análise individual de cada variável?",
                    "Posso procurar por outros tipos de padrões",
                    "Gostaria de fazer análise de clusters?"
                ]
            }
        
        insights = []
        for corr in analysis["correlations"]:
            col1 = corr["column1"]
            col2 = corr["column2"]
            strength = corr["strength"]
            significance = "significativa" if corr["is_significant"] else "não significativa"
            interpretation = corr["interpretation"]
            
            insights.append(f"'{col1}' e '{col2}' têm {interpretation} ({strength}, {significance})")
        
        return {
            "answer": f"Análise de correlações: {'; '.join(insights)}",
            "visualization": "correlation_heatmap",
            "suggestions": [
                "Quer ver um mapa de calor das correlações?",
                "Posso criar gráficos de dispersão para as correlações mais fortes",
                "Gostaria de analisar outras relações nos dados?",
                "Posso fazer análise de clustering baseada nas correlações"
            ]
        }
    
    async def _generate_seasonality_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights sobre sazonalidade nos dados
        """
        analysis = await self.ai_service._seasonality_analysis(data)
        
        if not analysis.get("seasonality"):
            return {
                "answer": "Não foi possível identificar padrões sazonais. Verifique se há uma coluna de data nos dados.",
                "suggestions": [
                    "Certifique-se de que há uma coluna com datas",
                    "Posso fazer análise de tendências",
                    "Quer ver a análise descritiva?"
                ]
            }
        
        insights = []
        for seasonality in analysis["seasonality"]:
            col = seasonality["column"]
            has_seasonality = seasonality["has_seasonality"]
            
            if has_seasonality:
                peak_month = seasonality["peak_month"]
                lowest_month = seasonality["lowest_month"]
                insights.append(f"A coluna '{col}' mostra padrão sazonal com pico no mês {peak_month} e menor valor no mês {lowest_month}")
            else:
                insights.append(f"A coluna '{col}' não mostra padrão sazonal claro")
        
        return {
            "answer": f"Análise de sazonalidade: {'; '.join(insights)}",
            "visualization": "seasonality_chart",
            "suggestions": [
                "Quer ver gráficos de sazonalidade?",
                "Posso identificar tendências de longo prazo",
                "Gostaria de fazer previsões sazonais?",
                "Posso analisar padrões semanais"
            ]
        }
    
    async def _generate_clustering_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights sobre clustering dos dados
        """
        analysis = await self.ai_service._clustering_analysis(data)
        
        if not analysis.get("clusters"):
            return {
                "answer": "Não foi possível fazer clustering. Verifique se há dados numéricos suficientes.",
                "suggestions": [
                    "Certifique-se de que há colunas numéricas",
                    "Posso fazer análise descritiva",
                    "Quer ver a distribuição dos dados?"
                ]
            }
        
        optimal_clusters = analysis["optimal_clusters"]
        insights = [f"Identifiquei {optimal_clusters} grupos naturais nos dados:"]
        
        for cluster in analysis["clusters"]:
            cluster_id = cluster["cluster_id"]
            size = cluster["size"]
            percentage = cluster["percentage"]
            insights.append(f"Grupo {cluster_id}: {size} registros ({percentage:.1f}%)")
        
        return {
            "answer": f"Análise de clustering: {' '.join(insights)}",
            "visualization": "clustering_chart",
            "suggestions": [
                "Quer ver gráficos dos clusters?",
                "Posso analisar as características de cada grupo",
                "Gostaria de fazer análise de segmentação?",
                "Posso identificar padrões nos clusters"
            ]
        }
    
    async def _generate_distribution_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights sobre distribuição dos dados
        """
        analysis = await self.ai_service._distribution_analysis(data)
        
        if not analysis.get("distributions"):
            return {
                "answer": "Não foi possível analisar distribuições. Verifique se há dados numéricos suficientes.",
                "suggestions": [
                    "Certifique-se de que há colunas numéricas",
                    "Posso fazer análise descritiva",
                    "Quer ver estatísticas básicas?"
                ]
            }
        
        insights = []
        for dist in analysis["distributions"]:
            col = dist["column"]
            is_normal = dist["is_normal"]
            dist_type = dist["distribution_type"]
            
            if is_normal:
                insights.append(f"A coluna '{col}' tem distribuição normal")
            else:
                insights.append(f"A coluna '{col}' tem distribuição {dist_type}")
        
        return {
            "answer": f"Análise de distribuição: {'; '.join(insights)}",
            "visualization": "distribution_chart",
            "suggestions": [
                "Quer ver histogramas das distribuições?",
                "Posso fazer testes de normalidade",
                "Gostaria de analisar outliers?",
                "Posso identificar transformações necessárias"
            ]
        }
    
    async def _generate_prediction_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights preditivos sobre os dados
        """
        analysis = await self.ai_service._prediction_analysis(data)
        
        if not analysis.get("predictions"):
            return {
                "answer": "Para fazer previsões, preciso de dados históricos com padrões temporais claros. Posso ajudar você a preparar os dados para análise preditiva.",
                "suggestions": [
                    "Certifique-se de ter uma coluna de data/tempo",
                    "Quer que eu identifique padrões sazonais?",
                    "Posso sugerir modelos de previsão adequados"
                ]
            }
        
        insights = []
        for pred in analysis["predictions"]:
            target = pred["target"]
            feature = pred["feature"]
            confidence = pred["confidence"]
            is_significant = pred["is_significant"]
            
            if is_significant:
                insights.append(f"Posso prever '{target}' baseado em '{feature}' com {confidence} confiança")
            else:
                insights.append(f"A relação entre '{target}' e '{feature}' não é estatisticamente significativa")
        
        return {
            "answer": f"Análise preditiva: {'; '.join(insights)}",
            "visualization": "prediction_chart",
            "suggestions": [
                "Quer ver gráficos de regressão?",
                "Posso fazer previsões para novos dados",
                "Gostaria de avaliar a qualidade do modelo?",
                "Posso sugerir outras variáveis preditivas"
            ]
        }
    
    async def _generate_outlier_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights sobre outliers nos dados
        """
        analysis = await self.ai_service._outlier_analysis(data)
        
        if not analysis.get("outliers"):
            return {
                "answer": "Não encontrei outliers significativos nos dados. Isso pode indicar dados bem distribuídos.",
                "suggestions": [
                    "Quer ver a distribuição dos dados?",
                    "Posso fazer análise descritiva",
                    "Gostaria de analisar tendências?"
                ]
            }
        
        insights = []
        for outlier in analysis["outliers"]:
            col = outlier["column"]
            count = outlier["outlier_count"]
            percentage = outlier["outlier_percentage"]
            severity = outlier["severity"]
            recommendation = outlier["recommendation"]
            
            insights.append(f"Encontrei {count} outliers em '{col}' ({percentage:.1f}% dos dados, severidade {severity})")
            insights.append(f"Recomendação: {recommendation}")
        
        return {
            "answer": f"Análise de outliers: {'; '.join(insights)}",
            "visualization": "outlier_chart",
            "suggestions": [
                "Quer ver gráficos de boxplot?",
                "Posso identificar os valores específicos dos outliers",
                "Gostaria de remover os outliers?",
                "Posso fazer análise sem os outliers"
            ]
        }
    
    async def _generate_general_insight(self, question: str, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera insights gerais sobre os dados
        """
        total_rows = len(data)
        total_cols = len(data.columns)
        missing_data = data.isnull().sum().sum()
        
        return {
            "answer": f"Seus dados contêm {total_rows} linhas e {total_cols} colunas. Há {missing_data} valores ausentes no total.",
            "visualization": "data_overview",
            "suggestions": [
                "Quer que eu limpe os dados ausentes?",
                "Posso fazer uma análise exploratória completa",
                "Gostaria de ver as primeiras linhas dos dados?",
                "Posso identificar padrões nos dados"
            ]
        }
    
    async def get_automated_insights(self, data: pd.DataFrame, user_id: str) -> List[Dict[str, Any]]:
        """
        Gera insights automatizados sobre os dados (similar ao "Insights da Zia")
        """
        insights = []
        
        # Insight 1: Visão geral dos dados
        total_rows = len(data)
        total_cols = len(data.columns)
        insights.append({
            "type": "overview",
            "title": "Visão Geral dos Dados",
            "description": f"Seu dataset contém {total_rows} registros e {total_cols} variáveis",
            "icon": "📊"
        })
        
        # Insight 2: Análise de valores ausentes
        missing_data = data.isnull().sum()
        if missing_data.sum() > 0:
            cols_with_missing = missing_data[missing_data > 0]
            insights.append({
                "type": "missing_data",
                "title": "Dados Ausentes Detectados",
                "description": f"Encontrei dados ausentes em {len(cols_with_missing)} colunas",
                "icon": "⚠️"
            })
        
        # Insight 3: Análise de tipos de dados
        numeric_cols = data.select_dtypes(include=['number']).columns
        categorical_cols = data.select_dtypes(include=['object']).columns
        
        insights.append({
            "type": "data_types",
            "title": "Tipos de Dados",
            "description": f"{len(numeric_cols)} colunas numéricas e {len(categorical_cols)} categóricas",
            "icon": "🔢"
        })
        
        # Insight 4: Detecção de outliers (se houver dados numéricos)
        if len(numeric_cols) > 0:
            for col in numeric_cols[:2]:  # Analisa as primeiras 2 colunas numéricas
                Q1 = data[col].quantile(0.25)
                Q3 = data[col].quantile(0.75)
                IQR = Q3 - Q1
                outliers = data[(data[col] < Q1 - 1.5*IQR) | (data[col] > Q3 + 1.5*IQR)]
                
                if len(outliers) > 0:
                    insights.append({
                        "type": "outliers",
                        "title": f"Outliers Detectados em '{col}'",
                        "description": f"Encontrei {len(outliers)} valores atípicos",
                        "icon": "🔍"
                    })
        
        # Insight 5: Análise de qualidade dos dados
        quality_score = self.ai_service._calculate_data_quality_score(data)
        insights.append({
            "type": "data_quality",
            "title": "Qualidade dos Dados",
            "description": f"Score de qualidade: {quality_score:.1%}",
            "icon": "✅"
        })
        
        # Insight 6: Análise de distribuição (se houver dados numéricos)
        if len(numeric_cols) > 0:
            for col in numeric_cols[:1]:
                skewness = data[col].skew()
                if abs(skewness) > 1:
                    insights.append({
                        "type": "distribution",
                        "title": f"Distribuição Assimétrica em '{col}'",
                        "description": f"Assimetria de {skewness:.2f} detectada",
                        "icon": "📈"
                    })
        
        return insights 