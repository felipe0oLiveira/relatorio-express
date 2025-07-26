# 🎨 **GUIA COMPLETO: Personalização de Templates**

## 🎯 **Como Personalizar seus Templates**

### **📋 Endpoints Disponíveis para Personalização:**

| **Operação** | **Endpoint** | **Descrição** |
|--------------|--------------|---------------|
| 📖 **Listar** | `GET /templates` | Ver todos os seus templates |
| 👁️ **Visualizar** | `GET /templates/{id}` | Ver detalhes de um template |
| ✏️ **Editar** | `PUT /templates/{id}` | Modificar template existente |
| 🗑️ **Deletar** | `DELETE /templates/{id}` | Remover template |
| ➕ **Criar** | `POST /templates` | Criar novo template |

---

## 🎨 **Tipos de Personalização**

### **1. 🎨 Personalização Visual**

#### **Cores do Gráfico:**
```json
{
  "config": {
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFE66D"]
  }
}
```

#### **Tipos de Gráfico:**
```json
{
  "config": {
    "chart_type": "bar"      // barras
    "chart_type": "line"     // linha
    "chart_type": "pie"      // pizza
    "chart_type": "scatter"  // dispersão
  }
}
```

#### **Títulos e Legendas:**
```json
{
  "config": {
    "title": "Meu Gráfico Personalizado",
    "subtitle": "Análise detalhada dos dados",
    "x_axis_label": "Regiões",
    "y_axis_label": "Vendas (R$)"
  }
}
```

### **2. 📊 Personalização de Dados**

#### **Colunas Específicas:**
```json
{
  "config": {
    "value_column": "Total Sales",
    "region_column": "Region",
    "date_column": "Date",
    "category_column": "Product"
  }
}
```

#### **Agregações:**
```json
{
  "config": {
    "aggregation": "sum",     // soma
    "aggregation": "mean",    // média
    "aggregation": "count",   // contagem
    "aggregation": "max"      // máximo
  }
}
```

#### **Filtros:**
```json
{
  "config": {
    "filters": {
      "date_range": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      },
      "value_threshold": 1000,
      "exclude_regions": ["Teste", "Demo"]
    }
  }
}
```

### **3. 🔧 Personalização de Análise**

#### **Análise Geográfica:**
```json
{
  "config": {
    "analysis_type": "geography",
    "include_percentages": true,
    "sort_by": "value_desc",
    "top_n": 10,
    "group_small_values": true,
    "small_value_threshold": 0.05
  }
}
```

#### **Análise de Tendências:**
```json
{
  "config": {
    "analysis_type": "trend",
    "trend_period": "daily",    // daily, weekly, monthly, yearly
    "forecast_periods": 12,
    "include_forecast": true,
    "confidence_interval": 0.95,
    "seasonality": true
  }
}
```

#### **Análise de Risco:**
```json
{
  "config": {
    "analysis_type": "risk-score",
    "risk_factors": [
      {
        "column": "Payment_Delay",
        "weight": 0.3,
        "risk_type": "high"
      },
      {
        "column": "Credit_Score",
        "weight": 0.4,
        "risk_type": "low"
      }
    ],
    "risk_thresholds": {
      "low": 0.3,
      "medium": 0.7,
      "high": 1.0
    }
  }
}
```

---

## 🚀 **Exemplos Práticos de Personalização**

### **Exemplo 1: Template Corporativo**
```json
{
  "name": "Relatório Executivo Mensal",
  "description": "Template para relatórios executivos com cores corporativas",
  "config": {
    "analysis_type": "geography",
    "value_column": "Revenue",
    "region_column": "Territory",
    "chart_type": "bar",
    "colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"],
    "title": "Receita por Território",
    "subtitle": "Relatório Executivo - Janeiro 2024",
    "include_percentages": true,
    "sort_by": "value_desc",
    "company_logo": true,
    "footer_text": "Confidencial - Uso Interno"
  }
}
```

### **Exemplo 2: Template de Marketing**
```json
{
  "name": "Análise de Campanhas",
  "description": "Template para análise de performance de campanhas",
  "config": {
    "analysis_type": "trend",
    "date_column": "Campaign_Date",
    "value_column": "Conversions",
    "chart_type": "line",
    "colors": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"],
    "title": "Performance de Campanhas",
    "subtitle": "Taxa de Conversão ao Longo do Tempo",
    "trend_period": "daily",
    "include_forecast": true,
    "forecast_periods": 7,
    "show_target_line": true,
    "target_value": 0.05
  }
}
```

### **Exemplo 3: Template Financeiro**
```json
{
  "name": "Análise de Risco de Crédito",
  "description": "Template para análise de risco de clientes",
  "config": {
    "analysis_type": "risk-score",
    "risk_factors": [
      {"column": "Credit_Score", "weight": 0.4, "risk_type": "low"},
      {"column": "Payment_History", "weight": 0.3, "risk_type": "high"},
      {"column": "Income_Level", "weight": 0.2, "risk_type": "low"},
      {"column": "Debt_Ratio", "weight": 0.1, "risk_type": "high"}
    ],
    "chart_type": "scatter",
    "colors": ["#27ae60", "#f39c12", "#e74c3c"],
    "title": "Análise de Risco de Crédito",
    "subtitle": "Score vs Fatores de Risco",
    "risk_thresholds": {
      "low": 0.3,
      "medium": 0.7,
      "high": 1.0
    },
    "show_risk_zones": true
  }
}
```

---

## 🛠️ **Como Editar Templates no Swagger UI**

### **Passo 1: Listar Templates**
```
GET /templates?token=SEU_TOKEN
```

### **Passo 2: Visualizar Template**
```
GET /templates/1?token=SEU_TOKEN
```

### **Passo 3: Editar Template**
```
PUT /templates/1?token=SEU_TOKEN
{
  "name": "Template Atualizado",
  "description": "Nova descrição",
  "config": {
    // suas configurações personalizadas
  }
}
```

---

## 🎯 **Dicas de Personalização**

### **1. 🎨 Cores Profissionais**
```json
// Cores corporativas azuis
"colors": ["#1f4e79", "#2e5984", "#3c7aa3", "#4a9bc2", "#58bce1"]

// Cores vibrantes para marketing
"colors": ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#3498db"]

// Cores neutras para relatórios
"colors": ["#34495e", "#7f8c8d", "#95a5a6", "#bdc3c7", "#ecf0f1"]
```

### **2. 📊 Configurações Avançadas**
```json
{
  "config": {
    "show_grid": true,
    "show_legend": true,
    "legend_position": "bottom",
    "animation": true,
    "responsive": true,
    "export_formats": ["png", "pdf", "svg"]
  }
}
```

### **3. 🔍 Filtros Inteligentes**
```json
{
  "config": {
    "filters": {
      "date_range": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      },
      "value_threshold": 1000,
      "include_only": ["Active", "Premium"],
      "exclude": ["Test", "Demo", "Cancelled"]
    }
  }
}
```

---

## 📱 **Personalização por Dispositivo**

### **Mobile-Friendly:**
```json
{
  "config": {
    "mobile_optimized": true,
    "chart_height": 300,
    "font_size": "14px",
    "touch_interactive": true
  }
}
```

### **Desktop:**
```json
{
  "config": {
    "chart_height": 500,
    "font_size": "16px",
    "show_details_on_hover": true,
    "full_interactivity": true
  }
}
```

---

## 🚀 **Próximos Passos**

1. **Experimente** diferentes configurações
2. **Teste** seus templates com dados reais
3. **Compartilhe** templates com sua equipe
4. **Crie** biblioteca de templates personalizados
5. **Automatize** relatórios com templates

**✨ Templates personalizados = Relatórios únicos e profissionais! 🎨** 