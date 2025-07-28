# 🤖 Funcionalidades Avançadas da IA

## 📊 **Análises Disponíveis**

### **1. 📈 Análise de Tendências Avançada**
```python
# Perguntas que ativam:
"Qual é a tendência de vendas?"
"Como crescem os dados ao longo do tempo?"
"Existe evolução nos dados?"

# Funcionalidades:
✅ Regressão linear com teste de significância
✅ Cálculo de R² para qualidade do modelo
✅ Identificação de confiança (alta/média/baixa)
✅ Análise de p-value para significância estatística
✅ Detecção automática de direção (crescente/decrescente/estável)
```

### **2. 🔗 Análise de Correlações Avançada**
```python
# Perguntas que ativam:
"Existe correlação entre idade e valor?"
"Como se relacionam as variáveis?"
"Quais colunas estão conectadas?"

# Funcionalidades:
✅ Matriz de correlação completa
✅ Teste de significância estatística (p-value)
✅ Classificação de força (forte/moderada/fraca)
✅ Interpretação automática das correlações
✅ Identificação de relações positivas/negativas
✅ Filtro de correlações significativas (> 0.3)
```

### **3. 🔍 Análise de Outliers Avançada**
```python
# Perguntas que ativam:
"Quais são os outliers nos dados?"
"Existem valores atípicos?"
"Quais dados são anômalos?"

# Funcionalidades:
✅ Detecção por método IQR (Interquartile Range)
✅ Análise Z-score adicional
✅ Classificação de severidade (alta/média/baixa)
✅ Recomendações automáticas de tratamento
✅ Cálculo de porcentagem de outliers
✅ Identificação de limites superior/inferior
```

### **4. 📅 Análise de Sazonalidade**
```python
# Perguntas que ativam:
"Existe sazonalidade nos dados?"
"Quais são os padrões mensais?"
"Há padrões semanais?"

# Funcionalidades:
✅ Detecção automática de colunas de data
✅ Análise de padrões mensais
✅ Análise de padrões semanais
✅ Identificação de picos e vales
✅ Detecção de sazonalidade significativa
✅ Extração de componentes temporais
```

### **5. 🎯 Análise de Clustering**
```python
# Perguntas que ativam:
"Posso identificar grupos nos dados?"
"Quais são os segmentos naturais?"
"Como agrupar os dados?"

# Funcionalidades:
✅ Algoritmo K-means otimizado
✅ Determinação automática do número ótimo de clusters
✅ Método do cotovelo para seleção de k
✅ Normalização automática dos dados
✅ Análise de características de cada cluster
✅ Cálculo de tamanho e porcentagem de cada grupo
```

### **6. 📊 Análise de Distribuição**
```python
# Perguntas que ativam:
"Como é a distribuição dos dados?"
"Os dados são normais?"
"Qual a assimetria dos dados?"

# Funcionalidades:
✅ Teste de normalidade (Shapiro-Wilk)
✅ Análise de assimetria (skewness)
✅ Análise de curtose
✅ Identificação de tipo de distribuição
✅ Cálculo de percentis (10th, 25th, 50th, 75th, 90th)
✅ Classificação automática (normal/assimétrica/leptocúrtica/etc.)
```

### **7. 🔮 Análise Preditiva**
```python
# Perguntas que ativam:
"Posso prever valores futuros?"
"Como será o próximo valor?"
"Qual a tendência futura?"

# Funcionalidades:
✅ Regressão linear para previsões
✅ Cálculo de R² para qualidade do modelo
✅ Teste de significância estatística
✅ Classificação de confiança (alta/média/baixa)
✅ Previsões baseadas em relações entre variáveis
✅ Avaliação de qualidade preditiva
```

## 🚀 **Novas Rotas da API**

### **1. Análise Avançada Geral**
```http
POST /ai-assistant/advanced-analysis
{
  "data_id": "uuid",
  "analysis_type": "trend|correlation|outlier|seasonality|clustering|distribution|prediction"
}
```

### **2. Análise Específica de Sazonalidade**
```http
POST /ai-assistant/seasonality-analysis
{
  "data_id": "uuid"
}
```

### **3. Análise Específica de Clustering**
```http
POST /ai-assistant/clustering-analysis
{
  "data_id": "uuid"
}
```

### **4. Análise Específica de Distribuição**
```http
POST /ai-assistant/distribution-analysis
{
  "data_id": "uuid"
}
```

### **5. Análise Preditiva Específica**
```http
POST /ai-assistant/prediction-analysis
{
  "data_id": "uuid"
}
```

## 📋 **Exemplos de Respostas**

### **Análise de Tendências:**
```json
{
  "trends": [
    {
      "column": "vendas",
      "trend": "crescente",
      "slope": 15.2,
      "r_squared": 0.85,
      "p_value": 0.001,
      "is_significant": true,
      "confidence": "alta"
    }
  ]
}
```

### **Análise de Correlações:**
```json
{
  "correlations": [
    {
      "column1": "idade",
      "column2": "valor_compra",
      "correlation": 0.72,
      "strength": "forte",
      "p_value": 0.002,
      "is_significant": true,
      "interpretation": "correlação forte"
    }
  ]
}
```

### **Análise de Clustering:**
```json
{
  "clusters": [
    {
      "cluster_id": 0,
      "size": 150,
      "percentage": 30.0,
      "centroid": {"idade": 25.5, "valor": 1200.0},
      "characteristics": {
        "idade": {"mean": 25.5, "std": 5.2},
        "valor": {"mean": 1200.0, "std": 300.0}
      }
    }
  ],
  "optimal_clusters": 3
}
```

## 🎯 **Melhorias na Classificação de Perguntas**

### **Palavras-chave Expandidas:**
- **Sazonalidade:** "sazonalidade", "sazonal", "estacional", "padrão mensal", "padrão semanal"
- **Tendências:** "tendência", "crescimento", "evolução", "mudança", "cresce", "diminui"
- **Correlações:** "correlação", "relação", "associação", "conectado", "ligado"
- **Outliers:** "outlier", "atípico", "anômalo", "estranho", "diferente"
- **Distribuição:** "distribuição", "normal", "assimétrico", "curtose", "assimetria"
- **Clustering:** "grupo", "cluster", "segmento", "categoria", "tipo"
- **Previsão:** "previsão", "futuro", "próximo", "predição", "prognóstico"

## 📈 **Métricas de Qualidade**

### **Score de Qualidade dos Dados:**
- Calcula porcentagem de células não-nulas
- Alerta quando score < 90%
- Sugere limpeza de dados quando necessário

### **Testes de Significância:**
- p-value < 0.05 para tendências
- p-value < 0.05 para correlações
- R² > 0.7 para alta confiança

### **Classificação de Confiança:**
- **Alta:** R² > 0.7 ou correlação > 0.7
- **Média:** R² > 0.5 ou correlação > 0.5
- **Baixa:** R² < 0.5 ou correlação < 0.5

## 🔧 **Dependências Adicionais**

```bash
pip install scipy scikit-learn
```

### **Bibliotecas Utilizadas:**
- **scipy.stats:** Testes estatísticos, regressão linear
- **sklearn.cluster:** Algoritmo K-means
- **sklearn.preprocessing:** Normalização de dados
- **numpy:** Cálculos numéricos avançados
- **pandas:** Manipulação de dados

## 🎨 **Sugestões Inteligentes**

### **Baseadas no Tipo de Dados:**
- **Numéricos:** Análise de tendências, correlações, outliers
- **Categóricos:** Distribuição, frequências, diversidade
- **Datas:** Sazonalidade, tendências temporais
- **Múltiplas variáveis:** Clustering, análise preditiva

### **Baseadas no Contexto:**
- Sugestões de análises complementares
- Recomendações de visualizações
- Próximos passos de investigação
- Alertas sobre qualidade dos dados

## 🚀 **Próximas Melhorias**

### **Fase 2 - Análises Avançadas:**
- Análise de séries temporais (ARIMA, SARIMA)
- Machine Learning (Random Forest, XGBoost)
- Análise de sentimentos
- Detecção de anomalias avançada

### **Fase 3 - IA Conversacional:**
- Integração com GPT-4/Claude/Gemini
- Respostas mais naturais e contextualizadas
- Sugestões personalizadas baseadas no histórico
- Explicações detalhadas das análises

### **Fase 4 - Visualizações:**
- Gráficos interativos
- Dashboards dinâmicos
- Exportação de relatórios
- Comparação de modelos

---

**🎯 A IA agora é muito mais poderosa e pode responder perguntas complexas sobre seus dados!** 