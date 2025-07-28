"""
Configuração do Assistente de IA Conversacional

Este módulo configura o assistente de IA para funcionar sem dependências externas.
O assistente usa análise estatística tradicional para responder perguntas sobre dados.

Funcionalidades:
- Análise descritiva (média, mediana, desvio padrão)
- Análise de tendências temporais
- Análise de correlações
- Detecção de outliers
- Insights automatizados
- Sugestões de perguntas

Vantagens:
✅ Sem custos de API
✅ Resposta instantânea
✅ Privacidade total (dados não saem do servidor)
✅ Confiabilidade (sem dependências externas)
✅ Funciona offline

Exemplo de uso:
```python
from app.services.ai_assistant import AIAssistant

ai = AIAssistant()

# Pergunta simples
result = await ai.ask_question("Qual é a média de vendas?", data, user_id)

# Insights automatizados
insights = await ai.get_automated_insights(data, user_id)
```

Tipos de perguntas suportadas:
- "Qual é a média de [coluna]?"
- "Mostre a tendência de [coluna]"
- "Existe correlação entre [coluna1] e [coluna2]?"
- "Quantos valores únicos tem na coluna [coluna]?"
- "Qual é a distribuição dos dados?"
"""

from app.services.ai_assistant import AIAssistant

# Configuração padrão do assistente
DEFAULT_AI_ASSISTANT = AIAssistant()

# Configurações de análise
ANALYSIS_CONFIG = {
    "max_numeric_columns": 3,  # Máximo de colunas numéricas para analisar
    "max_categorical_columns": 2,  # Máximo de colunas categóricas para analisar
    "correlation_threshold": 0.5,  # Limiar para considerar correlação significativa
    "outlier_iqr_multiplier": 1.5,  # Multiplicador IQR para detectar outliers
    "max_suggestions": 3,  # Máximo de sugestões por resposta
}

# Palavras-chave para classificação de perguntas
QUESTION_KEYWORDS = {
    "descriptive": ["média", "mediana", "total", "quantos", "qual", "distribuição"],
    "trend": ["tendência", "crescimento", "evolução", "mudança", "tempo"],
    "correlation": ["correlação", "relação", "associação", "conexão"],
    "prediction": ["previsão", "futuro", "próximo", "predição", "forecast"]
}

# Tipos de visualização sugeridos
VISUALIZATION_TYPES = {
    "descriptive": "bar_chart",
    "trend": "line_chart", 
    "correlation": "scatter_plot",
    "distribution": "histogram",
    "proportion": "pie_chart"
} 