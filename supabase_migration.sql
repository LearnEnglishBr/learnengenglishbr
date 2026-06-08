-- Migração para o novo módulo de Blog AI-Powered

-- Adicionando campos de SEO e Capa
ALTER TABLE public.blog_posts 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN focus_keyword TEXT,
ADD COLUMN seo_score INTEGER DEFAULT 0,
ADD COLUMN readability_score INTEGER DEFAULT 0,
ADD COLUMN cover_image_url TEXT,
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN categories TEXT[] DEFAULT '{}';

-- Comentários para documentação no Supabase
COMMENT ON COLUMN public.blog_posts.meta_title IS 'Título otimizado para o Google (Meta Tag)';
COMMENT ON COLUMN public.blog_posts.meta_description IS 'Descrição para o Google (Meta Tag)';
COMMENT ON COLUMN public.blog_posts.focus_keyword IS 'Palavra-chave principal (Target Keyword)';
COMMENT ON COLUMN public.blog_posts.seo_score IS 'Pontuação calculada pela IA ou pelo Sidebar (0 a 100)';
COMMENT ON COLUMN public.blog_posts.tags IS 'Tags do artigo';
COMMENT ON COLUMN public.blog_posts.categories IS 'Categorias do artigo';
