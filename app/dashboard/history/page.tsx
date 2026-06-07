import { createClient } from '@/lib/supabase/server'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      id,
      amount,
      status,
      created_at,
      course:courses(title)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Histórico de Compras</h1>
      <p className="text-muted-foreground mb-8">Acompanhe seus pedidos e transações.</p>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Curso</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Valor</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!purchases || purchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground h-24">
                    Nenhuma compra encontrada.
                  </td>
                </tr>
              ) : (
                purchases.map((p: any) => (
                  <tr key={p.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{p.course?.title || 'Curso Indisponível'}</td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 align-middle">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.amount / 100)}
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {p.status}
                      </span>
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
