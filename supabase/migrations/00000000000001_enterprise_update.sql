-- 1. ADICIONAR EMAIL E CAMPOS FALTANTES NO PROFILE
ALTER TABLE public.profiles
ADD COLUMN email TEXT UNIQUE,
ADD COLUMN status TEXT DEFAULT 'ACTIVE'; -- ACTIVE, BLOCKED, PENDING_ONBOARDING

-- Trigger para manter o e-mail sincronizado do auth.users para profiles
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_update ON auth.users;
CREATE TRIGGER on_auth_user_email_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_email();

-- Atualizar e-mails existentes retroativamente (rodar apenas uma vez em prod como admin)
-- UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id;

-- 2. HISTÓRICO DE SESSÕES (Além do padrão do Supabase)
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE
);

-- 3. MEDIA LIBRARY (Gerenciamento Central de Arquivos)
CREATE TABLE public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- image/png, video/mp4, application/pdf
    file_size_bytes BIGINT,
    folder TEXT DEFAULT '/',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CONFIGURAÇÕES VISUAIS DA PLATAFORMA (Tema Customizável)
ALTER TABLE public.settings
ADD COLUMN theme_primary_color TEXT DEFAULT '#2563EB',
ADD COLUMN theme_secondary_color TEXT DEFAULT '#1E40AF',
ADD COLUMN theme_accent_color TEXT DEFAULT '#F59E0B',
ADD COLUMN logo_url TEXT,
ADD COLUMN favicon_url TEXT,
ADD COLUMN hero_title TEXT,
ADD COLUMN hero_subtitle TEXT,
ADD COLUMN hero_image_url TEXT,
ADD COLUMN footer_links JSONB DEFAULT '[]',
ADD COLUMN social_links JSONB DEFAULT '{}';

-- 5. RLS UPDATES
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin tem acesso total à biblioteca de midia" 
ON public.media_library FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Alunos veem apenas suas sessoes" 
ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins veem todas as sessoes" 
ON public.user_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
