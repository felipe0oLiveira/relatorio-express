-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO DE DADOS (VERSÃO CORRIGIDA)
-- AutoReport SaaS - Execute no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABELAS PRINCIPAIS
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
    is_public BOOLEAN DEFAULT FALSE,
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

-- =====================================================
-- 2. SISTEMA DE BACKUP
-- =====================================================

-- Tabela de agendamentos de backup
CREATE TABLE IF NOT EXISTS backup_schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    frequency VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    last_backup TIMESTAMP WITH TIME ZONE,
    next_backup TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de backups
CREATE TABLE IF NOT EXISTS backup_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    backup_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SISTEMA DE NOTIFICAÇÕES
-- =====================================================

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de webhooks
CREATE TABLE IF NOT EXISTS webhooks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    events TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SISTEMA DE LOGS E AUDITORIA
-- =====================================================

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para reports
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Índices para templates
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public) WHERE is_public = TRUE;

-- Índices para user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Índices para backup
CREATE INDEX IF NOT EXISTS idx_backup_schedules_user_id ON backup_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_schedules_active ON backup_schedules(active);
CREATE INDEX IF NOT EXISTS idx_backup_history_user_id ON backup_history(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_history_created_at ON backup_history(created_at);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Índices para webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(active);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. POLÍTICAS DE SEGURANÇA (VERSÃO CORRIGIDA)
-- =====================================================

-- Função para criar política apenas se não existir
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
    table_name text,
    policy_name text,
    policy_definition text
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = table_name 
        AND policyname = policy_name
    ) THEN
        EXECUTE policy_definition;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Políticas para reports
SELECT create_policy_if_not_exists(
    'reports',
    'Users can only access their own reports',
    'CREATE POLICY "Users can only access their own reports" ON reports FOR ALL USING (auth.uid() = user_id)'
);

-- Políticas para templates
SELECT create_policy_if_not_exists(
    'templates',
    'Users can access their own templates and public ones',
    'CREATE POLICY "Users can access their own templates and public ones" ON templates FOR ALL USING (auth.uid() = user_id OR is_public = TRUE)'
);

-- Políticas para user_settings
SELECT create_policy_if_not_exists(
    'user_settings',
    'Users can only access their own settings',
    'CREATE POLICY "Users can only access their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id)'
);

-- Políticas para backup_schedules
SELECT create_policy_if_not_exists(
    'backup_schedules',
    'Users can view their own backup schedules',
    'CREATE POLICY "Users can view their own backup schedules" ON backup_schedules FOR SELECT USING (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'backup_schedules',
    'Users can insert their own backup schedules',
    'CREATE POLICY "Users can insert their own backup schedules" ON backup_schedules FOR INSERT WITH CHECK (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'backup_schedules',
    'Users can update their own backup schedules',
    'CREATE POLICY "Users can update their own backup schedules" ON backup_schedules FOR UPDATE USING (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'backup_schedules',
    'Users can delete their own backup schedules',
    'CREATE POLICY "Users can delete their own backup schedules" ON backup_schedules FOR DELETE USING (auth.uid() = user_id)'
);

-- Políticas para backup_history
SELECT create_policy_if_not_exists(
    'backup_history',
    'Users can view their own backup history',
    'CREATE POLICY "Users can view their own backup history" ON backup_history FOR SELECT USING (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'backup_history',
    'Users can insert their own backup history',
    'CREATE POLICY "Users can insert their own backup history" ON backup_history FOR INSERT WITH CHECK (auth.uid() = user_id)'
);

-- Políticas para notifications
SELECT create_policy_if_not_exists(
    'notifications',
    'Users can view their own notifications',
    'CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'notifications',
    'Users can insert their own notifications',
    'CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'notifications',
    'Users can update their own notifications',
    'CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id)'
);

-- Políticas para webhooks
SELECT create_policy_if_not_exists(
    'webhooks',
    'Users can manage their own webhooks',
    'CREATE POLICY "Users can manage their own webhooks" ON webhooks FOR ALL USING (auth.uid() = user_id)'
);

-- Políticas para audit_logs
SELECT create_policy_if_not_exists(
    'audit_logs',
    'Users can view their own audit logs',
    'CREATE POLICY "Users can view their own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id)'
);
SELECT create_policy_if_not_exists(
    'audit_logs',
    'Users can insert their own audit logs',
    'CREATE POLICY "Users can insert their own audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id)'
);

-- =====================================================
-- 8. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at (apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reports_updated_at') THEN
        CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_templates_updated_at') THEN
        CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_settings_updated_at') THEN
        CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_backup_schedules_updated_at') THEN
        CREATE TRIGGER update_backup_schedules_updated_at BEFORE UPDATE ON backup_schedules
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- 9. COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE reports IS 'Tabela principal para armazenar relatórios dos usuários';
COMMENT ON TABLE templates IS 'Tabela para armazenar templates de relatórios';
COMMENT ON TABLE user_settings IS 'Tabela para configurações personalizadas dos usuários';
COMMENT ON TABLE backup_schedules IS 'Tabela para armazenar agendamentos de backup dos usuários';
COMMENT ON TABLE backup_history IS 'Tabela para armazenar histórico de backups dos usuários';
COMMENT ON TABLE notifications IS 'Tabela para armazenar notificações dos usuários';
COMMENT ON TABLE webhooks IS 'Tabela para armazenar webhooks configurados pelos usuários';
COMMENT ON TABLE audit_logs IS 'Tabela para armazenar logs de auditoria das ações dos usuários';

-- =====================================================
-- 10. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Configuração do banco de dados AutoReport SaaS concluída com sucesso!';
    RAISE NOTICE 'Tabelas criadas: reports, templates, user_settings, backup_schedules, backup_history, notifications, webhooks, audit_logs';
    RAISE NOTICE 'RLS ativado e políticas de segurança configuradas';
    RAISE NOTICE 'Índices criados para otimização de performance';
    RAISE NOTICE 'Script executado sem erros - todas as políticas foram verificadas';
END $$; 