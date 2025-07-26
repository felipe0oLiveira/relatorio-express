# Autenticação JWT com Supabase

## Visão Geral

O backend implementa autenticação JWT usando tokens do Supabase. Todos os endpoints sensíveis (upload, CRUD de relatórios) requerem autenticação.

## Como Funciona

1. **Frontend:** Usuário faz login no Supabase e recebe um JWT
2. **Frontend:** Envia o JWT no header `Authorization: Bearer <token>`
3. **Backend:** Valida o JWT usando as chaves públicas do Supabase
4. **Backend:** Extrai o `user_id` do token e permite acesso

## Endpoints Protegidos

Todos os endpoints abaixo requerem autenticação:

- `GET /reports` - Listar relatórios
- `GET /reports/{id}` - Buscar relatório específico
- `POST /reports` - Criar relatório
- `DELETE /reports/{id}` - Deletar relatório
- `POST /reports/upload` - Upload de arquivo
- `GET /auth/test` - Teste de autenticação

## Como Testar

### 1. Obter Token do Supabase

```javascript
// No frontend
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const token = data.session.access_token
```

### 2. Fazer Requisição Autenticada

```bash
curl -X GET "http://localhost:8000/auth/test" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Exemplo com JavaScript

```javascript
const response = await fetch('http://localhost:8000/auth/test', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const data = await response.json()
console.log(data) // { message: "Autenticação funcionando!", user_id: "...", authenticated: true }
```

## Estrutura dos Arquivos

- `app/auth/jwt_handler.py` - Validador de JWT
- `app/dependencies/auth.py` - Dependência FastAPI para autenticação
- `app/routes/auth.py` - Endpoints de autenticação
- `app/routes/reports.py` - Endpoints protegidos

## Próximos Passos

1. **RLS no Supabase:** Configurar Row Level Security para filtrar dados por usuário
2. **Rate Limiting:** Implementar limites de requisições
3. **Validação Aprimorada:** Melhorar validação de arquivos uploadados 