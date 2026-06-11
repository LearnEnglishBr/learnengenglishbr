'use client'

import { useActionState, useState, useEffect } from 'react'
import { createQuestionAction, updateQuestionAction } from '@/actions/admin-assessment'
import { X } from 'lucide-react'

export interface QuestionData {
  id?: string
  question: string
  explanation: string
  cefr_level: string
  category: string
  difficulty: number
  position: number
  is_active: boolean
  options: { optionText: string; isCorrect: boolean }[]
}

interface QuestionFormProps {
  question?: QuestionData
  onClose: () => void
  onSave: () => void
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const CATEGORIES = ['GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING', 'WRITING']

export function QuestionForm({ question, onClose, onSave }: QuestionFormProps) {
  const action = question ? updateQuestionAction : createQuestionAction
  const [state, formAction, isPending] = useActionState(action, null)

  const [optionTexts, setOptionTexts] = useState<string[]>(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)

  useEffect(() => {
    if (question) {
      setOptionTexts(question.options.map(o => o.optionText))
      const idx = question.options.findIndex(o => o.isCorrect)
      if (idx >= 0) setCorrectIndex(idx)
    }
  }, [question])

  useEffect(() => {
    if (state?.success) {
      onSave()
    }
  }, [state, onSave])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{question ? 'Editar Questão' : 'Adicionar Questão'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          {state?.error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{state.error}</p>
          )}

          {question?.id && <input type="hidden" name="id" value={question.id} />}

          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">Questão</label>
            <textarea
              id="question"
              name="question"
              required
              defaultValue={question?.question || ''}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="explanation" className="text-sm font-medium">Explicação</label>
            <textarea
              id="explanation"
              name="explanation"
              defaultValue={question?.explanation || ''}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cefr_level" className="text-sm font-medium">Nível CEFR</label>
              <select
                id="cefr_level"
                name="cefr_level"
                required
                defaultValue={question?.cefr_level || 'A1'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CEFR_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Categoria</label>
              <select
                id="category"
                name="category"
                required
                defaultValue={question?.category || 'GRAMMAR'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">Dificuldade (1-5)</label>
              <input
                type="number"
                id="difficulty"
                name="difficulty"
                required
                min={1}
                max={5}
                defaultValue={question?.difficulty || 1}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">Posição</label>
              <input
                type="number"
                id="position"
                name="position"
                required
                min={1}
                defaultValue={question?.position || 1}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked={question ? question.is_active : true}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium">Ativo</label>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block">Opções</label>
            {optionTexts.map((text, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct_option"
                  value={index}
                  checked={correctIndex === index}
                  onChange={() => setCorrectIndex(index)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <input
                  type="text"
                  name={`option_text_${index}`}
                  value={text}
                  onChange={e => {
                    const copy = [...optionTexts]
                    copy[index] = e.target.value
                    setOptionTexts(copy)
                  }}
                  placeholder={`Opção ${index + 1}`}
                  required
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {correctIndex === index && (
                  <span className="text-xs font-medium text-green-600 whitespace-nowrap">Correta</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
