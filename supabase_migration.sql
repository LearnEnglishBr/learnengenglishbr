-- Migração para o novo módulo de Blog AI-Powered

-- Adicionando campos de SEO e Capa
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS readability_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Comentários para documentação no Supabase
COMMENT ON COLUMN public.blog_posts.meta_title IS 'Título otimizado para o Google (Meta Tag)';
COMMENT ON COLUMN public.blog_posts.meta_description IS 'Descrição para o Google (Meta Tag)';
COMMENT ON COLUMN public.blog_posts.focus_keyword IS 'Palavra-chave principal (Target Keyword)';
COMMENT ON COLUMN public.blog_posts.seo_score IS 'Pontuação calculada pela IA ou pelo Sidebar (0 a 100)';
COMMENT ON COLUMN public.blog_posts.tags IS 'Tags do artigo';
COMMENT ON COLUMN public.blog_posts.categories IS 'Categorias do artigo';

-- Grants para o role anon (público)
GRANT SELECT ON blog_posts TO anon;
