import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BarChart3, ClipboardList, Users, TrendingUp } from 'lucide-react'

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-amber-500',
  A2: 'bg-gray-400',
  B1: 'bg-yellow-500',
  B2: 'bg-green-500',
  C1: 'bg-blue-500',
  C2: 'bg-purple-500',
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function TesteNivelamentoDashboardPage() {
  const supabase = await createClient()

  const [{ count: totalAttempts }, { count: completedCount }, { data: completedData }, { data: levelData }, { data: recentAttempts }] =
    await Promise.all([
      supabase.from('english_test_attempts').select('*', { count: 'exact', head: true }),
      supabase
        .from('english_test_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true),
      supabase
        .from('english_test_attempts')
        .select('score_percent')
        .eq('is_completed', true),
      supabase
        .from('english_test_attempts')
        .select('cefr_level, score_percent')
        .eq('is_completed', true)
        .not('cefr_level', 'is', null),
      supabase
        .from('english_test_attempts')
        .select('lead_name, lead_email, score_percent, cefr_level, completed_at')
        .eq('is_completed', true)
        .not('cefr_level', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10),
    ])

  const avgScore =
    completedData && completedData.length > 0
      ? completedData.reduce((acc, r) => acc + Number(r.score_percent), 0) / completedData.length
      : 0

  const conversionRate =
    totalAttempts && totalAttempts > 0
      ? Math.round(((completedCount || 0) / totalAttempts) * 100)
      : 0

  const levelDistribution = CEFR_ORDER.map((level) => {
    const found = levelData?.filter((r) => r.cefr_level === level) || []
    return {
      level,
      count: found.length,
      avgScore:
        found.length > 0
          ? found.reduce((acc, r) => acc + Number(r.score_percent), 0) / found.length
          : 0,
    }
  })

  const maxLevelCount = Math.max(...levelDistribution.map((l) => l.count), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teste de Nivelamento</h1>
        <p className="text-muted-foreground mt-1">Gerencie o teste de nível de inglês</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Testes</p>
              <p className="text-2xl font-bold">{totalAttempts ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Testes Completos</p>
              <p className="text-2xl font-bold">{completedCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média Geral</p>
              <p className="text-2xl font-bold">{avgScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 mb-8">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Distribuição por Nível CEFR</h2>
          <div className="space-y-4">
            {levelDistribution.map((item) => (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count} testes &middot; {item.avgScore.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${CEFR_COLORS[item.level]}`}
                    style={{ width: `${(item.count / maxLevelCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {levelDistribution.every((l) => l.count === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum dado disponível.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden lg:col-span-3">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold mb-1">Últimas Tentativas</h2>
            <p className="text-sm text-muted-foreground mb-4">As 10 tentativas mais recentes</p>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Score</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nível</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {!recentAttempts || recentAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground h-24">Nenhuma tentativa encontrada.</td>
                  </tr>
                ) : (
                  recentAttempts.map((attempt, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{attempt.lead_name}</td>
                      <td className="p-4 align-middle text-muted-foreground">{attempt.lead_email}</td>
                      <td className="p-4 align-middle">
                        <span className="font-mono font-medium">{Number(attempt.score_percent).toFixed(0)}%</span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${CEFR_COLORS[attempt.cefr_level] || 'bg-gray-500'}`}>
                          {attempt.cefr_level}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">{formatDate(attempt.completed_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/teste-nivelamento/questoes"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ClipboardList className="h-4 w-4" />
          Gerenciar Questões
        </Link>
        <Link
          href="/admin/teste-nivelamento/resultados"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <BarChart3 className="h-4 w-4" />
          Ver Resultados
        </Link>
      </div>
    </div>
  )
}
