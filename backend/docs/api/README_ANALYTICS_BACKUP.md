# 📊 Analytics e 💾 Backup - AutoReport SaaS

## 🚀 Sistemas Implementados

Este documento descreve os sistemas de **Analytics** e **Backup** adicionados ao AutoReport SaaS.

## 📊 Sistema de Analytics

### Funcionalidades

- **Dashboard Analytics**: Métricas gerais com filtros por período
- **Relatórios Analytics**: Análise temporal e por tipo de relatório
- **Templates Analytics**: Análise de configurações e uso de templates
- **Usage Analytics**: Padrões de uso, horários de pico, etc.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/analytics/dashboard` | Métricas gerais do dashboard |
| GET | `/analytics/reports` | Analytics específicos de relatórios |
| GET | `/analytics/templates` | Analytics específicos de templates |
| GET | `/analytics/usage` | Métricas de uso da plataforma |

### Exemplo de Uso

```bash
# Dashboard dos últimos 30 dias
curl -X GET "http://localhost:8000/analytics/dashboard?period=30d" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Analytics de relatórios específicos
curl -X GET "http://localhost:8000/analytics/reports?start_date=2024-01-01&end_date=2024-03-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💾 Sistema de Backup

### Funcionalidades

- **Exportação Completa**: Todos os dados do usuário em JSON ou ZIP
- **Importação Segura**: Restauração de dados com validação
- **Backup Automático**: Agendamento de backups periódicos
- **Histórico**: Controle de backups realizados

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/backup/export` | Exporta dados do usuário |
| POST | `/backup/import` | Importa dados de backup |
| GET | `/backup/schedule` | Agenda backup automático |
| GET | `/backup/history` | Histórico de backups |

### Exemplo de Uso

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

## 🗄️ Configuração do Banco de Dados

### 1. Executar Script SQL

Execute o arquivo `setup_backup_tables.sql` no Supabase SQL Editor:

```sql
-- Tabelas criadas:
-- backup_schedules: Agendamentos de backup
-- backup_history: Histórico de backups
```

### 2. Verificar Tabelas

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('backup_schedules', 'backup_history');
```

## 🧪 Testes

### Executar Testes

```bash
# Opção 1: Usar o script automatizado
python run_tests.py

# Opção 2: Executar diretamente
python tests/test_analytics_backup.py

# Opção 3: Com pytest (se instalado)
python -m pytest tests/test_analytics_backup.py -v
```

### Testes Disponíveis

- ✅ Analytics Dashboard
- ✅ Analytics Reports
- ✅ Analytics Templates
- ✅ Analytics Usage
- ✅ Backup Export (JSON/ZIP)
- ✅ Backup Import
- ✅ Backup Schedule
- ✅ Backup History

## 📁 Estrutura de Arquivos

```
backend/
├── app/
│   ├── routes/
│   │   ├── analytics.py      # Sistema de Analytics
│   │   └── backup.py         # Sistema de Backup
│   └── main.py               # Rotas integradas
├── tests/
│   └── test_analytics_backup.py  # Testes dos sistemas
├── setup_backup_tables.sql   # Script SQL para tabelas
├── docs/
│   └── ANALYTICS_BACKUP.md   # Documentação completa
└── README_ANALYTICS_BACKUP.md # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)

```env
# Configurações de Backup
BACKUP_STORAGE_PATH=/path/to/backups
BACKUP_RETENTION_DAYS=90
```

### Dependências

As dependências já estão incluídas no `requirements.txt`:

```
pandas
openpyxl
```

## 📊 Exemplos de Resposta

### Analytics Dashboard

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

### Backup Export

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

## 🔒 Segurança

- **Row Level Security (RLS)**: Todas as tabelas protegidas
- **Validação de Usuário**: Apenas dados próprios
- **Rate Limiting**: Proteção contra abuso
- **Auditoria**: Logs de todas as operações

## 🚀 Deploy

### Checklist

- [ ] Executar `setup_backup_tables.sql` no Supabase
- [ ] Verificar se as rotas estão funcionando
- [ ] Testar endpoints com token válido
- [ ] Configurar variáveis de ambiente (opcional)

### Verificação

```bash
# Verificar se o servidor está rodando
curl http://localhost:8000/health

# Testar endpoint de analytics (sem autenticação)
curl http://localhost:8000/analytics/dashboard

# Testar com autenticação
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/analytics/dashboard
```

## 🎯 Próximos Passos

### Frontend

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

### Melhorias Futuras

- Cache de analytics
- Backup em nuvem
- Relatórios agendados
- Alertas de performance
- Exportação de analytics

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do servidor
2. Execute os testes para identificar problemas
3. Consulte a documentação completa em `docs/ANALYTICS_BACKUP.md`
4. Verifique se as tabelas foram criadas corretamente

---

**Status**: ✅ Sistemas Implementados e Testados  
**Versão**: 1.0.0  
**Data**: Março 2024 