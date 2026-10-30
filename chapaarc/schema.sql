-- ========================================================
-- Script Oficial Supabase (PostgreSQL) - Chapa ARC 07
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/mwjrivlmeixfysfycedj/sql/new
-- ========================================================

-- 1. CRIAÇÃO DAS TABELAS

-- Tabela: feedbacks (Voz do Aluno & Sugestões)
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo TEXT,
    turma TEXT,
    mensagem TEXT,
    status TEXT NOT NULL DEFAULT 'pendente'
);

-- Tabela: alertas_infra (Radar de Infraestrutura & Papel Higiênico)
CREATE TABLE IF NOT EXISTS public.alertas_infra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo TEXT DEFAULT 'papel_higienico',
    localizacao TEXT,
    status TEXT NOT NULL DEFAULT 'aberto'
);

-- Tabela: votos_comercio (Vendinha & Materiais Esportivos)
CREATE TABLE IF NOT EXISTS public.votos_comercio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    item_id TEXT,
    turma TEXT
);

-- Tabela: votos_geral (Ranking das Salas 1A-3C e Enquetes de Eventos)
CREATE TABLE IF NOT EXISTS public.votos_geral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo TEXT NOT NULL,
    item_id TEXT NOT NULL,
    turma TEXT
);

-- Tabela: equipe_membros (Fotos e dados oficiais dos 13 integrantes)
CREATE TABLE IF NOT EXISTS public.equipe_membros (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    turma TEXT,
    quote TEXT,
    photo TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: configuracoes_site (Cartaz oficial, Instagram, WhatsApp, Slogan)
CREATE TABLE IF NOT EXISTS public.configuracoes_site (
    chave TEXT PRIMARY KEY,
    valor TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: comunicados (Posts e avisos oficiais da presidência)
CREATE TABLE IF NOT EXISTS public.comunicados (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    imagem TEXT,
    data TEXT
);

-- ========================================================
-- 2. HABILITAÇÃO DE ROW LEVEL SECURITY (RLS)
-- ========================================================

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_infra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos_comercio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos_geral ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipe_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 3. POLÍTICAS DE ACESSO (Leitura e Escrita Sincronizada)
-- ========================================================

-- Remoção preventiva de políticas existentes para evitar duplicidade ao reexecutar
DROP POLICY IF EXISTS "Acesso publico feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Acesso publico alertas_infra" ON public.alertas_infra;
DROP POLICY IF EXISTS "Acesso publico votos_comercio" ON public.votos_comercio;
DROP POLICY IF EXISTS "Acesso publico votos_geral" ON public.votos_geral;
DROP POLICY IF EXISTS "Acesso publico equipe_membros" ON public.equipe_membros;
DROP POLICY IF EXISTS "Acesso publico configuracoes_site" ON public.configuracoes_site;
DROP POLICY IF EXISTS "Acesso publico comunicados" ON public.comunicados;

-- Políticas universais de leitura e gravação
CREATE POLICY "Acesso publico feedbacks" ON public.feedbacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico alertas_infra" ON public.alertas_infra FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico votos_comercio" ON public.votos_comercio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico votos_geral" ON public.votos_geral FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico equipe_membros" ON public.equipe_membros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico configuracoes_site" ON public.configuracoes_site FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso publico comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);
