'use client'

import { useActionState } from 'react'
import { completeOnboardingAction } from '@/actions/onboarding'

export default function OnboardingPage() {
  const [state, action, isPending] = useActionState(completeOnboardingAction, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-2xl bg-card p-8 rounded-xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-2">Complete seu Cadastro</h1>
        <p className="text-muted-foreground mb-6">Faltam poucos passos para você acessar a plataforma.</p>

        {state?.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
              <input 
                id="cpf" 
                name="cpf" 
                type="text" 
                required 
                placeholder="000.000.000-00"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
              <input 
                id="phone" 
                name="phone" 
                type="text" 
                required 
                placeholder="(00) 00000-0000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium border-b pb-2">Endereço</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="zip_code" className="text-sm font-medium">CEP</label>
              <input 
                id="zip_code" 
                name="zip_code" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="street" className="text-sm font-medium">Rua</label>
              <input 
                id="street" 
                name="street" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="number" className="text-sm font-medium">Número</label>
              <input 
                id="number" 
                name="number" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="complement" className="text-sm font-medium">Complemento</label>
              <input 
                id="complement" 
                name="complement" 
                type="text" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="neighborhood" className="text-sm font-medium">Bairro</label>
              <input 
                id="neighborhood" 
                name="neighborhood" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">Cidade</label>
              <input 
                id="city" 
                name="city" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">Estado</label>
              <input 
                id="state" 
                name="state" 
                type="text" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">País</label>
              <input 
                id="country" 
                name="country" 
                type="text" 
                defaultValue="Brasil"
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" name="terms" required className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-sm font-medium leading-none">
                Aceito os <a href="/termos" className="text-primary hover:underline">Termos de Uso</a> e a <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isPending ? 'Salvando...' : 'Completar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  )
}
