-- Configuração do banco de dados para AutoReport SaaS
-- Execute este SQL no SQL Editor do Supabase

-- 1. Criar tabela de relatórios
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(50),
    data_preview JSONB,
    columns_info JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de relatórios
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de configurações de usuário
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 4. Ativar Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas de segurança

-- Política para reports: usuário só acessa seus próprios relatórios
CREATE POLICY "Users can only access their own reports" ON reports
    FOR ALL USING (auth.uid() = user_id);

-- Política para templates: usuário acessa seus próprios + templates públicos
CREATE POLICY "Users can access their own templates and public ones" ON templates
    FOR ALL USING (auth.uid() = user_id OR is_public = TRUE);

-- Política para user_settings: usuário só acessa suas próprias configurações
CREATE POLICY "Users can only access their own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- 6. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public) WHERE is_public = TRUE;

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Habilitar RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Política: cada usuário só vê seus próprios templates
CREATE POLICY "Templates: Usuário só vê seus próprios templates" ON templates
    FOR ALL
    USING (user_id = auth.uid());

-- Política: cada usuário só vê e edita suas próprias configurações
CREATE POLICY "UserSettings: Usuário só vê/edita suas próprias configs" ON user_settings
    FOR ALL
    USING (user_id = auth.uid());

-- 7. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Triggers para atualizar updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Comentários para documentação
COMMENT ON TABLE reports IS 'Tabela para armazenar relatórios dos usuários';
COMMENT ON TABLE templates IS 'Tabela para armazenar templates de relatórios';
COMMENT ON TABLE user_settings IS 'Tabela para configurações personalizadas dos usuários'; 