'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Download, Eye, Filter, X, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { calculateResult, getCategoryDisplayName, CEFR_LEVELS } from '@/lib/assessment'

type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface Attempt {
  id: string
  lead_name: string | null
  lead_email: string | null
  lead_phone: string | null
  score_percent: number | null
  cefr_level: string | null
  correct_answers: number | null
  total_questions: number | null
  completed_at: string | null
  created_at: string
}

interface AttemptAnswer {
  id: string
  attempt_id: string
  question_id: string
  selected_option_id: string
  is_correct: boolean
  question?: {
    id: string
    question: string
    explanation: string | null
    category: string
    options: { id: string; option_text: string; is_correct: boolean }[]
  }
}

export default function AdminResultadosPage() {
  const supabase = createClient()

  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [cefrFilter, setCefrFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null)
  const [detailAnswers, setDetailAnswers] = useState<AttemptAnswer[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const fetchAttempts = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('english_test_attempts')
      .select('*')
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })

    const { data, error } = await query

    if (!error && data) {
      setAttempts(data as Attempt[])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchAttempts()
  }, [fetchAttempts])

  const filteredAttempts = useMemo(() => {
    return attempts.filter(a => {
      const matchesSearch = !searchQuery ||
        (a.lead_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.lead_email?.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCefr = !cefrFilter || a.cefr_level === cefrFilter

      return matchesSearch && matchesCefr
    })
  }, [attempts, searchQuery, cefrFilter])

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getCefrColor(level: string | null) {
    const colors: Record<string, string> = {
      A1: 'bg-amber-100 text-amber-800',
      A2: 'bg-slate-100 text-slate-800',
      B1: 'bg-yellow-100 text-yellow-800',
      B2: 'bg-emerald-100 text-emerald-800',
      C1: 'bg-blue-100 text-blue-800',
      C2: 'bg-purple-100 text-purple-800',
    }
    return level && colors[level] ? colors[level] : 'bg-muted text-muted-foreground'
  }

  function getScoreColor(percent: number | null) {
    if (percent === null) return 'text-muted-foreground'
    if (percent >= 80) return 'text-green-600'
    if (percent >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  async function openDetail(attempt: Attempt) {
    setSelectedAttempt(attempt)
    setDetailLoading(true)
    setDetailAnswers([])

    const { data: answers } = await supabase
      .from('english_test_answers')
      .select('*')
      .eq('attempt_id', attempt.id)

    if (answers && answers.length > 0) {
      const questionIds = [...new Set(answers.map((a: any) => a.question_id))]

      const { data: questions } = await supabase
        .from('english_test_questions')
        .select('id, question, explanation, category')
        .in('id', questionIds)

      const { data: options } = await supabase
        .from('english_test_options')
        .select('id, question_id, option_text, is_correct')
        .in('question_id', questionIds)

      const optionsByQuestion: Record<string, { id: string; option_text: string; is_correct: boolean }[]> = {}
      if (options) {
        for (const opt of options) {
          if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = []
          optionsByQuestion[opt.question_id].push(opt)
        }
      }

      const questionMap = new Map<string, { id: string; question: string; explanation: string | null; category: string; options: { id: string; option_text: string; is_correct: boolean }[] }>()
      if (questions) {
        for (const q of questions) {
          questionMap.set(q.id, { ...q, options: optionsByQuestion[q.id] || [] })
        }
      }

      const enriched: AttemptAnswer[] = (answers as any[]).map(a => ({
        ...a,
        question: questionMap.get(a.question_id),
      }))

      setDetailAnswers(enriched)
    }

    setDetailLoading(false)
  }

  function closeDetail() {
    setSelectedAttempt(null)
    setDetailAnswers([])
  }

  function getCategoryBreakdown(answers: AttemptAnswer[]) {
    const catMap: Record<string, { correct: number; total: number }> = {}
    for (const a of answers) {
      if (!a.question) continue
      const cat = a.question.category
      if (!catMap[cat]) catMap[cat] = { correct: 0, total: 0 }
      catMap[cat].total++
      if (a.is_correct) catMap[cat].correct++
    }
    return Object.entries(catMap).map(([category, data]) => ({
      category,
      correct: data.correct,
      total: data.total,
      percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
  }

  function exportCSV() {
    const headers = ['Nome', 'Email', 'Telefone', 'Pontuação', 'Nível', 'Data']
    const rows = filteredAttempts.map(a => [
      a.lead_name || '',
      a.lead_email || '',
      a.lead_phone || '',
      a.score_percent !== null ? `${a.score_percent}%` : '',
      a.cefr_level || '',
      formatDate(a.completed_at),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resultados-teste-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resultados do Teste de Nivelamento</h1>
          <p className="text-muted-foreground">Visualize todos os resultados dos testes realizados.</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou email..."
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Nível CEFR:</label>
                <select
                  value={cefrFilter}
                  onChange={e => setCefrFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Todos</option>
                  {cefrLevels.map(level => (
                    <option key={level} value={level}>{level} - {CEFR_LEVELS[level]?.pt}</option>
                  ))}
                </select>
              </div>
              {cefrFilter && (
                <button
                  onClick={() => setCefrFilter('')}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  Limpar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/30">
              <tr className="border-b transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pontuação</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nível CEFR</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Carregando...</td>
                </tr>
              ) : filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum resultado encontrado.</td>
                </tr>
              ) : (
                filteredAttempts.map(attempt => (
                  <tr key={attempt.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{attempt.lead_name || 'Anônimo'}</td>
                    <td className="p-4 align-middle">{attempt.lead_email || '-'}</td>
                    <td className="p-4 align-middle">{attempt.lead_phone || '-'}</td>
                    <td className="p-4 align-middle">
                      <span className={`font-bold ${getScoreColor(attempt.score_percent)}`}>
                        {attempt.score_percent !== null ? `${attempt.score_percent}%` : '-'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {attempt.cefr_level ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCefrColor(attempt.cefr_level)}`}>
                          {attempt.cefr_level}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground text-xs">
                      {formatDate(attempt.completed_at)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <button
                        onClick={() => openDetail(attempt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          {filteredAttempts.length} resultado(s)
        </div>
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative z-10 w-full max-w-3xl max-h-full overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border rounded-t-2xl flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-bold">Detalhes do Teste</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedAttempt.lead_name || 'Anônimo'} &middot; {selectedAttempt.lead_email || 'sem email'}
                </p>
              </div>
              <button
                onClick={closeDetail}
                className="p-2 rounded-md hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Pontuação</p>
                  <p className={`text-2xl font-black ${getScoreColor(selectedAttempt.score_percent)}`}>
                    {selectedAttempt.score_percent !== null ? `${selectedAttempt.score_percent}%` : '-'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Nível CEFR</p>
                  {selectedAttempt.cefr_level ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${getCefrColor(selectedAttempt.cefr_level)}`}>
                      {selectedAttempt.cefr_level}
                    </span>
                  ) : (
                    <p className="text-muted-foreground">-</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Acertos</p>
                  <p className="text-2xl font-black text-foreground">
                    {selectedAttempt.correct_answers}/{selectedAttempt.total_questions}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedAttempt.lead_phone || '-'}
                  </p>
                </div>
              </div>

              {detailLoading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando respostas...</div>
              ) : detailAnswers.length > 0 && (
                <>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Desempenho por Categoria</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(() => {
                        const breakdown = getCategoryBreakdown(detailAnswers)
                        return breakdown.map(cat => (
                          <div key={cat.category} className="p-4 rounded-xl border border-border bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold">{getCategoryDisplayName(cat.category as any, 'pt')}</span>
                              <span className={`text-sm font-bold ${cat.percent >= 80 ? 'text-green-600' : cat.percent >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {cat.correct}/{cat.total}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${cat.percent >= 80 ? 'bg-green-500' : cat.percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${cat.percent}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{cat.percent}%</p>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Todas as Respostas</h3>
                    <div className="space-y-4">
                      {detailAnswers.map((answer, i) => {
                        const selectedOption = answer.question?.options.find(o => o.id === answer.selected_option_id)
                        const correctOption = answer.question?.options.find(o => o.is_correct)
                        return (
                          <div
                            key={answer.id}
                            className={`p-4 rounded-xl border ${
                              answer.is_correct
                                ? 'border-green-200 bg-green-50/50'
                                : 'border-red-200 bg-red-50/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {answer.is_correct ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-muted-foreground">Questão {i + 1}</span>
                                  {answer.question?.category && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                      {getCategoryDisplayName(answer.question.category as any, 'pt')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-medium mb-2">{answer.question?.question || 'Questão não encontrada'}</p>
                                <div className="space-y-1 text-sm">
                                  <p className="text-muted-foreground">
                                    Resposta: <span className={answer.is_correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                                      {selectedOption?.option_text || 'Não respondeu'}
                                    </span>
                                  </p>
                                  {!answer.is_correct && correctOption && (
                                    <p className="text-green-700">
                                      Correta: <span className="font-medium">{correctOption.option_text}</span>
                                    </p>
                                  )}
                                </div>
                                {answer.question?.explanation && (
                                  <p className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                    {answer.question.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
