import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default async function AdminUsuariosPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await createClient()
  const query = searchParams?.q || ''

  let dbQuery = supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      role,
      status,
      created_at,
      purchases(id)
    `)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,cpf.ilike.%${query}%`)
  }

  const { data: usuarios } = await dbQuery

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Controle total sobre alunos, afiliados e administradores.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <form className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome, email ou CPF..." 
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/30">
              <tr className="border-b transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuário</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">E-mail</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Papel</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cursos</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!usuarios || usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                usuarios.map(user => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{user.full_name || 'Sem Nome'}</td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {user.status === 'BLOCKED' ? (
                        <span className="flex items-center gap-1 text-destructive text-xs font-medium"><ShieldAlert className="w-3 h-3"/> Bloqueado</span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-3 h-3"/> Ativo</span>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {user.purchases?.length || 0}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Link href={`/admin/usuarios/${user.id}`} className="text-sm font-medium text-primary hover:underline">
                        Gerenciar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
