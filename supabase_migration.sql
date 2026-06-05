-- Script de Migração Supabase para Gestão de OS

-- 1. Criar tabela de Ordem de Serviço
CREATE TABLE IF NOT EXISTS public.ordem_servico (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_os TEXT NOT NULL, -- Removido UNIQUE para permitir nomes duplicados
    cliente TEXT, -- Removido NOT NULL para ser mais flexível
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'aberta'::text CHECK (status IN ('aberta', 'fechada', 'cancelada')),
    user_id UUID
);

-- 2. Criar tabela de Itens da OS
CREATE TABLE IF NOT EXISTS public.item_os (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    os_id UUID REFERENCES public.ordem_servico(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT, -- Removido NOT NULL
    largura_mm NUMERIC DEFAULT 0,
    comprimento_mm NUMERIC DEFAULT 0,
    repeticoes INTEGER DEFAULT 1 NOT NULL,
    quantidade INTEGER DEFAULT 0 NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.ordem_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_os ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas simples
CREATE POLICY "Permitir acesso total para todos" ON public.ordem_servico FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total para todos" ON public.item_os FOR ALL USING (true) WITH CHECK (true);
