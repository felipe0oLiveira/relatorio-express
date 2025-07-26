# 📊 AutoReport SaaS

Plataforma completa de relatórios automáticos com inteligência artificial para análise de dados.

## 🚀 Visão Geral

O AutoReport SaaS é uma solução completa que permite transformar dados brutos em insights valiosos através de análise automatizada com IA. A plataforma oferece upload simples, processamento inteligente e geração de relatórios profissionais.

## 📁 Estrutura do Projeto

```
autoreport-saas/
├── backend/                    # API FastAPI com todas as funcionalidades
├── frontend/                   # Interface principal para usuários
├── monitoring-system/          # Sistema de monitoramento separado
│   └── monitoring-dashboard/   # Dashboard de monitoramento para desenvolvedores
├── database/                   # Scripts e configurações do banco
├── docs/                       # Documentação técnica
└── scripts/                    # Scripts de deploy e configuração
```

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Supabase** - Banco de dados PostgreSQL com autenticação
- **Pandas** - Manipulação e análise de dados
- **Python-Jose** - Autenticação JWT
- **SlowAPI** - Rate limiting
- **Cryptography** - Criptografia de dados

### Frontend Principal
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Hooks** - Gerenciamento de estado

### Sistema de Monitoramento
- **Next.js 14** - Dashboard de monitoramento
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Interface dark theme

## 🚀 Como Executar

### 1. Backend
```bash
cd backend
pip install -r app/requirements.txt
uvicorn app.main:app --reload
```
- **URL**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

### 2. Frontend Principal
```bash
cd frontend
npm install
npm run dev
```
- **URL**: http://localhost:3000
- **Interface**: Landing page, Dashboard, Upload

### 3. Sistema de Monitoramento
```bash
cd monitoring-system/monitoring-dashboard
npm install
npm run dev
```
- **URL**: http://localhost:3001
- **Interface**: Dashboard de monitoramento para desenvolvedores

## 📊 Funcionalidades Principais

### 🔐 Autenticação e Segurança
- Autenticação JWT
- Rate limiting por endpoint
- Criptografia de dados sensíveis
- Row Level Security (RLS) no Supabase

### 📁 Upload e Processamento
- Upload de arquivos CSV, Excel e JSON
- Validação automática de dados
- Processamento em background
- Preview dos dados antes da análise

### 🧠 Análise Inteligente
- **Análise Descritiva**: Estatísticas básicas, distribuições
- **Análise de Tendências**: Identificação de padrões temporais
- **Análise de Risco**: Scoring automático de riscos
- **Análise Geográfica**: Dados com coordenadas espaciais
- **Processamento de Linguagem Natural**: Consultas em linguagem natural

### 📊 Relatórios e Visualizações
- Templates pré-configurados
- Relatórios personalizáveis
- Gráficos interativos
- Exportação em Excel com formatação
- Histórico de relatórios

### 🔧 Sistema de Monitoramento
- Métricas de performance em tempo real
- Monitoramento de endpoints
- Atividade de usuários
- Histórico de métricas
- Alertas automáticos

## 📈 Tipos de Análises Disponíveis

### 1. Análise Descritiva
- Estatísticas básicas (média, mediana, desvio padrão)
- Distribuições de frequência
- Identificação de outliers
- Correlações entre variáveis

### 2. Análise de Tendências
- Identificação de padrões temporais
- Sazonalidade e ciclos
- Previsões simples
- Análise de crescimento

### 3. Análise de Risco
- Scoring automático de riscos
- Identificação de anomalias
- Alertas de segurança
- Classificação de dados sensíveis

### 4. Análise Geográfica
- Visualização em mapas
- Análise de clusters geográficos
- Heatmaps de distribuição
- Análise de proximidade

### 5. Processamento de Linguagem Natural
- Consultas em linguagem natural
- Análise de sentimentos
- Extração de entidades
- Classificação automática de texto

## 🔧 Sistema de Monitoramento

O sistema de monitoramento é um projeto separado que oferece:

### 📊 Visão Geral
- Status geral do sistema (HEALTHY/WARNING/CRITICAL)
- Métricas principais (saúde, performance, usuários, banco)
- Métricas de negócio
- Status das tabelas do banco

### 🔗 Endpoints
- Tabela detalhada de todos os endpoints
- Requisições, tempo médio, erros, último acesso
- Dados em tempo real dos endpoints mais utilizados

### 👥 Usuários
- Atividade detalhada dos usuários
- Última atividade, requisições, uploads, análises
- Duração das sessões

### 📈 Histórico
- Histórico de métricas ao longo do tempo
- Últimas 10 entradas de métricas
- Tendências e padrões de uso

## 🗄️ Banco de Dados

### Tabelas Principais
- `reports` - Relatórios gerados
- `templates` - Templates de relatórios
- `user_settings` - Configurações dos usuários
- `analyses` - Histórico de análises

### Configuração
```bash
# Executar no Supabase SQL Editor
\i database/setup_simple_tables.sql
```

## 🔒 Segurança

- **Autenticação**: JWT tokens com expiração
- **Rate Limiting**: Proteção contra spam
- **Criptografia**: Dados sensíveis criptografados
- **RLS**: Row Level Security no Supabase
- **Validação**: Validação rigorosa de entrada

## 📚 Documentação

- [Guia de Configuração Completa](docs/GUIA_CONFIGURACAO_COMPLETA.md)
- [Guia de Templates](docs/GUIA_TEMPLATES.md)
- [Guia de Personalização](docs/GUIA_PERSONALIZACAO_TEMPLATES.md)
- [Configuração do Supabase](docs/SUPABASE_SETUP.md)
- [Sistema de Monitoramento](monitoring-system/README.md)

## 🧪 Testes

```bash
# Testar endpoints
cd backend
python run_tests.py

# Testar monitoramento
cd backend
python -m pytest tests/test_monitoring.py -v
```

## 🚀 Deploy

### Backend
```bash
cd backend
pip install -r app/requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Principal
```bash
cd frontend
npm run build
npm start
```

### Sistema de Monitoramento
```bash
cd monitoring-system/monitoring-dashboard
npm run build
npm start
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `/docs`
2. Verifique os logs do sistema de monitoramento
3. Teste os endpoints via Swagger UI (`/docs`)

## 🔄 Atualizações

O projeto está em desenvolvimento ativo. Para atualizações:
1. Pull das mudanças
2. Atualizar dependências
3. Executar migrações do banco se necessário
4. Reiniciar serviços

---

**AutoReport SaaS** - Transformando dados em insights com inteligência artificial 🚀 