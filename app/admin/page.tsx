import { createClient } from '@/lib/supabase/server'
import { Users, DollarSign, BookOpen, GraduationCap } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Buscar métricas
  const { count: alunosCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'USER')
  const { count: cursosCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
  
  // Buscar compras concluidas
  const { data: purchases } = await supabase.from('purchases').select('amount').eq('status', 'COMPLETED')
  const receitaTotal = purchases?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Visão Geral</h1>
      
      {/* Cards de Metricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Receita Total</h3>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal / 100)}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Alunos Ativos</h3>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black">{alunosCount || 0}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Cursos</h3>
            <BookOpen className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-black">{cursosCount || 0}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Certificados</h3>
            <GraduationCap className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-black">0</p>
        </div>
      </div>

      {/* Gráfico Placeholder */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Integração com Recharts programada para V2.</p>
      </div>
    </div>
  )
}
