'use client'

import { loginAction, googleOAuthAction } from '@/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LoginPage() {
  const { t, locale, setLocale } = useLanguage()
  const [state, action, isPending] = useActionState(loginAction, undefined)

  const authErrorKey = (msg: string | undefined): string => {
    const map: Record<string, string> = {
      'Invalid login credentials': 'Credenciais de login inválidas',
      'Email not confirmed': 'E-mail não confirmado',
    }
    return map[msg || ''] || msg || ''
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30 relative">
      <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <Globe className="w-4 h-4" /> {t('PT')}
      </button>
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-2">{t('Entrar na Plataforma')}</h1>
        <p className="text-muted-foreground mb-6">{t('Acesse seus cursos e materiais.')}</p>

        {state?.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
            {t(authErrorKey(state.error))}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t('E-mail')}</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">{t('Senha')}</label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                {t('Esqueceu a senha?')}
              </Link>
            </div>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isPending ? t('Entrando...') : t('Entrar')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t('Ou continue com')}</span>
          </div>
        </div>

        <form action={googleOAuthAction}>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
          >
            Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('Ainda não tem conta?')} <Link href="/register" className="text-primary hover:underline font-medium">{t('Cadastre-se')}</Link>
        </p>
      </div>
    </div>
  )
}
