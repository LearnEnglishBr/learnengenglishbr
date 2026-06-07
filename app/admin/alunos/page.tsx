import { createClient } from '@/lib/supabase/server'

export default async function AdminAlunosPage() {
  const supabase = await createClient()

  // Buscar alunos e o número de compras
  const { data: alunos } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      created_at,
      purchases(id)
    `)
    .eq('role', 'USER')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alunos</h1>
          <p className="text-muted-foreground">Gerencie seus alunos e acompanhe inscrições.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">E-mail</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data Cadastro</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cursos Ativos</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!alunos || alunos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground h-24">Nenhum aluno encontrado.</td>
                </tr>
              ) : (
                alunos.map(aluno => (
                  <tr key={aluno.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{aluno.full_name || 'Sem Nome'}</td>
                    <td className="p-4 align-middle">{aluno.email}</td>
                    <td className="p-4 align-middle">{new Date(aluno.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 align-middle font-medium text-primary">
                      {aluno.purchases?.length || 0} cursos
                    </td>
                    <td className="p-4 align-middle text-right">
                      <button className="text-sm font-medium text-primary hover:underline">Ver Perfil</button>
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
