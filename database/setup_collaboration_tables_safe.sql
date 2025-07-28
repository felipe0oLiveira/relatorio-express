-- =====================================================
-- SCRIPT PARA CRIAR TABELAS DE COLABORAÇÃO (VERSÃO SEGURA)
-- Execute este script no SQL Editor do Supabase
-- SEM TRIGGERS - MAIS SEGURO
-- =====================================================

-- 1. TABELA PARA RELATÓRIOS COMPARTILHADOS
CREATE TABLE IF NOT EXISTS shared_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    permission_level INTEGER DEFAULT 1, -- 1=view, 2=comment, 3=edit, 4=admin
    message TEXT,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending', -- pending, accepted, declined
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA PARA COMENTÁRIOS EM RELATÓRIOS
CREATE TABLE IF NOT EXISTS report_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    parent_comment_id UUID REFERENCES report_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' -- active, deleted
);

-- 3. TABELA PARA EQUIPES
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' -- active, inactive, deleted
);

-- 4. TABELA PARA MEMBROS DE EQUIPES
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- admin, member, viewer
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' -- active, inactive
);

-- 5. TABELA PARA CONVITES DE EQUIPES
CREATE TABLE IF NOT EXISTS team_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    message TEXT,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' -- pending, accepted, declined, expired
);

-- 6. TABELA PARA RELATÓRIOS DE EQUIPES
CREATE TABLE IF NOT EXISTS team_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission TEXT DEFAULT 'view', -- view, comment, edit, admin
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA PARA CONVERSAS COM IA
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence FLOAT DEFAULT 0.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_shared_reports_report_id ON shared_reports(report_id);
CREATE INDEX IF NOT EXISTS idx_shared_reports_shared_with_email ON shared_reports(shared_with_email);
CREATE INDEX IF NOT EXISTS idx_report_comments_report_id ON report_comments(report_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team_id ON team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_invited_email ON team_invites(invited_email);
CREATE INDEX IF NOT EXISTS idx_team_reports_team_id ON team_reports(team_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilita RLS em todas as tabelas
ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Políticas para shared_reports
CREATE POLICY "Users can view shared reports" ON shared_reports
    FOR SELECT USING (
        auth.uid() = shared_by OR 
        shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can create shared reports" ON shared_reports
    FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update their own shares" ON shared_reports
    FOR UPDATE USING (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own shares" ON shared_reports
    FOR DELETE USING (auth.uid() = shared_by);

-- Políticas para report_comments
CREATE POLICY "Users can view comments on accessible reports" ON report_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reports r 
            WHERE r.id = report_comments.report_id 
            AND (r.user_id = auth.uid() OR 
                 EXISTS (
                     SELECT 1 FROM shared_reports sr 
                     WHERE sr.report_id = r.id 
                     AND sr.shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
                 ))
        )
    );

CREATE POLICY "Users can create comments" ON report_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON report_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON report_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para teams
CREATE POLICY "Users can view teams they belong to" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = teams.id 
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team admins can update teams" ON teams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = teams.id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin'
        )
    );

-- Políticas para team_members
CREATE POLICY "Team members can view team members" ON team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can manage team members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin'
        )
    );

-- Políticas para team_invites
CREATE POLICY "Users can view team invites" ON team_invites
    FOR SELECT USING (
        invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_invites.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin'
        )
    );

CREATE POLICY "Team admins can create invites" ON team_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_invites.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin'
        )
    );

-- Políticas para team_reports
CREATE POLICY "Team members can view team reports" ON team_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_reports.team_id 
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can share reports with teams" ON team_reports
    FOR INSERT WITH CHECK (
        auth.uid() = shared_by AND
        EXISTS (
            SELECT 1 FROM team_members tm 
            WHERE tm.team_id = team_reports.team_id 
            AND tm.user_id = auth.uid()
        )
    );

-- Políticas para ai_conversations
CREATE POLICY "Users can view their own conversations" ON ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE shared_reports IS 'Relatórios compartilhados entre usuários';
COMMENT ON TABLE report_comments IS 'Comentários em relatórios';
COMMENT ON TABLE teams IS 'Equipes para colaboração';
COMMENT ON TABLE team_members IS 'Membros das equipes';
COMMENT ON TABLE team_invites IS 'Convites para equipes';
COMMENT ON TABLE team_reports IS 'Relatórios compartilhados com equipes';
COMMENT ON TABLE ai_conversations IS 'Histórico de conversas com IA';

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================

SELECT 'Tabelas de colaboração criadas com sucesso (versão segura sem triggers)!' as status; 