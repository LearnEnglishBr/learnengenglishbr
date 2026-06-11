'use client'

import { useEffect, useState, useCallback } from 'react'
import { useActionState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getQuestionsAction, deleteQuestionAction } from '@/actions/admin-assessment'
import { QuestionForm, type QuestionData } from '@/components/assessment/QuestionForm'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)
  const [version, setVersion] = useState(0)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    const result = await getQuestionsAction()
    if (result.success) {
      setQuestions(result.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions, version])

  const [deleteState, deleteAction, deletePending] = useActionState(deleteQuestionAction, null)

  useEffect(() => {
    if (deleteState?.success) {
      setVersion(v => v + 1)
    }
  }, [deleteState])

  const handleAdd = () => {
    setEditingQuestion(null)
    setShowModal(true)
  }

  const handleEdit = (q: any) => {
    const questionData: QuestionData = {
      id: q.id,
      question: q.question,
      explanation: q.explanation || '',
      cefr_level: q.cefr_level,
      category: q.category,
      difficulty: q.difficulty,
      position: q.position,
      is_active: q.is_active,
      options: (q.options || []).map((o: any) => ({
        optionText: o.option_text,
        isCorrect: o.is_correct,
      })),
    }
    setEditingQuestion(questionData)
    setShowModal(true)
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingQuestion(null)
    setVersion(v => v + 1)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return
    const form = new FormData()
    form.set('id', id)
    deleteAction(form)
  }

  const levelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: 'bg-green-100 text-green-800',
      A2: 'bg-blue-100 text-blue-800',
      B1: 'bg-yellow-100 text-yellow-800',
      B2: 'bg-orange-100 text-orange-800',
      C1: 'bg-red-100 text-red-800',
      C2: 'bg-purple-100 text-purple-800',
    }
    return colors[level] || 'bg-muted text-muted-foreground'
  }

  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      GRAMMAR: 'bg-violet-100 text-violet-800',
      VOCABULARY: 'bg-cyan-100 text-cyan-800',
      READING: 'bg-indigo-100 text-indigo-800',
      LISTENING: 'bg-pink-100 text-pink-800',
      WRITING: 'bg-amber-100 text-amber-800',
    }
    return colors[cat] || 'bg-muted text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Questões do Teste de Nivelamento</h1>
          <p className="text-muted-foreground">Gerencie o banco de questões do teste de nivelamento.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Adicionar Questão
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/30">
              <tr className="border-b transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Questão</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nível</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dificuldade</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Posição</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Carregando...</td>
                </tr>
              ) : !questions || questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhuma questão encontrada.</td>
                </tr>
              ) : (
                questions.map(q => (
                  <tr key={q.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle max-w-xs">
                      <span className="block truncate font-medium">{q.question}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelColor(q.cefr_level)}`}>
                        {q.cefr_level}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColor(q.category)}`}>
                        {q.category}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${i < q.difficulty ? 'bg-primary' : 'bg-muted'}`} />
                        ))}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{q.position}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${q.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {q.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(q)}
                          className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <form
                          action={deleteAction}
                          onSubmit={e => {
                            if (!confirm('Tem certeza que deseja excluir esta questão?')) e.preventDefault()
                          }}
                        >
                          <input type="hidden" name="id" value={q.id} />
                          <button
                            type="submit"
                            disabled={deletePending}
                            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <QuestionForm
          question={editingQuestion || undefined}
          onClose={() => { setShowModal(false); setEditingQuestion(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
