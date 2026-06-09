import { createClient } from '@/lib/supabase/server'
import DashboardCharts from '@/components/admin/DashboardCharts'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Buscar métricas
  const { count: alunosCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STUDENT')
  const { count: cursosCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
  
  // Buscar compras concluidas
  const { data: purchases } = await supabase.from('purchases').select('amount, created_at').eq('status', 'COMPLETED')
  const receitaTotal = purchases?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0
  
  // Buscar reembolsos
  const { count: reembolsosCount } = await supabase.from('refunds').select('*', { count: 'exact', head: true }).in('status', ['PENDING', 'APPROVED'])

  // Calcular Ticket Médio
  const ticketMedio = purchases?.length ? (receitaTotal / purchases.length) : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
        <p className="text-muted-foreground mt-1">Controle total da operação da English School Premium.</p>
      </div>
      
      <DashboardCharts 
        receitaMensal={receitaTotal} 
        alunosCount={alunosCount || 0} 
        cursosVendidos={purchases?.length || 0} 
        ticketMedio={ticketMedio}
        reembolsos={reembolsosCount || 0}
      />
    </div>
  )
}
