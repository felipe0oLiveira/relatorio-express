# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login/cadastro
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "autoreport-saas")
6. Escolha uma senha para o banco de dados
7. Escolha a região mais próxima
8. Clique em "Create new project"

## 2. Obter as Chaves

Após criar o projeto:

1. Vá para **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key
   - **service_role** key (mantenha segura!)

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
```

## 4. Criar Tabelas no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Tabela de relatórios
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. Ativar Row Level Security (RLS)

```sql
-- Ativar RLS nas tabelas
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Política para reports (usuário só vê seus próprios relatórios)
CREATE POLICY "Users can only access their own reports" ON reports
    FOR ALL USING (auth.uid() = user_id);

-- Política para templates (usuário só vê seus próprios templates)
CREATE POLICY "Users can only access their own templates" ON templates
    FOR ALL USING (auth.uid() = user_id);
``` 