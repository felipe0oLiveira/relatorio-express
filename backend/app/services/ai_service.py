from typing import Dict, List, Any
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

class AIAnalysisService:
    """
    Serviço de análise de IA para processamento de dados
    """
    
    def __init__(self):
        self.analysis_cache = {}
        
    async def analyze_data(self, data: pd.DataFrame, analysis_type: str = "general") -> Dict[str, Any]:
        """
        Realiza análise automática dos dados
        """
        try:
            if analysis_type == "general":
                return await self._general_analysis(data)
            elif analysis_type == "trend":
                return await self._trend_analysis(data)
            elif analysis_type == "correlation":
                return await self._correlation_analysis(data)
            elif analysis_type == "outlier":
                return await self._outlier_analysis(data)
            elif analysis_type == "seasonality":
                return await self._seasonality_analysis(data)
            elif analysis_type == "clustering":
                return await self._clustering_analysis(data)
            elif analysis_type == "distribution":
                return await self._distribution_analysis(data)
            elif analysis_type == "prediction":
                return await self._prediction_analysis(data)
            else:
                return await self._general_analysis(data)
                
        except Exception as e:
            return {
                "error": f"Erro na análise: {str(e)}",
                "analysis_type": analysis_type
            }
    
    async def _general_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise geral dos dados
        """
        numeric_cols = data.select_dtypes(include=['number']).columns
        categorical_cols = data.select_dtypes(include=['object']).columns
        
        insights = []
        
        # Análise de colunas numéricas
        for col in numeric_cols[:3]:
            mean_val = data[col].mean()
            median_val = data[col].median()
            std_val = data[col].std()
            skewness = data[col].skew()
            kurtosis = data[col].kurtosis()
            
            insights.append({
                "column": col,
                "type": "numeric",
                "mean": mean_val,
                "median": median_val,
                "std": std_val,
                "min": data[col].min(),
                "max": data[col].max(),
                "skewness": skewness,
                "kurtosis": kurtosis,
                "is_normal": abs(skewness) < 1 and abs(kurtosis) < 3
            })
        
        # Análise de colunas categóricas
        for col in categorical_cols[:2]:
            unique_count = data[col].nunique()
            most_common = data[col].mode().iloc[0] if not data[col].mode().empty else "N/A"
            entropy = self._calculate_entropy(data[col])
            
            insights.append({
                "column": col,
                "type": "categorical",
                "unique_count": unique_count,
                "most_common": most_common,
                "null_count": data[col].isnull().sum(),
                "entropy": entropy,
                "diversity": entropy / np.log(unique_count) if unique_count > 1 else 0
            })
        
        return {
            "insights": insights,
            "total_rows": len(data),
            "total_columns": len(data.columns),
            "numeric_columns": len(numeric_cols),
            "categorical_columns": len(categorical_cols),
            "data_quality_score": self._calculate_data_quality_score(data)
        }
    
    async def _trend_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de tendências avançada
        """
        numeric_cols = data.select_dtypes(include=['number']).columns
        
        trends = []
        for col in numeric_cols[:3]:
            if len(data) > 10:
                x = np.arange(len(data))
                y = data[col].values
                
                if not np.isnan(y).all():
                    # Regressão linear
                    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
                    
                    trend_direction = "crescente" if slope > 0 else "decrescente" if slope < 0 else "estável"
                    
                    # Teste de significância
                    is_significant = p_value < 0.05
                    
                    # Calcula R²
                    r_squared = r_value ** 2
                    
                    trends.append({
                        "column": col,
                        "trend": trend_direction,
                        "slope": slope,
                        "intercept": intercept,
                        "r_squared": r_squared,
                        "p_value": p_value,
                        "is_significant": is_significant,
                        "change_percent": (slope / y.mean()) * 100 if y.mean() != 0 else 0,
                        "confidence": "alta" if r_squared > 0.7 else "média" if r_squared > 0.5 else "baixa"
                    })
        
        return {
            "trends": trends,
            "analysis_type": "trend"
        }
    
    async def _correlation_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de correlações avançada
        """
        numeric_data = data.select_dtypes(include=['number'])
        
        if len(numeric_data.columns) < 2:
            return {
                "correlations": [],
                "message": "Dados insuficientes para análise de correlação"
            }
        
        corr_matrix = numeric_data.corr()
        
        correlations = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                col1 = corr_matrix.columns[i]
                col2 = corr_matrix.columns[j]
                corr_value = corr_matrix.iloc[i, j]
                
                if abs(corr_value) > 0.3:
                    strength = "forte" if abs(corr_value) > 0.7 else "moderada" if abs(corr_value) > 0.5 else "fraca"
                    
                    # Teste de significância
                    n = len(numeric_data)
                    t_stat = corr_value * np.sqrt((n-2)/(1-corr_value**2))
                    p_value = 2 * (1 - stats.t.cdf(abs(t_stat), n-2))
                    
                    correlations.append({
                        "column1": col1,
                        "column2": col2,
                        "correlation": corr_value,
                        "strength": strength,
                        "p_value": p_value,
                        "is_significant": p_value < 0.05,
                        "interpretation": self._interpret_correlation(corr_value)
                    })
        
        return {
            "correlations": correlations,
            "analysis_type": "correlation"
        }
    
    async def _outlier_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de outliers avançada
        """
        numeric_cols = data.select_dtypes(include=['number']).columns
        
        outliers = []
        for col in numeric_cols[:3]:
            Q1 = data[col].quantile(0.25)
            Q3 = data[col].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outlier_indices = data[(data[col] < lower_bound) | (data[col] > upper_bound)].index
            outlier_count = len(outlier_indices)
            
            if outlier_count > 0:
                # Análise Z-score também
                z_scores = np.abs(stats.zscore(data[col].dropna()))
                z_outliers = len(z_scores[z_scores > 3])
                
                outliers.append({
                    "column": col,
                    "outlier_count": outlier_count,
                    "outlier_percentage": (outlier_count / len(data)) * 100,
                    "lower_bound": lower_bound,
                    "upper_bound": upper_bound,
                    "z_score_outliers": z_outliers,
                    "severity": "alta" if outlier_count > len(data) * 0.1 else "média" if outlier_count > len(data) * 0.05 else "baixa",
                    "recommendation": self._get_outlier_recommendation(outlier_count, len(data))
                })
        
        return {
            "outliers": outliers,
            "analysis_type": "outlier"
        }
    
    async def _seasonality_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de sazonalidade
        """
        # Procura por colunas de data
        date_cols = []
        for col in data.columns:
            if data[col].dtype == 'object':
                try:
                    pd.to_datetime(data[col].iloc[0])
                    date_cols.append(col)
                except:
                    continue
        
        if not date_cols:
            return {
                "seasonality": [],
                "message": "Nenhuma coluna de data encontrada"
            }
        
        date_col = date_cols[0]
        data_copy = data.copy()
        data_copy[date_col] = pd.to_datetime(data_copy[date_col])
        
        # Extrai componentes temporais
        data_copy['year'] = data_copy[date_col].dt.year
        data_copy['month'] = data_copy[date_col].dt.month
        data_copy['day_of_week'] = data_copy[date_col].dt.dayofweek
        
        numeric_cols = data_copy.select_dtypes(include=['number']).columns
        numeric_cols = [col for col in numeric_cols if col not in ['year', 'month', 'day_of_week']]
        
        seasonality_results = []
        
        for col in numeric_cols[:2]:
            # Análise por mês
            monthly_avg = data_copy.groupby('month')[col].mean()
            monthly_std = data_copy.groupby('month')[col].std()
            
            # Análise por dia da semana
            daily_avg = data_copy.groupby('day_of_week')[col].mean()
            
            seasonality_results.append({
                "column": col,
                "monthly_pattern": monthly_avg.to_dict(),
                "daily_pattern": daily_avg.to_dict(),
                "has_seasonality": len(monthly_avg.unique()) > 1,
                "peak_month": monthly_avg.idxmax(),
                "lowest_month": monthly_avg.idxmin()
            })
        
        return {
            "seasonality": seasonality_results,
            "analysis_type": "seasonality"
        }
    
    async def _clustering_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de clustering
        """
        numeric_data = data.select_dtypes(include=['number'])
        
        if len(numeric_data.columns) < 2:
            return {
                "clusters": [],
                "message": "Precisa de pelo menos 2 colunas numéricas para clustering"
            }
        
        # Remove valores nulos
        numeric_data_clean = numeric_data.dropna()
        
        if len(numeric_data_clean) < 10:
            return {
                "clusters": [],
                "message": "Dados insuficientes para clustering"
            }
        
        # Normaliza os dados
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(numeric_data_clean)
        
        # Determina número ótimo de clusters
        inertias = []
        K_range = range(2, min(6, len(numeric_data_clean) // 2))
        
        for k in K_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            kmeans.fit(scaled_data)
            inertias.append(kmeans.inertia_)
        
        # Escolhe k baseado no método do cotovelo
        optimal_k = self._find_optimal_k(inertias, K_range)
        
        # Aplica clustering
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(scaled_data)
        
        # Adiciona labels aos dados
        numeric_data_clean['cluster'] = cluster_labels
        
        # Analisa cada cluster
        cluster_analysis = []
        for i in range(optimal_k):
            cluster_data = numeric_data_clean[numeric_data_clean['cluster'] == i]
            
            cluster_analysis.append({
                "cluster_id": i,
                "size": len(cluster_data),
                "percentage": (len(cluster_data) / len(numeric_data_clean)) * 100,
                "centroid": cluster_data.mean().to_dict(),
                "characteristics": self._describe_cluster_characteristics(cluster_data, numeric_data.columns)
            })
        
        return {
            "clusters": cluster_analysis,
            "optimal_clusters": optimal_k,
            "analysis_type": "clustering"
        }
    
    async def _distribution_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise de distribuição
        """
        numeric_cols = data.select_dtypes(include=['number']).columns
        
        distributions = []
        for col in numeric_cols[:3]:
            col_data = data[col].dropna()
            
            if len(col_data) > 10:
                # Teste de normalidade
                shapiro_stat, shapiro_p = stats.shapiro(col_data)
                is_normal = shapiro_p > 0.05
                
                # Análise de assimetria e curtose
                skewness = col_data.skew()
                kurtosis = col_data.kurtosis()
                
                # Identifica tipo de distribuição
                distribution_type = self._identify_distribution_type(skewness, kurtosis)
                
                distributions.append({
                    "column": col,
                    "is_normal": is_normal,
                    "shapiro_p_value": shapiro_p,
                    "skewness": skewness,
                    "kurtosis": kurtosis,
                    "distribution_type": distribution_type,
                    "percentiles": {
                        "10th": col_data.quantile(0.1),
                        "25th": col_data.quantile(0.25),
                        "50th": col_data.quantile(0.5),
                        "75th": col_data.quantile(0.75),
                        "90th": col_data.quantile(0.9)
                    }
                })
        
        return {
            "distributions": distributions,
            "analysis_type": "distribution"
        }
    
    async def _prediction_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Análise preditiva básica
        """
        numeric_cols = data.select_dtypes(include=['number']).columns
        
        if len(numeric_cols) < 2:
            return {
                "predictions": [],
                "message": "Precisa de pelo menos 2 colunas numéricas para análise preditiva"
            }
        
        # Análise de regressão simples
        target_col = numeric_cols[0]
        feature_cols = numeric_cols[1:3]  # Usa até 2 features
        
        predictions = []
        
        for feature in feature_cols:
            # Remove valores nulos
            clean_data = data[[target_col, feature]].dropna()
            
            if len(clean_data) > 10:
                X = clean_data[feature].values.reshape(-1, 1)
                y = clean_data[target_col].values
                
                # Regressão linear
                slope, intercept, r_value, p_value, std_err = stats.linregress(X.flatten(), y)
                
                # Calcula R²
                r_squared = r_value ** 2
                
                # Faz previsão simples
                if not np.isnan(slope) and not np.isnan(intercept):
                    # Previsão para o próximo valor
                    last_feature_value = clean_data[feature].iloc[-1]
                    prediction = slope * last_feature_value + intercept
                    
                    predictions.append({
                        "target": target_col,
                        "feature": feature,
                        "slope": slope,
                        "intercept": intercept,
                        "r_squared": r_squared,
                        "p_value": p_value,
                        "is_significant": p_value < 0.05,
                        "prediction": prediction,
                        "confidence": "alta" if r_squared > 0.7 else "média" if r_squared > 0.5 else "baixa"
                    })
        
        return {
            "predictions": predictions,
            "analysis_type": "prediction"
        }
    
    def _calculate_entropy(self, series: pd.Series) -> float:
        """Calcula entropia de uma série categórica"""
        value_counts = series.value_counts()
        probabilities = value_counts / len(series)
        entropy = -np.sum(probabilities * np.log2(probabilities))
        return entropy
    
    def _calculate_data_quality_score(self, data: pd.DataFrame) -> float:
        """Calcula score de qualidade dos dados"""
        total_cells = len(data) * len(data.columns)
        null_cells = data.isnull().sum().sum()
        quality_score = (total_cells - null_cells) / total_cells
        return quality_score
    
    def _interpret_correlation(self, corr_value: float) -> str:
        """Interpreta o valor de correlação"""
        if abs(corr_value) > 0.8:
            return "correlação muito forte"
        elif abs(corr_value) > 0.6:
            return "correlação forte"
        elif abs(corr_value) > 0.4:
            return "correlação moderada"
        elif abs(corr_value) > 0.2:
            return "correlação fraca"
        else:
            return "correlação muito fraca"
    
    def _get_outlier_recommendation(self, outlier_count: int, total_count: int) -> str:
        """Gera recomendação para outliers"""
        percentage = (outlier_count / total_count) * 100
        
        if percentage > 10:
            return "Considere investigar e possivelmente remover outliers"
        elif percentage > 5:
            return "Monitore os outliers, mas podem ser válidos"
        else:
            return "Outliers são poucos e provavelmente válidos"
    
    def _find_optimal_k(self, inertias: List[float], k_range: range) -> int:
        """Encontra k ótimo usando método do cotovelo"""
        if len(inertias) < 2:
            return 2
        
        # Calcula a segunda derivada
        second_derivative = np.diff(np.diff(inertias))
        optimal_k_idx = np.argmax(second_derivative) + 1
        
        return k_range[optimal_k_idx]
    
    def _describe_cluster_characteristics(self, cluster_data: pd.DataFrame, columns: List[str]) -> Dict[str, Any]:
        """Descreve características de um cluster"""
        characteristics = {}
        
        for col in columns:
            if col in cluster_data.columns:
                mean_val = cluster_data[col].mean()
                std_val = cluster_data[col].std()
                
                characteristics[col] = {
                    "mean": mean_val,
                    "std": std_val,
                    "description": f"Média de {mean_val:.2f} ± {std_val:.2f}"
                }
        
        return characteristics
    
    def _identify_distribution_type(self, skewness: float, kurtosis: float) -> str:
        """Identifica tipo de distribuição baseado em assimetria e curtose"""
        if abs(skewness) < 0.5 and abs(kurtosis) < 0.5:
            return "normal"
        elif skewness > 1:
            return "assimétrica positiva"
        elif skewness < -1:
            return "assimétrica negativa"
        elif kurtosis > 3:
            return "leptocúrtica (picos agudos)"
        elif kurtosis < 3:
            return "platicúrtica (picos achatados)"
        else:
            return "mista"
    
    async def generate_insights(self, data: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Gera insights automáticos sobre os dados
        """
        insights = []
        
        # Insight sobre o tamanho dos dados
        insights.append({
            "type": "data_overview",
            "title": "Visão Geral dos Dados",
            "description": f"Seus dados contêm {len(data)} linhas e {len(data.columns)} colunas",
            "priority": "high"
        })
        
        # Insight sobre valores nulos
        null_counts = data.isnull().sum()
        if null_counts.sum() > 0:
            insights.append({
                "type": "missing_data",
                "title": "Dados Faltantes",
                "description": f"Encontrados {null_counts.sum()} valores nulos nos dados",
                "priority": "medium"
            })
        
        # Insight sobre tipos de dados
        numeric_count = len(data.select_dtypes(include=['number']).columns)
        categorical_count = len(data.select_dtypes(include=['object']).columns)
        
        insights.append({
            "type": "data_types",
            "title": "Tipos de Dados",
            "description": f"{numeric_count} colunas numéricas e {categorical_count} colunas categóricas",
            "priority": "low"
        })
        
        # Insight sobre qualidade dos dados
        quality_score = self._calculate_data_quality_score(data)
        insights.append({
            "type": "data_quality",
            "title": "Qualidade dos Dados",
            "description": f"Score de qualidade: {quality_score:.1%}",
            "priority": "medium"
        })
        
        return insights 