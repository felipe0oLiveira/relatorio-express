# 📊 Guia Completo: Geração Automática de Relatórios Excel

## 🎯 O que são os Endpoints de Excel Automático?

Os novos endpoints permitem que o usuário **faça upload de dados e gere relatórios Excel automaticamente** com análises completas, sem precisar configurar manualmente cada análise.

## 🚀 Endpoints Disponíveis

### 1. **📊 POST /reports/generate-excel**
**Gera relatório Excel com configuração manual**

#### **Parâmetros:**
- `file`: Arquivo CSV/Excel com os dados
- `report_type`: Tipo de relatório (`summary`, `geography`, `trend`, `risk`, `custom`)
- `title`: Título do relatório
- `include_summary`: Incluir resumo estatístico (true/false)
- `include_charts`: Incluir gráficos (true/false)
- `value_column`: Coluna de valores para análises
- `region_column`: Coluna de região (para análise geográfica)
- `date_column`: Coluna de data (para análise temporal)
- `custom_analysis`: Análise customizada (para report_type='custom')

#### **Tipos de Relatório:**

##### **📋 Summary (Resumo)**
```json
{
  "report_type": "summary",
  "title": "Relatório de Vendas - Resumo",
  "include_summary": true,
  "include_charts": true
}
```
**Resultado**: Excel com dados originais + resumo estatístico + análise geral

##### **🌍 Geography (Geográfico)**
```json
{
  "report_type": "geography",
  "title": "Relatório de Vendas por Região",
  "value_column": "Total Sales",
  "region_column": "Region",
  "include_summary": true
}
```
**Resultado**: Excel com análise geográfica + agregações por região + percentuais

##### **📈 Trend (Tendência)**
```json
{
  "report_type": "trend",
  "title": "Relatório de Tendência de Vendas",
  "value_column": "Sales",
  "date_column": "Date",
  "include_summary": true
}
```
**Resultado**: Excel com análise temporal + agregações por período

##### **⚠️ Risk (Risco)**
```json
{
  "report_type": "risk",
  "title": "Relatório de Análise de Risco",
  "value_column": "Total Sales",
  "include_summary": true
}
```
**Resultado**: Excel com estatísticas de risco + identificação de outliers

##### **🔧 Custom (Customizado)**
```json
{
  "report_type": "custom",
  "title": "Relatório Customizado",
  "custom_analysis": "Análise específica solicitada pelo usuário",
  "include_summary": true
}
```
**Resultado**: Excel com análise customizada + dados originais

### 2. **📋 POST /reports/generate-excel-from-template**
**Gera relatório Excel usando template pré-configurado**

#### **Parâmetros:**
- `file`: Arquivo CSV/Excel com os dados
- `template_id`: ID do template a ser usado
- `title`: Título do relatório

#### **Vantagens:**
- ✅ Usa configuração pré-definida
- ✅ Análise consistente
- ✅ Economia de tempo
- ✅ Padronização de relatórios

## 📁 Estrutura dos Arquivos Excel Gerados

### **Aba 1: Dados Originais**
- Dados completos do arquivo enviado
- Preserva formato original

### **Aba 2: Resumo Estatístico** (se include_summary=true)
- Estatísticas descritivas (média, mediana, desvio padrão, etc.)
- Informações gerais (total de registros, colunas, data de geração)

### **Aba 3: Análise Específica**
- Baseada no tipo de relatório escolhido
- Agregações e cálculos específicos

### **Aba 4: Metadados**
- Informações sobre o relatório
- Configurações usadas
- Data e usuário que gerou

## 🎯 Como Usar no Swagger UI

### **Passo a Passo:**

1. **Acesse o Swagger UI**:
   ```
   http://localhost:8000/docs?token=SEU_TOKEN
   ```

2. **Escolha o endpoint**:
   - `POST /reports/generate-excel` (configuração manual)
   - `POST /reports/generate-excel-from-template` (usando template)

3. **Clique em "Try it out"**

4. **Configure os parâmetros**:
   - Faça upload do arquivo
   - Escolha o tipo de relatório
   - Configure colunas específicas
   - Defina o título

5. **Execute**:
   - O Excel será gerado automaticamente
   - O arquivo será baixado automaticamente

## 📊 Exemplos Práticos

### **Exemplo 1: Relatório de Vendas por Região**
```bash
POST /reports/generate-excel?token=SEU_TOKEN
Content-Type: multipart/form-data

file: vendas.csv
report_type: geography
title: "Relatório de Vendas por Região - Q1 2024"
value_column: "Total Sales"
region_column: "Region"
include_summary: true
include_charts: true
```

### **Exemplo 2: Relatório com Template**
```bash
POST /reports/generate-excel-from-template?token=SEU_TOKEN
Content-Type: multipart/form-data

file: dados.csv
template_id: 1
title: "Relatório Mensal - Template Padrão"
```

### **Exemplo 3: Análise de Risco**
```bash
POST /reports/generate-excel?token=SEU_TOKEN
Content-Type: multipart/form-data

file: clientes.csv
report_type: risk
title: "Análise de Risco de Clientes"
value_column: "Credit Score"
include_summary: true
```

## 🔧 Casos de Uso Práticos

### **📈 Relatórios Semanais**
- Template: Análise geográfica de vendas
- Configuração: Região + Valor de vendas
- Resultado: Excel com distribuição por região

### **📊 Dashboards Mensais**
- Template: Análise temporal
- Configuração: Data + Métricas
- Resultado: Excel com tendências mensais

### **⚠️ Relatórios de Risco**
- Template: Análise de risco
- Configuração: Fatores de risco
- Resultado: Excel com scores e outliers

### **🌍 Análises Geográficas**
- Template: Análise geográfica
- Configuração: Região + Valor
- Resultado: Excel com distribuição geográfica

## 💡 Benefícios

### **⏱️ Economia de Tempo**
- Geração automática de relatórios
- Não precisa configurar manualmente
- Processamento em segundos

### **📊 Consistência**
- Relatórios padronizados
- Formato uniforme
- Métricas consistentes

### **🔄 Reutilização**
- Templates reutilizáveis
- Configurações salvas
- Análises repetitivas

### **📈 Produtividade**
- Foco na análise, não na formatação
- Relatórios profissionais
- Dados organizados

## 🎯 Status Atual

- ✅ **Endpoints criados**: 2 endpoints funcionais
- ✅ **Tipos de relatório**: 5 tipos diferentes
- ✅ **Integração com templates**: Funcionando
- ✅ **Rate limiting**: 10/minuto
- ✅ **Autenticação**: Protegido por JWT
- ✅ **Formato Excel**: .xlsx com múltiplas abas
- ✅ **Testes realizados**: Todos funcionando

## 📋 Arquivos Gerados nos Testes

Os seguintes arquivos foram gerados com sucesso:
- `relatorio_resumo_20250725_191624.xlsx`
- `relatorio_geografia_20250725_191626.xlsx`
- `relatorio_template_20250725_191633.xlsx`
- `relatorio_risco_20250725_191635.xlsx`

## 🚀 Próximos Passos

1. **Interface gráfica**: Frontend para geração de relatórios
2. **Mais tipos de análise**: Análises estatísticas avançadas
3. **Gráficos no Excel**: Incluir gráficos nos arquivos
4. **Agendamento**: Relatórios automáticos periódicos
5. **Compartilhamento**: Envio por email

---

## 🎉 **RESUMO: Funcionalidade Completa!**

✅ **Endpoints funcionando perfeitamente**
✅ **Geração automática de Excel**
✅ **Integração com templates**
✅ **Múltiplos tipos de análise**
✅ **Rate limiting e autenticação**

**Os usuários agora podem gerar relatórios Excel automaticamente com apenas um upload de arquivo! 🚀** 