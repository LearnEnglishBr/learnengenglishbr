import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Cria registro de log usando trigger ou chamando rpc se necessário
      // Redireciona em caso de sucesso
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se falhar o auth, manda pro login com erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
