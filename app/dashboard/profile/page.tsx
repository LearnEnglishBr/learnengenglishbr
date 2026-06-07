import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function updateProfile(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  await supabase.from('profiles').update({ full_name, phone }).eq('id', user.id)
  revalidatePath('/dashboard/profile')
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
      <p className="text-muted-foreground mb-8">Gerencie suas informações pessoais.</p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form action={updateProfile} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <input 
              id="email" 
              type="email" 
              disabled 
              defaultValue={user?.email || ''} 
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado por aqui.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">Nome Completo</label>
            <input 
              id="full_name" 
              name="full_name" 
              type="text" 
              defaultValue={profile?.full_name || ''} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              defaultValue={profile?.phone || ''} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <button 
            type="submit" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  )
}
