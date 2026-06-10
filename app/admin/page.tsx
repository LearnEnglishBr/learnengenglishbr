import { createClient } from '@/lib/supabase/server'
import DashboardCharts from '@/components/admin/DashboardCharts'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    { count: alunosTotal },
    { data: purchases },
    { count: reembolsosCount },
    { data: monthlyRevenue },
    { data: weeklyStudents },
    { data: progressData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STUDENT'),
    supabase.from('purchases').select('amount, created_at').eq('status', 'COMPLETED'),
    supabase.from('refunds').select('*', { count: 'exact', head: true }).in('status', ['PENDING', 'APPROVED']),
    supabase.from('purchases').select('amount, created_at').eq('status', 'COMPLETED').gte('created_at', sixMonthsAgo.toISOString()),
    supabase.from('profiles').select('created_at').gte('created_at', sevenDaysAgo.toISOString()),
    supabase.from('user_progress').select('completed'),
  ])

  const receitaTotal = purchases?.reduce((acc, p) => acc + Number(p.amount), 0) || 0
  const ticketMedio = purchases?.length ? receitaTotal / purchases.length : 0

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const revenueByMonth: Record<string, number> = {}
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    revenueByMonth[monthNames[d.getMonth()]] = 0
  }
  for (const p of monthlyRevenue || []) {
    const d = new Date(p.created_at)
    const key = monthNames[d.getMonth()]
    if (key in revenueByMonth) revenueByMonth[key] += Number(p.amount)
  }
  const revenueChartData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }))

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const studentsByDay: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
    studentsByDay[dayNames[d.getDay()]] = 0
  }
  for (const p of weeklyStudents || []) {
    const d = new Date(p.created_at)
    const key = dayNames[d.getDay()]
    if (key in studentsByDay) studentsByDay[key]++
  }
  const studentsChartData = Object.entries(studentsByDay).map(([name, users]) => ({ name, users }))

  const completedLessons = progressData?.filter(p => p.completed).length || 0
  const totalLessons = progressData?.length || 0
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const monthIndex = now.getMonth()
  const currentMonthRevenue = revenueByMonth[monthNames[monthIndex]] || 0
  const prevMonthRevenue = revenueByMonth[monthNames[monthIndex - 1]] || 0
  const revenueGrowth = prevMonthRevenue > 0 ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100) : 0

  const newStudentsThisMonth = (await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString())).count || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
        <p className="text-muted-foreground mt-1">Controle total da operação da English School Premium.</p>
      </div>
      <DashboardCharts
        receitaMensal={currentMonthRevenue}
        receitaTotal={receitaTotal}
        alunosCount={alunosTotal || 0}
        novosAlunosMes={newStudentsThisMonth}
        cursosVendidos={purchases?.length || 0}
        ticketMedio={ticketMedio}
        reembolsos={reembolsosCount || 0}
        revenueChartData={revenueChartData}
        studentsChartData={studentsChartData}
        completionRate={completionRate}
        revenueGrowth={revenueGrowth}
      />
    </div>
  )
}
