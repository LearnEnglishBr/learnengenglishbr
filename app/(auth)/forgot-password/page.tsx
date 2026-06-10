'use client'

import { forgotPasswordAction } from '@/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { t, locale, setLocale } = useLanguage()
  const [state, formAction] = useActionState(forgotPasswordAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30 relative">
      <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <Globe className="w-4 h-4" /> {t('PT')}
      </button>
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-2">{t('Recuperar Senha')}</h1>
        <p className="text-muted-foreground mb-6">{t('Enviaremos um link para redefinir sua senha.')}</p>

        {state?.error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4 text-sm">{state.error}</div>}
        {state?.success && <div className="p-3 bg-green-100 text-green-700 rounded-md mb-4 text-sm">{state.success}</div>}

        <form action={formAction} className="space-y-4">
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

          <button 
            type="submit" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {t('Enviar Link')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('Lembrou a senha?')} <Link href="/login" className="text-primary hover:underline font-medium">{t('Voltar ao Login')}</Link>
        </p>
      </div>
    </div>
  )
}
