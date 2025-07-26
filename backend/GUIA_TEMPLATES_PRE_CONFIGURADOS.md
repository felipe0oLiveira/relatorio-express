# 🎯 **TEMPLATES PRÉ-CONFIGURADOS - SELECIONE E USE!**

## 🚀 **Como Funciona**

Agora você pode **simplesmente selecionar** um template pré-configurado e começar a usar imediatamente! Não precisa mais configurar nada manualmente.

---

## 📋 **Endpoints para Templates Pré-configurados**

### **1. 📖 Listar Todos os Templates**
```
GET /templates/predefined?token=SEU_TOKEN
```

### **2. 👁️ Ver Template Específico**
```
GET /templates/predefined/{template_id}?token=SEU_TOKEN
```

### **3. ➕ Criar Template Personalizado**
```
POST /templates/from-predefined/{template_id}?token=SEU_TOKEN
```

---

## 🎨 **Templates Disponíveis**

### **1. 🌍 Análise de Vendas por Região**
- **ID**: `geography_sales`
- **Categoria**: Vendas
- **Dificuldade**: Fácil
- **Tempo**: 2 minutos
- **Descrição**: Template para análise geográfica de vendas com cores corporativas
- **Colunas necessárias**: `Total Sales`, `Region`
- **Gráfico**: Barras
- **Cores**: Azul corporativo

### **2. 📈 Tendência Mensal de Vendas**
- **ID**: `trend_monthly`
- **Categoria**: Tendências
- **Dificuldade**: Médio
- **Tempo**: 3 minutos
- **Descrição**: Template para análise de tendências temporais com previsão
- **Colunas necessárias**: `Date`, `Total Sales`
- **Gráfico**: Linha
- **Recursos**: Previsão, intervalo de confiança

### **3. ⚠️ Análise de Risco de Crédito**
- **ID**: `risk_credit`
- **Categoria**: Risco
- **Dificuldade**: Avançado
- **Tempo**: 5 minutos
- **Descrição**: Template para análise de risco de clientes com múltiplos fatores
- **Colunas necessárias**: `Credit_Score`, `Payment_History`, `Income_Level`, `Debt_Ratio`
- **Gráfico**: Dispersão
- **Recursos**: Score de risco, zonas de risco

### **4. 📢 Análise de Campanhas de Marketing**
- **ID**: `marketing_campaigns`
- **Categoria**: Marketing
- **Dificuldade**: Médio
- **Tempo**: 3 minutos
- **Descrição**: Template para análise de performance de campanhas de marketing
- **Colunas necessárias**: `Campaign_Date`, `Conversions`
- **Gráfico**: Linha
- **Recursos**: Previsão, linha de meta

### **5. 💰 Resumo Financeiro Executivo**
- **ID**: `financial_summary`
- **Categoria**: Financeiro
- **Dificuldade**: Fácil
- **Tempo**: 2 minutos
- **Descrição**: Template para relatórios financeiros executivos
- **Colunas necessárias**: `Revenue`, `Territory`
- **Gráfico**: Barras
- **Recursos**: Logo da empresa, exportação PDF

### **6. 👥 Segmentação de Clientes**
- **ID**: `customer_segmentation`
- **Categoria**: Clientes
- **Dificuldade**: Fácil
- **Tempo**: 2 minutos
- **Descrição**: Template para análise de segmentação de clientes
- **Colunas necessárias**: `Customer_Count`, `Segment`
- **Gráfico**: Pizza
- **Recursos**: Percentuais, legenda

### **7. 📦 Performance de Produtos**
- **ID**: `product_performance`
- **Categoria**: Produtos
- **Dificuldade**: Fácil
- **Tempo**: 2 minutos
- **Descrição**: Template para análise de performance de produtos
- **Colunas necessárias**: `Sales_Volume`, `Product_Category`
- **Gráfico**: Barras
- **Recursos**: Top 10, grid

### **8. 🌸 Análise Sazonal**
- **ID**: `seasonal_analysis`
- **Categoria**: Sazonal
- **Dificuldade**: Avançado
- **Tempo**: 4 minutos
- **Descrição**: Template para análise de padrões sazonais
- **Colunas necessárias**: `Date`, `Sales`
- **Gráfico**: Linha
- **Recursos**: Padrões sazonais, previsão anual

---

## 🚀 **Como Usar no Swagger UI**

### **Passo 1: Ver Templates Disponíveis**
```
GET /templates/predefined?token=SEU_TOKEN
```

### **Passo 2: Escolher um Template**
```
GET /templates/predefined/geography_sales?token=SEU_TOKEN
```

### **Passo 3: Criar Template Personalizado**
```
POST /templates/from-predefined/geography_sales?token=SEU_TOKEN
```

### **Passo 4: Usar o Template**
Agora você pode usar o template criado nos endpoints de análise!

---

## 📊 **Exemplo Prático**

### **1. Listar Templates:**
```json
[
  {
    "id": "geography_sales",
    "name": "Análise de Vendas por Região",
    "description": "Template para análise geográfica de vendas com cores corporativas",
    "category": "Vendas",
    "difficulty": "Fácil",
    "estimated_time": "2 minutos"
  },
  {
    "id": "trend_monthly",
    "name": "Tendência Mensal de Vendas",
    "description": "Template para análise de tendências temporais com previsão",
    "category": "Tendências",
    "difficulty": "Médio",
    "estimated_time": "3 minutos"
  }
]
```

### **2. Ver Template Específico:**
```json
{
  "id": "geography_sales",
  "name": "Análise de Vendas por Região",
  "description": "Template para análise geográfica de vendas com cores corporativas",
  "category": "Vendas",
  "difficulty": "Fácil",
  "estimated_time": "2 minutos",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region",
    "chart_type": "bar",
    "colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"]
  },
  "usage_instructions": "Upload de arquivo CSV com colunas 'Total Sales' e 'Region'"
}
```

### **3. Criar Template Personalizado:**
```json
{
  "id": 1,
  "name": "Análise de Vendas por Região - Personalizado",
  "description": "Template personalizado baseado em: Template para análise geográfica de vendas com cores corporativas",
  "user_id": "seu_user_id",
  "created_at": "2024-01-15T10:30:00",
  "source_template": "geography_sales"
}
```

---

## 🎯 **Benefícios dos Templates Pré-configurados**

| **Benefício** | **Descrição** |
|---------------|---------------|
| ⚡ **Rápido** | Comece em 2 minutos |
| 🎯 **Específico** | Configurado para cada área |
| 🎨 **Profissional** | Cores e estilos otimizados |
| 📊 **Completo** | Todas as configurações incluídas |
| 🔄 **Reutilizável** | Use quantas vezes quiser |
| 📱 **Responsivo** | Funciona em qualquer dispositivo |

---

## 🏢 **Casos de Uso por Área**

### **📈 Vendas**
- **Template**: `geography_sales`
- **Uso**: Relatórios mensais de vendas por região
- **Frequência**: Semanal/Mensal

### **📊 Marketing**
- **Template**: `marketing_campaigns`
- **Uso**: Análise de performance de campanhas
- **Frequência**: Diária/Semanal

### **💰 Financeiro**
- **Template**: `financial_summary`
- **Uso**: Relatórios executivos financeiros
- **Frequência**: Mensal/Trimestral

### **👥 RH/Clientes**
- **Template**: `customer_segmentation`
- **Uso**: Análise de segmentação de clientes
- **Frequência**: Mensal

### **⚠️ Risco**
- **Template**: `risk_credit`
- **Uso**: Análise de risco de crédito
- **Frequência**: Semanal/Mensal

---

## 🚀 **Próximos Passos**

1. **Teste** os templates pré-configurados
2. **Escolha** o que melhor se adapta aos seus dados
3. **Crie** seu template personalizado
4. **Use** nos endpoints de análise
5. **Personalize** conforme necessário

**✨ Templates pré-configurados = Análises profissionais em minutos! 🎯** 