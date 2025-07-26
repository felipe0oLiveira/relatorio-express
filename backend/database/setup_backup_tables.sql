-- Script SQL para criar tabelas do sistema de backup do AutoReport SaaS
-- Execute este script no Supabase SQL Editor

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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_backup_schedules_user_id ON backup_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_schedules_active ON backup_schedules(active);

CREATE INDEX IF NOT EXISTS idx_backup_history_user_id ON backup_history(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_history_created_at ON backup_history(created_at);

-- Políticas RLS (Row Level Security)
ALTER TABLE backup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;

-- Políticas para backup_schedules
CREATE POLICY "Users can view their own backup schedules" ON backup_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backup schedules" ON backup_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backup schedules" ON backup_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backup schedules" ON backup_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para backup_history
CREATE POLICY "Users can view their own backup history" ON backup_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backup history" ON backup_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_backup_schedules_updated_at BEFORE UPDATE ON backup_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários das tabelas
COMMENT ON TABLE backup_schedules IS 'Tabela para armazenar agendamentos de backup dos usuários';
COMMENT ON TABLE backup_history IS 'Tabela para armazenar histórico de backups dos usuários'; 