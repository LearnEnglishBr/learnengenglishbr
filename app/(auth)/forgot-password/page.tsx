import { forgotPasswordAction } from '@/actions/auth'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-2">Recuperar Senha</h1>
        <p className="text-muted-foreground mb-6">Enviaremos um link para redefinir sua senha.</p>

        <form action={forgotPasswordAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
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
            Enviar Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Lembrou a senha? <Link href="/login" className="text-primary hover:underline font-medium">Voltar ao Login</Link>
        </p>
      </div>
    </div>
  )
}
