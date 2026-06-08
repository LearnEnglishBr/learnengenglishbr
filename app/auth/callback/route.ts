import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && sessionData?.user) {
      // Verifica a role do usuário no banco
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionData.user.id)
        .single()

      // Se não houver parâmetro `next` customizado, decide a rota pelo perfil
      let finalRedirect = next
      if (next === '/dashboard' && profile?.role === 'ADMIN') {
        finalRedirect = '/admin'
      }

      return NextResponse.redirect(`${origin}${finalRedirect}`)
    }
  }

  // Se falhar o auth, manda pro login com erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
