-- ==========================================
-- MIGRATION: Complete Site Content Management
-- ==========================================

-- 1. SITE CONTENT (flexible key-value for all landing page sections)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,          -- e.g. 'hero', 'methodology', 'results', 'about_teacher', 'cta', 'social_proof'
    key TEXT NOT NULL,              -- e.g. 'title', 'subtitle', 'description', 'benefits', 'steps'
    value JSONB NOT NULL,           -- stores any value (string, array, object)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, key)
);

-- 2. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NAVIGATION LINKS (Header)
CREATE TABLE IF NOT EXISTS public.navigation_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL UNIQUE,  -- 'instagram', 'youtube', 'tiktok', 'twitter'
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SITE STATS (Results section)
CREATE TABLE IF NOT EXISTS public.site_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value_prefix TEXT DEFAULT '',
    value_suffix TEXT DEFAULT '',
    value_type TEXT DEFAULT 'number',  -- 'number' or 'decimal'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. METHODOLOGY STEPS
CREATE TABLE IF NOT EXISTS public.methodology_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'BookOpen',   -- lucide icon name
    icon_color TEXT DEFAULT 'text-primary',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. HERO BENEFITS
CREATE TABLE IF NOT EXISTS public.hero_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FOOTER COLUMNS
CREATE TABLE IF NOT EXISTS public.footer_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.footer_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID REFERENCES public.footer_columns(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. MEDIA FILES (for uploaded images)
ALTER TABLE public.media_library
ADD COLUMN IF NOT EXISTS alt_text TEXT,
ADD COLUMN IF NOT EXISTS width INTEGER,
ADD COLUMN IF NOT EXISTS height INTEGER;

-- 10. EXTEND SETTINGS with more branding fields
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS site_tagline TEXT,
ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT 'Learneng English BR. Todos os direitos reservados.',
ADD COLUMN IF NOT EXISTS footer_description TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS header_logo_text TEXT DEFAULT 'Learneng English BR';

-- 10b. ADD notification preference to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- 10c. RLS policies for profiles (if not already created)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==========================================
-- 11. RLS POLICIES
-- ==========================================

-- site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site_content" ON public.site_content;
CREATE POLICY "Anyone can read site_content"
ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage site_content" ON public.site_content;
CREATE POLICY "Admin can manage site_content"
ON public.site_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active testimonials" ON public.testimonials;
CREATE POLICY "Anyone can read active testimonials"
ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
CREATE POLICY "Admin can manage testimonials"
ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- navigation_links
ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read navigation_links" ON public.navigation_links;
CREATE POLICY "Anyone can read navigation_links"
ON public.navigation_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage navigation_links" ON public.navigation_links;
CREATE POLICY "Admin can manage navigation_links"
ON public.navigation_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read social_links" ON public.social_links;
CREATE POLICY "Anyone can read social_links"
ON public.social_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage social_links" ON public.social_links;
CREATE POLICY "Admin can manage social_links"
ON public.social_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- site_stats
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site_stats" ON public.site_stats;
CREATE POLICY "Anyone can read site_stats"
ON public.site_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage site_stats" ON public.site_stats;
CREATE POLICY "Admin can manage site_stats"
ON public.site_stats FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- methodology_steps
ALTER TABLE public.methodology_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read methodology_steps" ON public.methodology_steps;
CREATE POLICY "Anyone can read methodology_steps"
ON public.methodology_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage methodology_steps" ON public.methodology_steps;
CREATE POLICY "Admin can manage methodology_steps"
ON public.methodology_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- hero_benefits
ALTER TABLE public.hero_benefits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read hero_benefits" ON public.hero_benefits;
CREATE POLICY "Anyone can read hero_benefits"
ON public.hero_benefits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage hero_benefits" ON public.hero_benefits;
CREATE POLICY "Admin can manage hero_benefits"
ON public.hero_benefits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- footer_columns
ALTER TABLE public.footer_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read footer_columns" ON public.footer_columns;
CREATE POLICY "Anyone can read footer_columns"
ON public.footer_columns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage footer_columns" ON public.footer_columns;
CREATE POLICY "Admin can manage footer_columns"
ON public.footer_columns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

DROP POLICY IF EXISTS "Anyone can read footer_links" ON public.footer_links;
CREATE POLICY "Anyone can read footer_links"
ON public.footer_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage footer_links" ON public.footer_links;
CREATE POLICY "Admin can manage footer_links"
ON public.footer_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ==========================================
-- 12. TRIGGERS
-- ==========================================

DROP TRIGGER IF EXISTS handle_updated_at ON public.site_content;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

DROP TRIGGER IF EXISTS handle_updated_at ON public.testimonials;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

-- ==========================================
-- 13. SEED DEFAULT DATA
-- ==========================================

-- Hero Section
INSERT INTO public.site_content (section, key, value) VALUES
('hero', 'badge', '"Mais de 2.500 alunos transformados"'),
('hero', 'title', '"Domine o Inglês. Transforme seu Futuro."'),
('hero', 'subtitle', '"Método exclusivo para acelerar sua fluência com aulas práticas, suporte personalizado e certificação internacional reconhecida pelas maiores empresas do mercado."'),
('hero', 'cta_primary_text', '"Começar Agora"'),
('hero', 'cta_primary_href', '"#cursos"'),
('hero', 'cta_secondary_text', '"Ver Método"'),
('hero', 'cta_secondary_href', '"#metodologia"'),
('hero', 'social_proof_text', '"+2.500 alunos satisfeitos"'),
('hero', 'main_image', '"/images/principal.jpg"')
ON CONFLICT (section, key) DO NOTHING;

-- Methodology Section
INSERT INTO public.site_content (section, key, value) VALUES
('methodology', 'title', '"Metodologia Moderna e Estratégica"'),
('methodology', 'paragraph_1', '"Uma metodologia baseada na linguística aplicada crítica para quem busca fluência real e alto desempenho em inglês."'),
('methodology', 'paragraph_2', '"Desenvolvido a partir de raízes do pós-método, o método do Learn English BR adapta o ensino às suas necessidades, integrando prática de fala, compreensão do inglês real, uso de mídias e explicações claras de gramática."'),
('methodology', 'paragraph_3', '"Mais do que aprender, você desenvolve confiança para usar o idioma com naturalidade."')
ON CONFLICT (section, key) DO NOTHING;

-- Methodology Steps
INSERT INTO public.site_content (section, key, value) VALUES
('methodology', 'section_subtitle', '"Programas intensivos com padrão internacional, desenhados para máxima retenção e aplicação prática no mundo real."')
ON CONFLICT (section, key) DO NOTHING;

-- Courses Section
INSERT INTO public.site_content (section, key, value) VALUES
('courses', 'title', '"Formações Completas"'),
('courses', 'subtitle', '"Programas intensivos com padrão internacional, desenhados para máxima retenção e aplicação prática no mundo real."'),
('courses', 'badge_text', '"Premium"'),
('courses', 'feature_1', '"Vitalício"'),
('courses', 'feature_2', '"Certificado"'),
('courses', 'feature_3', '"Suporte VIP"'),
('courses', 'button_text', '"Matricular"')
ON CONFLICT (section, key) DO NOTHING;

-- Testimonials Section
INSERT INTO public.site_content (section, key, value) VALUES
('testimonials', 'title', '"O Que Nossos Alunos Dizem"'),
('testimonials', 'subtitle', '"Histórias reais de profissionais que impulsionaram suas carreiras com o nosso método exclusivo."')
ON CONFLICT (section, key) DO NOTHING;

-- About Teacher Section
INSERT INTO public.site_content (section, key, value) VALUES
('about_teacher', 'title', '"Conheça o Professor"'),
('about_teacher', 'name', '"Vitor Brandino"'),
('about_teacher', 'bio_paragraph_1', '"Vitor Brandino é graduado em Letras – Inglês pela Universidade Estadual do Paraná (UNESPAR) e possui pós-graduação em Linguística e Linguística Aplicada ao Ensino de Línguas. Com sólida formação acadêmica e ampla experiência na área educacional, atua como professor da rede pública de ensino do Estado do Paraná e também como tutor na área de língua japonesa."'),
('about_teacher', 'bio_paragraph_2', '"Ao longo de sua trajetória profissional, desenvolveu pesquisas e produziu trabalhos voltados ao ensino de língua inglesa, com foco na utilização de mídias educacionais, abordagens decoloniais, processos de ensino e aprendizagem de idiomas e formação de professores de língua inglesa."'),
('about_teacher', 'bio_paragraph_3', '"Além de sua atuação como educador, possui extensa experiência em tradução, tendo trabalhado por quase uma década em diferentes projetos e contextos linguísticos. Sua combinação de conhecimento acadêmico, prática docente e vivência internacional proporciona uma metodologia de ensino moderna, eficiente e alinhada às necessidades reais dos estudantes que buscam alcançar fluência e confiança na comunicação em inglês."'),
('about_teacher', 'info_box_1_title', '"Formação Acadêmica"'),
('about_teacher', 'info_box_1_text', '"Letras – Inglês (UNESPAR) · Pós em Linguística Aplicada ao Ensino de Línguas"'),
('about_teacher', 'info_box_2_title', '"Tradutor Profissional"'),
('about_teacher', 'info_box_2_text', '"Quase uma década de experiência em tradução em diversos projetos e contextos linguísticos."'),
('about_teacher', 'info_box_3_title', '"Pesquisador em Ensino de Línguas"'),
('about_teacher', 'info_box_3_text', '"Pesquisas em mídias educacionais, abordagens decoloniais e formação de professores de inglês."')
ON CONFLICT (section, key) DO NOTHING;

-- Blog Preview Section
INSERT INTO public.site_content (section, key, value) VALUES
('blog_preview', 'title', '"Últimos Artigos"'),
('blog_preview', 'subtitle', '"Conteúdo exclusivo para acelerar sua jornada."'),
('blog_preview', 'view_all_text', '"Ver todo o Blog"'),
('blog_preview', 'view_all_href', '"/blog"')
ON CONFLICT (section, key) DO NOTHING;

-- CTA Section
INSERT INTO public.site_content (section, key, value) VALUES
('cta', 'title', '"Comece sua jornada rumo à fluência hoje."'),
('cta', 'subtitle', '"Junte-se a milhares de profissionais que já transformaram suas carreiras e alcançaram oportunidades globais com o nosso método exclusivo."'),
('cta', 'button_text', '"Quero Me Tornar Fluente"'),
('cta', 'button_href', '"#cursos"')
ON CONFLICT (section, key) DO NOTHING;

-- Social Proof Section
INSERT INTO public.site_content (section, key, value) VALUES
('social_proof', 'paragraph_1', '"Uma metodologia moderna e estratégica baseada na linguística aplicada crítica para quem busca fluência real e alto desempenho em inglês."'),
('social_proof', 'paragraph_2', '"O pós-método reconhece que não existe uma abordagem única para todos. Por isso, nosso sistema adapta o ensino às suas necessidades, integrando prática de fala, compreensão do inglês real e explicações claras."')
ON CONFLICT (section, key) DO NOTHING;

-- Results Section
INSERT INTO public.site_content (section, key, value) VALUES
('results', 'section_label', '"Nossos Números"')
ON CONFLICT (section, key) DO NOTHING;

-- Site Stats
INSERT INTO public.site_stats (label, value_prefix, value_suffix, value_type, sort_order) VALUES
('Alunos Formados', '+', '', 'number', 1),
('Taxa de Satisfação', '', '%', 'number', 2),
('Países Atendidos', '', '', 'number', 3),
('Avaliação Média', '', '/5', 'decimal', 4)
ON CONFLICT DO NOTHING;

-- Methodology Steps
INSERT INTO public.methodology_steps (step_number, title, description, icon_name, icon_color, sort_order) VALUES
('01', 'Aprenda', 'Aulas teóricas de alta qualidade direto ao ponto, com foco na vida real.', 'BookOpen', 'text-primary', 1),
('02', 'Pratique', 'Exercícios focados e gamificados para retenção extrema e memória de longo prazo.', 'Target', 'text-blue-500', 2),
('03', 'Converse', 'Sessões de conversação nativa ao vivo para destravar o seu speaking.', 'MessagesSquare', 'text-emerald-500', 3),
('04', 'Fluência', 'Atingimento e certificação de capacidade técnica com reconhecimento internacional.', 'Award', 'text-amber-500', 4)
ON CONFLICT DO NOTHING;

-- Hero Benefits
INSERT INTO public.hero_benefits (text, sort_order) VALUES
('Aulas ao vivo', 1),
('Suporte individual', 2),
('Certificação reconhecida', 3),
('Acesso vitalício', 4)
ON CONFLICT DO NOTHING;

-- Navigation Links
INSERT INTO public.navigation_links (label, href, sort_order) VALUES
('Início', '#inicio', 1),
('Cursos', '#cursos', 2),
('Metodologia', '#metodologia', 3),
('Resultados', '#resultados', 4),
('Depoimentos', '#depoimentos', 5),
('Blog', '#blog', 6)
ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO public.social_links (platform, url) VALUES
('instagram', 'https://www.instagram.com/prof_vitor1'),
('youtube', 'https://youtube.com/@teachervitor-learnenglishbr'),
('tiktok', 'https://www.tiktok.com/@learnenglishbr')
ON CONFLICT (platform) DO NOTHING;

-- Footer Columns and Links
INSERT INTO public.footer_columns (title, sort_order) VALUES
('Plataforma', 1),
('Suporte', 2),
('Legal', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.footer_links (column_id, label, href, sort_order)
SELECT id, 'Cursos', '#cursos', 1 FROM public.footer_columns WHERE title = 'Plataforma'
UNION ALL
SELECT id, 'Metodologia', '#metodologia', 2 FROM public.footer_columns WHERE title = 'Plataforma'
UNION ALL
SELECT id, 'Resultados', '#resultados', 3 FROM public.footer_columns WHERE title = 'Plataforma'
UNION ALL
SELECT id, 'Depoimentos', '#depoimentos', 4 FROM public.footer_columns WHERE title = 'Plataforma'
UNION ALL
SELECT id, 'Central de Ajuda', '/ajuda', 1 FROM public.footer_columns WHERE title = 'Suporte'
UNION ALL
SELECT id, 'Fale Conosco', '/ajuda', 2 FROM public.footer_columns WHERE title = 'Suporte'
UNION ALL
SELECT id, 'Blog', '/blog', 3 FROM public.footer_columns WHERE title = 'Suporte'
UNION ALL
SELECT id, 'Termos de Uso', '/termos', 1 FROM public.footer_columns WHERE title = 'Legal'
UNION ALL
SELECT id, 'Política de Privacidade', '/privacidade', 2 FROM public.footer_columns WHERE title = 'Legal'
UNION ALL
SELECT id, 'Política de Cookies', '/cookies', 3 FROM public.footer_columns WHERE title = 'Legal'
UNION ALL
SELECT id, 'Conformidade LGPD', '/lgpd', 4 FROM public.footer_columns WHERE title = 'Legal'
UNION ALL
SELECT id, 'Reembolso e Cancelamento', '/reembolso', 5 FROM public.footer_columns WHERE title = 'Legal'
ON CONFLICT DO NOTHING;

-- ==========================================
-- 14. DIGITAL PRODUCTS (PDFs, eBooks, etc)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.digital_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'application/pdf',
    file_size_bytes BIGINT,
    cover_image TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    show_on_homepage BOOLEAN DEFAULT false,
    stripe_price_id TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase items (for digital products)
CREATE TABLE IF NOT EXISTS public.purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.digital_products(id) ON DELETE SET NULL,
    product_type TEXT NOT NULL DEFAULT 'course',  -- 'course' or 'digital_product'
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active digital products" ON public.digital_products;
CREATE POLICY "Anyone can read active digital products"
ON public.digital_products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage digital products" ON public.digital_products;
CREATE POLICY "Admin can manage digital products"
ON public.digital_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

DROP POLICY IF EXISTS "Users can read own purchase items" ON public.purchase_items;
CREATE POLICY "Users can read own purchase items"
ON public.purchase_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.purchases WHERE id = purchase_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admin can manage purchase items" ON public.purchase_items;
CREATE POLICY "Admin can manage purchase items"
ON public.purchase_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
