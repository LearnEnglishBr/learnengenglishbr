import { createClient } from '@/lib/supabase/server'
import { updatePasswordAction, updateSettingsAction } from '@/actions/profile'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências da plataforma.</p>
      </div>

      {/* Preferências */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Preferências</h2>
        <p className="text-sm text-muted-foreground mb-6">Idioma, fuso horário e notificações.</p>
        <form action={updateSettingsAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="preferred_language" className="text-sm font-medium">Idioma</label>
            <select id="preferred_language" name="preferred_language" defaultValue={profile?.preferred_language || 'pt-BR'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-medium">Fuso Horário</label>
            <select id="timezone" name="timezone" defaultValue={profile?.timezone || 'America/Sao_Paulo'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="America/Sao_Paulo">Brasil (GMT-3)</option>
              <option value="America/Manaus">Brasil (GMT-4)</option>
              <option value="America/Noronha">Brasil (GMT-2)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
              <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input id="email_notifications" name="email_notifications" type="checkbox" defaultChecked={profile?.email_notifications !== false} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="email_notifications" className="text-sm font-medium">Receber notificações por e-mail</label>
          </div>

          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            Salvar Preferências
          </button>
        </form>
      </div>

      {/* Alterar Senha */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Alterar Senha</h2>
        <p className="text-sm text-muted-foreground mb-6">Mínimo de 6 caracteres.</p>
        <form action={updatePasswordAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Nova Senha</label>
            <input id="password" name="password" type="password" required minLength={6} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            Atualizar Senha
          </button>
        </form>
      </div>

      {/* Conta */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Conta</h2>
        <p className="text-sm text-muted-foreground mb-4">Informações da sua conta.</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">E-mail</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Membro desde</span>
            <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span className="font-medium text-xs text-muted-foreground">{user?.id?.slice(0, 12)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
