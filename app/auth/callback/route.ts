import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && sessionData?.user) {
      const userId = sessionData.user.id

      // Garante que o profile existe (upsert com dados do Google)
      await adminClient().from('profiles').upsert({
        id: userId,
        email: sessionData.user.email,
        full_name: sessionData.user.user_metadata?.full_name || null,
        avatar_url: sessionData.user.user_metadata?.avatar_url || null,
      }, { onConflict: 'id' })

      // Verifica se o perfil está completo (precisa de full_name + phone)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, role')
        .eq('id', userId)
        .single()

      // Se não tiver nome ou telefone, manda pro onboarding
      if (!profile?.full_name || !profile?.phone) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Redireciona conforme a role
      let finalRedirect = next
      if (next === '/dashboard' && profile?.role === 'ADMIN') {
        finalRedirect = '/admin'
      }

      return NextResponse.redirect(`${origin}${finalRedirect}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
