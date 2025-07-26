-- =====================================================
-- SCRIPT SIMPLIFICADO - APENAS TABELAS ESSENCIAIS
-- AutoReport SaaS - Execute no Supabase SQL Editor
-- =====================================================

-- Tabela de relatórios
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
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de relatórios
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de configurações de usuário
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de análises (para métricas de negócio)
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    analysis_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices básicos
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);

-- Inserir dados de teste (opcional)
INSERT INTO reports (title, description, user_id) VALUES 
('Relatório Teste', 'Relatório de teste para monitoramento', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, description, content) VALUES 
('00000000-0000-0000-0000-000000000000', 'Template Teste', 'Template de teste', '{"type": "test"}')
ON CONFLICT DO NOTHING;

-- Verificar se as tabelas foram criadas
SELECT 'reports' as table_name, COUNT(*) as count FROM reports
UNION ALL
SELECT 'templates' as table_name, COUNT(*) as count FROM templates
UNION ALL
SELECT 'user_settings' as table_name, COUNT(*) as count FROM user_settings
UNION ALL
SELECT 'analyses' as table_name, COUNT(*) as count FROM analyses; 