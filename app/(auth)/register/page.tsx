'use client'

import { registerAction, googleOAuthAction } from '@/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export default function RegisterPage() {
  const { t, locale, setLocale } = useLanguage()
  const [state, action, isPending] = useActionState(registerAction, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30 relative">
      <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <Globe className="w-4 h-4" /> {t('PT')}
      </button>
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-2">{t('Criar Conta')}</h1>
        <p className="text-muted-foreground mb-6">{t('Junte-se à English School Premium.')}</p>

        {state?.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-6">
            {state.success}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">{t('Nome Completo')}</label>
            <input 
              id="fullName" 
              name="fullName" 
              type="text" 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium">{t('Senha')}</label>
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
            {isPending ? t('Cadastrando...') : t('Cadastrar')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t('Ou cadastre-se com')}</span>
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
          {t('Já tem uma conta?')} <Link href="/login" className="text-primary hover:underline font-medium">{t('Faça login')}</Link>
        </p>
      </div>
    </div>
  )
}
