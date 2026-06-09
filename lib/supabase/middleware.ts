import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evitar calls desnecessárias. Auth validation real.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/aluno') || pathname.startsWith('/onboarding')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Validação explícita para rotas protegidas (Admin ou Dashboard)
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (user && (isAdminRoute || isDashboardRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, cpf')
      .eq('id', user.id)
      .single()

    // Se o usuário não tem CPF, significa que não completou o onboarding
    if (!profile?.cpf && pathname !== '/onboarding') {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Se já tem CPF e tenta acessar onboarding, manda pro dashboard
    if (profile?.cpf && pathname === '/onboarding') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Validação de Admin (ignorada se tiver cookie de admin fixo)
    const hasAdminBypass = request.cookies.get('admin_bypass')?.value === 'true'
    if (isAdminRoute && !hasAdminBypass && (!profile || profile.role !== 'ADMIN')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Se não tem usuário, mas tenta acessar Admin, verifica se tem o cookie admin_bypass
  if (!user && isAdminRoute) {
    const hasAdminBypass = request.cookies.get('admin_bypass')?.value === 'true'
    if (hasAdminBypass) {
      // Ignora o redirect para login
    } else if (pathname !== '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  } else if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Headers de Segurança
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return supabaseResponse
}
