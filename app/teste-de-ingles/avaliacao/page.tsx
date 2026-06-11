'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getTestAction,
  getAssessmentQuestionsAction,
  submitAnswerAction,
  completeAssessmentAction,
} from '@/actions/assessment'

type Option = {
  id: string
  optionText: string
}

type Question = {
  id: string
  question: string
  explanation: string
  cefrLevel: string | null
  category: string | null
  difficulty: string | null
  options: Option[]
}

type AnswerFeedback = {
  selectedOptionId: string
  isCorrect: boolean
  explanation: string
}

export default function AvaliacaoPage() {
  const router = useRouter()
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const storedAttemptId = sessionStorage.getItem('assessment_attempt_id')
    if (!storedAttemptId) {
      router.replace('/teste-de-ingles')
      return
    }
    setAttemptId(storedAttemptId)
  }, [router])

  const fetchData = useCallback(async () => {
    if (!attemptId) return
    setLoading(true)
    setError(null)
    try {
      const testResult = await getTestAction()
      if (!testResult.success) {
        throw new Error(testResult.error || 'Falha ao carregar teste')
      }
      const questionsResult = await getAssessmentQuestionsAction(testResult.id)
      if (!questionsResult.success || !questionsResult.questions) {
        throw new Error(questionsResult.error || 'Falha ao carregar questões')
      }
      setQuestions(questionsResult.questions)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar questões')
    } finally {
      setLoading(false)
    }
  }, [attemptId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [])

  const completeTest = useCallback(async () => {
    if (!attemptId) return
    setIsCompleting(true)
    try {
      await completeAssessmentAction(attemptId)
    } catch {
    } finally {
      router.replace('/teste-de-ingles/resultado')
    }
  }, [attemptId, router])

  const advance = useCallback(() => {
    const isLast = currentIndex === questions.length - 1
    if (isLast) {
      completeTest()
    } else {
      setCurrentIndex((prev) => prev + 1)
      setFeedback(null)
      setSubmitError(null)
    }
  }, [currentIndex, questions.length, completeTest])

  const handleSelectOption = useCallback(
    async (questionId: string, selectedOptionId: string) => {
      if (isSubmitting || feedback || !attemptId) return
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const result = await submitAnswerAction(attemptId, questionId, selectedOptionId)

        if (!result.success) {
          setSubmitError(result.error || 'Erro ao enviar resposta')
          setIsSubmitting(false)
          return
        }

        const currentQuestion = questions[currentIndex]

        setFeedback({
          selectedOptionId,
          isCorrect: result.isCorrect || false,
          explanation: currentQuestion.explanation,
        })

        setAnsweredCount((prev) => prev + 1)

        autoAdvanceRef.current = setTimeout(() => {
          setIsSubmitting(false)
          advance()
        }, 1500)
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : 'Erro ao enviar resposta')
        setIsSubmitting(false)
      }
    },
    [isSubmitting, feedback, attemptId, currentIndex, questions, advance]
  )

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progressPercent = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold mb-1">Erro ao carregar</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold mb-1">Nenhuma questão disponível</h2>
            <p className="text-sm text-muted-foreground">
              Este teste ainda não possui questões cadastradas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.replace('/teste-de-ingles')}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {submitError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 text-center">
            {submitError}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mx-6 mt-6">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                Pergunta {currentIndex + 1} de {totalQuestions}
              </span>
              {currentQuestion.category && (
                <span className="rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium px-3 py-1">
                  {currentQuestion.category}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <h2 className="text-lg sm:text-xl font-bold leading-relaxed mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = feedback?.selectedOptionId === option.id
                    let variant: 'default' | 'correct' | 'incorrect' | 'dimmed' = 'default'
                    let icon: React.ReactNode = null

                    if (feedback) {
                      if (isSelected && feedback.isCorrect) {
                        variant = 'correct'
                        icon = <Check className="w-5 h-5 shrink-0" />
                      } else if (isSelected && !feedback.isCorrect) {
                        variant = 'incorrect'
                        icon = <X className="w-5 h-5 shrink-0" />
                      } else {
                        variant = 'dimmed'
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!!feedback || isSubmitting}
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={cn(
                          'w-full rounded-xl border text-left transition-all px-4 py-3 text-sm sm:text-base',
                          variant === 'default' && 'border-border hover:border-primary hover:bg-accent/30',
                          variant === 'correct' && 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700',
                          variant === 'incorrect' && 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700',
                          variant === 'dimmed' && 'border-border opacity-50'
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span>{option.optionText}</span>
                          {icon}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mt-6 rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {feedback.isCorrect ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Correto!
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            Incorreto
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feedback.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {currentIndex === questions.length - 1 && feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-4 text-center"
          >
            {isCompleting ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Finalizando...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aguarde, redirecionando para o resultado...
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
