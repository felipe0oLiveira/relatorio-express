# 📊 Analytics e 💾 Backup - AutoReport SaaS

## 📊 Sistema de Analytics

### Visão Geral
O sistema de Analytics fornece métricas detalhadas sobre o uso da plataforma, permitindo que os usuários acompanhem sua atividade e performance.

### Endpoints Disponíveis

#### 1. Dashboard Analytics
```http
GET /analytics/dashboard?period=30d
```

**Parâmetros:**
- `period` (opcional): Período de análise (7d, 30d, 90d, 1y)

**Resposta:**
```json
{
  "period": "30d",
  "total_reports": 15,
  "total_templates": 8,
  "reports_by_day": {
    "2024-01-15": 3,
    "2024-01-16": 2,
    "2024-01-17": 5
  },
  "popular_templates": {
    "Análise de Vendas": 5,
    "Relatório Financeiro": 3
  },
  "growth_rate": 25.5
}
```

#### 2. Relatórios Analytics
```http
GET /analytics/reports?start_date=2024-01-01&end_date=2024-12-31
```

**Parâmetros:**
- `start_date` (opcional): Data de início
- `end_date` (opcional): Data de fim

**Resposta:**
```json
{
  "total_reports": 45,
  "reports_by_month": {
    "2024-01": 12,
    "2024-02": 15,
    "2024-03": 18
  },
  "reports_by_type": {
    "geography": 20,
    "trend": 15,
    "summary": 10
  },
  "avg_generation_time": 2.5,
  "max_generation_time": 8.2,
  "date_range": {
    "start": "2024-01-01T00:00:00",
    "end": "2024-12-31T23:59:59"
  }
}
```

#### 3. Templates Analytics
```http
GET /analytics/templates
```

**Resposta:**
```json
{
  "total_templates": 12,
  "templates_by_month": {
    "2024-01": 5,
    "2024-02": 4,
    "2024-03": 3
  },
  "config_analysis": {
    "chart_types": {
      "bar": 8,
      "line": 3,
      "pie": 1
    },
    "analysis_types": {
      "geography": 6,
      "trend": 4,
      "summary": 2
    },
    "color_schemes": {
      "5_colors": 8,
      "3_colors": 4
    }
  },
  "recent_templates": [
    {
      "id": 1,
      "name": "Análise de Vendas",
      "created_at": "2024-03-15T10:30:00"
    }
  ]
}
```

#### 4. Usage Analytics
```http
GET /analytics/usage
```

**Resposta:**
```json
{
  "total_reports": 45,
  "total_templates": 12,
  "usage_by_weekday": {
    "Monday": 8,
    "Tuesday": 12,
    "Wednesday": 15,
    "Thursday": 10,
    "Friday": 5,
    "Saturday": 2,
    "Sunday": 1
  },
  "peak_hours": {
    "9": 15,
    "14": 12,
    "16": 8
  },
  "avg_reports_per_day": 1.5,
  "user_since": "2024-01-01T00:00:00"
}
```

### Funcionalidades do Analytics

1. **Métricas Temporais**
   - Relatórios por dia, mês, ano
   - Taxa de crescimento
   - Padrões sazonais

2. **Análise de Performance**
   - Tempo médio de geração
   - Tempo máximo de geração
   - Eficiência de templates

3. **Padrões de Uso**
   - Horários de pico
   - Dias da semana mais ativos
   - Frequência de uso

4. **Análise de Templates**
   - Tipos de gráfico mais usados
   - Configurações populares
   - Esquemas de cores preferidos

## 💾 Sistema de Backup

### Visão Geral
O sistema de Backup permite que os usuários exportem e importem seus dados, garantindo segurança e portabilidade das informações.

### Endpoints Disponíveis

#### 1. Exportar Dados
```http
POST /backup/export?format=json&include_reports=true&include_templates=true
```

**Parâmetros:**
- `format`: Formato de exportação (json, zip)
- `include_reports`: Incluir relatórios (true/false)
- `include_templates`: Incluir templates (true/false)
- `include_settings`: Incluir configurações (true/false)

**Resposta:** Arquivo de download (JSON ou ZIP)

**Estrutura do arquivo JSON:**
```json
{
  "export_info": {
    "user_id": "user-uuid",
    "export_date": "2024-03-15T10:30:00",
    "format": "json",
    "version": "1.0"
  },
  "data": {
    "reports": [...],
    "templates": [...],
    "settings": [...]
  }
}
```

#### 2. Importar Dados
```http
POST /backup/import
```

**Body:**
```json
{
  "file_content": "conteúdo do arquivo JSON de backup"
}
```

**Resposta:**
```json
{
  "message": "Backup importado com sucesso",
  "imported": {
    "reports": 15,
    "templates": 8,
    "settings": 1
  },
  "backup_date": "2024-03-10T15:30:00"
}
```

#### 3. Agendar Backup
```http
GET /backup/schedule?frequency=weekly
```

**Parâmetros:**
- `frequency`: Frequência do backup (daily, weekly, monthly)

**Resposta:**
```json
{
  "message": "Backup agendado com sucesso - frequência: weekly",
  "schedule": {
    "id": 1,
    "user_id": "user-uuid",
    "frequency": "weekly",
    "active": true,
    "last_backup": null,
    "next_backup": "2024-03-22T10:30:00",
    "created_at": "2024-03-15T10:30:00"
  }
}
```

#### 4. Histórico de Backups
```http
GET /backup/history
```

**Resposta:**
```json
{
  "backups": [
    {
      "id": 1,
      "user_id": "user-uuid",
      "backup_type": "manual",
      "file_size": 1024000,
      "status": "completed",
      "created_at": "2024-03-15T10:30:00"
    }
  ],
  "total_backups": 5
}
```

### Funcionalidades do Backup

1. **Exportação Completa**
   - Todos os dados do usuário
   - Múltiplos formatos (JSON, ZIP)
   - Seleção de dados específicos

2. **Importação Segura**
   - Validação de dados
   - Verificação de propriedade
   - Restauração completa

3. **Backup Automático**
   - Agendamento por frequência
   - Execução automática
   - Histórico de backups

4. **Segurança**
   - Criptografia de dados sensíveis
   - Validação de usuário
   - Logs de auditoria

## 🗄️ Tabelas do Banco de Dados

### Tabelas para Backup

```sql
-- Agendamentos de backup
backup_schedules (
    id, user_id, frequency, active, 
    last_backup, next_backup, created_at, updated_at
)

-- Histórico de backups
backup_history (
    id, user_id, backup_type, file_size, 
    status, created_at
)
```

## 🔧 Configuração

### 1. Executar Script SQL
```bash
# Execute no Supabase SQL Editor
# Arquivo: setup_backup_tables.sql
```

### 2. Variáveis de Ambiente
```env
# Configurações de Backup (opcional)
BACKUP_STORAGE_PATH=/path/to/backups
BACKUP_RETENTION_DAYS=90
```

## 📈 Exemplos de Uso

### Analytics Dashboard
```bash
# Dashboard dos últimos 30 dias
curl -X GET "http://localhost:8000/analytics/dashboard?period=30d" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Analytics de relatórios específicos
curl -X GET "http://localhost:8000/analytics/reports?start_date=2024-01-01&end_date=2024-03-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Backup de Dados
```bash
# Exportar dados em JSON
curl -X POST "http://localhost:8000/backup/export?format=json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output backup.json

# Exportar dados em ZIP
curl -X POST "http://localhost:8000/backup/export?format=zip&include_reports=true&include_templates=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output backup.zip

# Agendar backup semanal
curl -X GET "http://localhost:8000/backup/schedule?frequency=weekly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Integração com Frontend

### Componentes Sugeridos

1. **Dashboard Analytics**
   - Gráficos de métricas
   - Filtros por período
   - Indicadores de performance

2. **Backup Manager**
   - Interface de exportação
   - Upload de backup
   - Agendamento automático

3. **Relatórios de Uso**
   - Visualização de padrões
   - Comparativos temporais
   - Insights de performance

## 🔒 Segurança

- **Row Level Security (RLS)**: Todas as tabelas protegidas
- **Validação de Usuário**: Apenas dados próprios
- **Rate Limiting**: Proteção contra abuso
- **Auditoria**: Logs de todas as operações

## 🚀 Próximos Passos

1. **Implementar no Frontend**
   - Dashboard com gráficos
   - Interface de backup
   - Relatórios interativos

2. **Melhorias Futuras**
   - Cache de analytics
   - Backup em nuvem
   - Relatórios agendados
   - Alertas de performance

---

**Status**: ✅ Sistemas Implementados  
**Próximo**: 🎨 Integração com Frontend 