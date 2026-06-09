import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, MapPin, ShieldAlert, CheckCircle2, History } from 'lucide-react'
import { updateUserRoleAction, blockUserAction } from '@/actions/admin-users'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('profiles')
    .select(`
      *,
      purchases(*),
      crm_notes(*)
    `)
    .eq('id', params.id)
    .single()

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/usuarios" className="p-2 bg-card border border-border rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {user.full_name || 'Usuário Sem Nome'} 
            {user.status === 'BLOCKED' && <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-md font-medium uppercase tracking-wider">Bloqueado</span>}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Informações Pessoais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">CPF</span>
                <p className="font-medium">{user.cpf || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Telefone</span>
                <p className="font-medium">{user.phone || 'Não informado'}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground block mb-1">Endereço</span>
                <p className="font-medium">
                  {user.street ? `${user.street}, ${user.number} ${user.complement || ''} - ${user.neighborhood}, ${user.city}/${user.state} - ${user.country}` : 'Não informado'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Data de Cadastro</span>
                <p className="font-medium">{new Date(user.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Último Acesso</span>
                <p className="font-medium">{user.last_seen_at ? new Date(user.last_seen_at).toLocaleString('pt-BR') : 'Desconhecido'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <History className="w-5 h-5"/> Histórico de Compras ({user.purchases?.length || 0})
            </h2>
            {user.purchases && user.purchases.length > 0 ? (
              <div className="space-y-4">
                {user.purchases.map((purchase: any) => (
                  <div key={purchase.id} className="flex justify-between items-center p-3 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Compra {purchase.stripe_session_id?.substring(0, 8) || purchase.id.substring(0,8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(purchase.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.amount / 100 || 0)}</p>
                      <p className="text-xs text-muted-foreground">{purchase.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma compra encontrada para este usuário.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Controle de Acesso</h2>
            
            <form action={updateUserRoleAction} className="mb-4 space-y-3">
              <input type="hidden" name="userId" value={user.id} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Papel (Role)</label>
                <select name="role" defaultValue={user.role} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="STUDENT">Aluno (STUDENT)</option>
                  <option value="AFFILIATE">Afiliado (AFFILIATE)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Atualizar Permissões
              </button>
            </form>

            <form action={blockUserAction} className="border-t pt-4">
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="currentStatus" value={user.status} />
              {user.status === 'BLOCKED' ? (
                <button type="submit" className="w-full bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Desbloquear Usuário
                </button>
              ) : (
                <button type="submit" className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Bloquear Usuário
                </button>
              )}
            </form>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">CRM (Anotações)</h2>
            <p className="text-sm text-muted-foreground italic mb-4">Adicione observações internas sobre este aluno. O aluno não verá isso.</p>
            {/* Implementar lista de notas de CRM futuramente */}
            <form className="space-y-3">
              <textarea placeholder="Nova observação..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]" />
              <button type="button" className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Salvar Nota
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
