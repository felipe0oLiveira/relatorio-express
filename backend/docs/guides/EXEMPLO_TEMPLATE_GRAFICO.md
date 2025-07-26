# 🎯 **TEMPLATES + GERAÇÃO DE GRÁFICOS**

## 🤔 **Como Templates Geram Gráficos?**

### **📊 Fluxo Completo:**

```
1. 📝 CRIAR TEMPLATE
   ↓
2. 💾 SALVAR CONFIGURAÇÕES
   ↓
3. 📁 UPLOAD DE DADOS
   ↓
4. 🔧 APLICAR TEMPLATE
   ↓
5. 📈 GERAR GRÁFICO
```

---

## 🎨 **Exemplo Visual Completo**

### **PASSO 1: Criar Template**
```json
{
  "name": "Gráfico de Vendas por Região",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region",
    "chart_type": "bar",
    "colors": ["#FF6B6B", "#4ECDC4"],
    "title": "Vendas por Região"
  }
}
```

### **PASSO 2: Dados de Entrada (CSV)**
```csv
Region,Total Sales,Date
Norte,15000,2024-01-01
Sul,25000,2024-01-02
Leste,18000,2024-01-03
Oeste,22000,2024-01-04
Centro,30000,2024-01-05
```

### **PASSO 3: Aplicar Template**
```
Sistema lê o template e aplica:
• value_column = "Total Sales"
• region_column = "Region"
• chart_type = "bar"
• colors = ["#FF6B6B", "#4ECDC4"]
```

### **PASSO 4: Gráfico Gerado**
```
┌─────────────────────────────────────┐
│         VENDAS POR REGIÃO           │
├─────────────────────────────────────┤
│ Norte   │ ████████████████ │ 15,000 │
│ Sul     │ ████████████████████████ │ 25,000 │
│ Leste   │ ████████████████████ │ 18,000 │
│ Oeste   │ ██████████████████████ │ 22,000 │
│ Centro  │ ████████████████████████████ │ 30,000 │
└─────────────────────────────────────┘
```

---

## 🔧 **Como Funciona na Prática**

### **Endpoint de Análise Geográfica:**
```
POST /reports/analyze/geography
```

**Parâmetros necessários:**
- `file`: Arquivo CSV
- `geo_col`: Coluna de região
- `value_col`: Coluna de valor

### **Template Aplica Automaticamente:**
```python
# Sem template (manual):
geo_col = "Region"        # ← Você define
value_col = "Total Sales" # ← Você define

# Com template (automático):
geo_col = template.config["region_column"]     # ← Template define
value_col = template.config["value_column"]    # ← Template define
```

---

## 🚀 **Exemplo Real no Swagger UI**

### **1. Criar Template:**
```
POST /templates
{
  "name": "Meu Gráfico de Vendas",
  "config": {
    "analysis_type": "geography",
    "value_column": "Total Sales",
    "region_column": "Region"
  }
}
```

### **2. Gerar Gráfico:**
```
POST /reports/analyze/geography
- file: seu_arquivo.csv
- geo_col: Region (do template)
- value_col: Total Sales (do template)
```

### **3. Resultado:**
```json
{
  "chart_data": {
    "labels": ["Norte", "Sul", "Leste", "Oeste", "Centro"],
    "values": [15000, 25000, 18000, 22000, 30000]
  },
  "chart_type": "bar",
  "title": "Vendas por Região"
}
```

---

## 📊 **Tipos de Gráficos Disponíveis**

### **1. 🌍 Gráfico Geográfico (Barras)**
```
Template: geography
Gráfico: Barras por região
Dados: Vendas, clientes, etc.
```

### **2. 📈 Gráfico de Tendências (Linha)**
```
Template: trend
Gráfico: Linha temporal
Dados: Vendas ao longo do tempo
```

### **3. ⚠️ Gráfico de Risco (Scatter)**
```
Template: risk-score
Gráfico: Dispersão
Dados: Score de risco vs fatores
```

---

## 💡 **Benefícios dos Templates para Gráficos**

| **Sem Template** | **Com Template** |
|------------------|------------------|
| 🔧 Configurar manualmente | ⚡ Aplicar automaticamente |
| ⏱️ 15 minutos por gráfico | ⏱️ 2 minutos por gráfico |
| ❌ Erros de configuração | ✅ Configuração consistente |
| 📊 Gráficos diferentes | 📊 Gráficos padronizados |

---

## 🎯 **Resumo: Templates + Gráficos**

**Template = Configuração Salva**
- **Salva** como você quer o gráfico
- **Aplica** automaticamente aos dados
- **Gera** gráfico consistente
- **Economiza** tempo de configuração

**É como ter um "molde" para seus gráficos! 🎨**

---

## 🚀 **Próximos Passos**

1. **Criar template** no Swagger UI
2. **Upload de dados** CSV
3. **Aplicar template** na análise
4. **Gerar gráfico** automaticamente
5. **Reutilizar** para novos dados

**✨ Templates transformam configuração manual em geração automática de gráficos!** 