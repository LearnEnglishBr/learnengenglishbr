'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

function getBaseUrl(host?: string, proto?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  const protocol = proto || (host?.includes('localhost') ? 'http' : 'https')
  return `${protocol}://${host || 'localhost:3000'}`
}

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const h = await headers()
  const baseUrl = getBaseUrl(h.get('host') ?? undefined, h.get('x-forwarded-proto') ?? undefined)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Se o Supabase já retornar a sessão, significa que a confirmação de e-mail está desativada.
  if (data.session) {
    redirect('/dashboard')
  }

  // Auto-confirma o usuário usando a service role key (admin bypass)
  if (data.user) {
    const adminSupabase = await createAdminClient()
    const { error: confirmError } = await adminSupabase.auth.admin.updateUserById(
      data.user.id,
      { email_confirm: true }
    )

    if (!confirmError) {
      // Faz login automático após confirmar
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!signInError) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
      }
    }
  }

  return { success: 'Verifique seu e-mail para confirmar o cadastro.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function googleOAuthAction() {
  const supabase = await createClient()

  const h = await headers()
  const baseUrl = getBaseUrl(h.get('host') ?? undefined, h.get('x-forwarded-proto') ?? undefined)
  const redirectUrl = `${baseUrl}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    console.error('[Google OAuth]', { redirectUrl, error: error.message })
    throw new Error(error.message)
  }

  redirect(data.url)
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { error: 'E-mail inválido' }
  }

  const supabase = await createClient()

  const h = await headers()
  const baseUrl = getBaseUrl(h.get('host') ?? undefined, h.get('x-forwarded-proto') ?? undefined)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Link de recuperação enviado para o seu e-mail.' }
}
