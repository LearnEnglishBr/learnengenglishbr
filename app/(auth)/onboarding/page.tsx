'use client'

import { useActionState } from 'react'
import { completeOnboardingAction } from '@/actions/onboarding'
import { useLanguage } from '@/context/LanguageContext'
import { AlertCircle, ArrowRight, Globe, Sparkles } from 'lucide-react'

export default function OnboardingPage() {
  const { t, locale, setLocale } = useLanguage()
  const [state, action, isPending] = useActionState(completeOnboardingAction, undefined)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />
      </div>

      <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-10">
        <Globe className="w-4 h-4" /> {t('PT')}
      </button>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            {t('Complete seu Cadastro')}
          </h1>
          <p className="text-muted-foreground">{t('Faltam poucos passos para você acessar a plataforma.')}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          {state?.error && (
            <div className="flex items-center gap-2 bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="full_name" className="text-sm font-medium">{t('Nome Completo')}</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder={t('Seu nome completo')}
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cpf" className="text-sm font-medium">{t('CPF')}</label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">{t('Telefone')}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="birth_date" className="text-sm font-medium">{t('Data de Nascimento')}</label>
                  <input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    required
                    className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </div>
              </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b border-border pb-2">{t('Endereço')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="zip_code" className="text-sm font-medium">{t('CEP')}</label>
                <input
                  id="zip_code" name="zip_code" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="street" className="text-sm font-medium">{t('Rua')}</label>
                <input
                  id="street" name="street" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium">{t('Número')}</label>
                <input
                  id="number" name="number" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="complement" className="text-sm font-medium">{t('Complemento')}</label>
                <input
                  id="complement" name="complement" type="text"
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="neighborhood" className="text-sm font-medium">{t('Bairro')}</label>
                <input
                  id="neighborhood" name="neighborhood" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">{t('Cidade')}</label>
                <input
                  id="city" name="city" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">{t('Estado')}</label>
                <input
                  id="state" name="state" type="text" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">{t('País')}</label>
                <input
                  id="country" name="country" type="text" defaultValue="Brasil" required
                  className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" name="terms" required className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="terms" className="text-sm leading-relaxed text-muted-foreground">
                  {t('Aceito os')}{' '}
                  <a href="/termos" className="text-primary hover:underline font-medium">{t('Termos de Uso')}</a>{' '}
                  {t('e a')}{' '}
                  <a href="/privacidade" className="text-primary hover:underline font-medium">{t('Política de Privacidade')}</a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-8 py-3.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-base disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? t('Salvando...') : t('Completar Cadastro')}
              {!isPending && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
