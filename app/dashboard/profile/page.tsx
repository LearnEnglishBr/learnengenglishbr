import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { updateProfileAction, uploadAvatarAction } from '@/actions/profile'

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

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="size-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <form action={uploadAvatarAction} className="flex flex-col gap-2">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            <button
              type="submit"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 self-start"
            >
              Atualizar foto
            </button>
          </form>
        </div>

        <form action={updateProfileAction} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <input
              id="email"
              type="email"
              disabled
              defaultValue={user?.email || ''}
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                disabled
                defaultValue={profile?.cpf || ''}
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">CPF não pode ser alterado após o cadastro.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="birth_date" className="text-sm font-medium">Data de Nascimento</label>
              <input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={profile?.birth_date || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">Gênero</label>
              <select
                id="gender"
                name="gender"
                defaultValue={profile?.gender || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não informar">Prefiro não informar</option>
              </select>
            </div>
          </div>

          <fieldset className="rounded-lg border border-border p-4 space-y-4">
            <legend className="text-sm font-semibold px-1">Endereço</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="zip_code" className="text-sm font-medium">CEP</label>
                <input
                  id="zip_code"
                  name="zip_code"
                  type="text"
                  defaultValue={profile?.zip_code || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="street" className="text-sm font-medium">Rua</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  defaultValue={profile?.street || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium">Número</label>
                <input
                  id="number"
                  name="number"
                  type="text"
                  defaultValue={profile?.number || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="complement" className="text-sm font-medium">Complemento</label>
                <input
                  id="complement"
                  name="complement"
                  type="text"
                  defaultValue={profile?.complement || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="neighborhood" className="text-sm font-medium">Bairro</label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  type="text"
                  defaultValue={profile?.neighborhood || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={profile?.city || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">Estado</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  defaultValue={profile?.state || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">País</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  defaultValue={profile?.country || 'Brasil'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </fieldset>

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
