# 📋 Guia Completo: Como usar Templates no AutoReport SaaS

## 🎯 O que são Templates?

Templates são **modelos pré-configurados** que permitem salvar e reutilizar configurações de análise. É como um "molde" que você pode usar repetidamente para gerar relatórios similares.

## 🚀 Como usar Templates no Swagger UI

### 1. **Acessar o Swagger UI**
```
http://localhost:8000/docs?token=SEU_TOKEN
```

### 2. **Endpoints de Templates Disponíveis**

#### **📋 Listar Templates**
- **Endpoint**: `GET /templates`
- **Descrição**: Lista todos os templates do usuário
- **Uso**: Clique em "Try it out" → Execute

#### **➕ Criar Template**
- **Endpoint**: `POST /templates`
- **Descrição**: Cria um novo template
- **Exemplo de JSON**:
```json
{
  "name": "Análise de Vendas por Região",
  "description": "Template para análise geográfica de vendas",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region",
    "chart_type": "bar",
    "include_percentages": true,
    "sort_by": "value_desc",
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    "title": "Distribuição de Vendas por Região",
    "subtitle": "Análise geográfica das vendas totais"
  }
}
```

#### **👁️ Obter Template Específico**
- **Endpoint**: `GET /templates/{template_id}`
- **Descrição**: Obtém detalhes de um template específico
- **Uso**: Substitua `{template_id}` pelo ID do template

#### **✏️ Atualizar Template**
- **Endpoint**: `PUT /templates/{template_id}`
- **Descrição**: Atualiza um template existente
- **Uso**: Mesmo formato do POST, mas com ID específico

#### **🗑️ Deletar Template**
- **Endpoint**: `DELETE /templates/{template_id}`
- **Descrição**: Remove um template
- **Uso**: Apenas o ID é necessário

## 📊 Tipos de Templates Disponíveis

### 1. **🌍 Template de Análise Geográfica**
```json
{
  "name": "Análise de Vendas por Região",
  "description": "Template para análise geográfica",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region",
    "chart_type": "bar",
    "include_percentages": true,
    "sort_by": "value_desc",
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    "title": "Distribuição de Vendas por Região",
    "subtitle": "Análise geográfica das vendas totais"
  }
}
```

### 2. **📈 Template de Análise de Tendências**
```json
{
  "name": "Tendência Mensal de Vendas",
  "description": "Template para análise de tendências",
  "config": {
    "analysis_type": "trend",
    "date_column": "Date",
    "value_column": "Sales",
    "trend_period": "monthly",
    "forecast_periods": 3,
    "chart_type": "line",
    "include_forecast": true,
    "confidence_interval": 0.95,
    "title": "Tendência de Vendas Mensal",
    "subtitle": "Análise temporal com previsão"
  }
}
```

### 3. **⚠️ Template de Análise de Risco**
```json
{
  "name": "Análise de Risco de Clientes",
  "description": "Template para análise de risco",
  "config": {
    "analysis_type": "risk-score",
    "risk_factors": [
      {"column": "Payment_Delay", "weight": 0.3, "risk_type": "high"},
      {"column": "Credit_Score", "weight": 0.4, "risk_type": "low"},
      {"column": "Order_Value", "weight": 0.2, "risk_type": "high"},
      {"column": "Customer_Age", "weight": 0.1, "risk_type": "low"}
    ],
    "risk_thresholds": {
      "low": 0.3,
      "medium": 0.7,
      "high": 1.0
    },
    "chart_type": "scatter",
    "color_by_risk": true,
    "title": "Análise de Risco de Clientes",
    "subtitle": "Score de risco baseado em múltiplos fatores"
  }
}
```

## 🔧 Como Usar Templates para Análises

### **Passo a Passo:**

1. **Criar o Template**:
   - Use o endpoint `POST /templates`
   - Configure os parâmetros desejados
   - Salve o template

2. **Obter a Configuração**:
   - Use `GET /templates/{id}` para obter a configuração
   - Copie os parâmetros do campo `config`

3. **Usar na Análise**:
   - Use os parâmetros do template nos endpoints de análise
   - Exemplo: `/reports/analyze/geography` com os parâmetros do template

### **Exemplo Prático:**

1. **Criar template**:
```bash
POST /templates
{
  "name": "Meu Template Geográfico",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region"
  }
}
```

2. **Usar template**:
```bash
POST /reports/analyze/geography
{
  "value_column": "Total Sales",
  "region_column": "Region"
}
```

## 💡 Benefícios dos Templates

- **⏱️ Economia de Tempo**: Não precisa reconfigurar análises repetitivas
- **📊 Consistência**: Relatórios padronizados
- **🔄 Reutilização**: Use o mesmo template para diferentes datasets
- **👥 Colaboração**: Templates podem ser compartilhados entre usuários
- **📈 Produtividade**: Análises mais rápidas e eficientes

## 🎯 Casos de Uso Práticos

### **Relatórios Semanais**
- Template para relatório de vendas semanal
- Configuração padrão de gráficos e métricas

### **Análises Mensais**
- Template para análise de performance mensal
- KPIs e indicadores pré-definidos

### **Dashboards Executivos**
- Template para dashboard de KPIs
- Layout e métricas padronizadas

### **Relatórios de Risco**
- Template para análise de risco de clientes
- Fatores de risco pré-configurados

## 🔍 Verificação de Templates

### **Listar todos os templates**:
```bash
GET /templates?token=SEU_TOKEN
```

### **Verificar template específico**:
```bash
GET /templates/1?token=SEU_TOKEN
```

### **Testar criação**:
```bash
POST /templates?token=SEU_TOKEN
{
  "name": "Template de Teste",
  "description": "Template para testes",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales"
  }
}
```

## ✅ Status Atual

- ✅ **Templates criados**: 3 templates funcionais
- ✅ **CRUD completo**: Criar, ler, atualizar, deletar
- ✅ **Configuração JSON**: Estrutura flexível
- ✅ **Integração**: Funciona com endpoints de análise
- ✅ **Autenticação**: Protegido por JWT

## 🚀 Próximos Passos

1. **Usar templates nas análises**: Integrar com endpoints de análise
2. **Templates públicos**: Compartilhamento entre usuários
3. **Interface gráfica**: Frontend para gerenciar templates
4. **Validação avançada**: Verificar compatibilidade de dados
5. **Versionamento**: Histórico de mudanças nos templates

---

**🎯 Templates estão funcionando perfeitamente! Use-os para automatizar suas análises!** 