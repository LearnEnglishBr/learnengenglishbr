'use client'

import { useActionState, useEffect } from 'react'
import { startAssessmentAction } from '@/actions/assessment'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function IniciarAvaliacaoPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(startAssessmentAction, undefined)

  useEffect(() => {
    if (state?.success && state?.attemptId) {
      sessionStorage.setItem('assessment_attempt_id', state.attemptId)
      router.push('/teste-de-ingles/avaliacao')
    }
  }, [state, router])

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/teste-de-ingles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-8">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-2">
              Comece Sua Avaliação
            </h1>
            <p className="text-muted-foreground mb-6">
              Preencha seus dados para iniciar o teste de nível.
            </p>

            {state?.error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all h-12 w-full flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Teste'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ⏱ 25 minutos • 40 questões • Resultado imediato
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
