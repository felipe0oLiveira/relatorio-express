# 🔧 Sistema de Monitoramento - AutoReport SaaS

Sistema de monitoramento independente para controle e acompanhamento do sistema AutoReport SaaS.

## 📋 Descrição

Este é um projeto separado dedicado ao monitoramento do sistema principal. Ele fornece um dashboard completo com métricas em tempo real para desenvolvedores e administradores.

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd monitoring-dashboard
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

### 3. Acessar
- **URL**: http://localhost:3000
- **Interface**: Dashboard de monitoramento completo

## 📊 Funcionalidades

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

## 🔧 Configuração

### Backend Necessário
O sistema de monitoramento se conecta ao backend principal na porta 8000:

```bash
# No projeto principal
cd backend
uvicorn app.main:app --reload
```

### Endpoints Utilizados
- `GET /monitoring/dashboard` - Visão geral
- `GET /monitoring/endpoints` - Métricas de endpoints
- `GET /monitoring/users` - Atividade de usuários
- `GET /monitoring/history` - Histórico de métricas

## 🎨 Interface

- **Design**: Dark theme profissional
- **Responsivo**: Funciona em qualquer dispositivo
- **Auto-refresh**: Atualização automática a cada 30 segundos
- **Navegação**: Abas para diferentes tipos de dados

## 📁 Estrutura do Projeto

```
monitoring-system/
├── monitoring-dashboard/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx          # Dashboard principal
│   │       ├── layout.tsx        # Layout da aplicação
│   │       └── globals.css       # Estilos globais
│   ├── package.json
│   └── README.md
└── README.md                     # Este arquivo
```

## 🔒 Segurança

- **Acesso**: Apenas para desenvolvedores e administradores
- **Dados**: Métricas do sistema em tempo real
- **Isolamento**: Projeto separado do sistema principal

## 🚀 Deploy

Para fazer deploy do sistema de monitoramento:

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

## 📞 Suporte

Este sistema é dedicado ao monitoramento interno do AutoReport SaaS. Para dúvidas ou problemas, consulte a documentação do projeto principal. 