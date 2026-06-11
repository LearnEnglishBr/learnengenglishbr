'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { CheckCircle, XCircle, BarChart2, ArrowRight, ArrowLeft, Brain } from 'lucide-react'

const QUESTIONS = [
  'Tell me about yourself and your professional background.',
  'Why do you want to work for an international company?',
  'Describe a challenging project you led and the outcome.',
  'How do you handle tight deadlines and pressure?',
  'What are your strengths and how do they relate to this role?',
]

export const FullInterviewSimulator = () => {
  const { t } = useLanguage()
  const [step, setStep] = useState(0) // 0..QUESTIONS.length
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''))
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[step] = e.target.value
    setAnswers(newAnswers)
  }

  const goNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }
    // last step – generate mock feedback
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const mocked = `Overall Score: 8/10\nClarity: 8/10\nGrammar: 7/10\nVocabulary: 8/10\nFluency: 8/10\n\nGreat job! You showed strong communication skills and relevant experience. Focus on reducing filler words and tightening your responses for even better impact.`
    setFeedback(mocked)
    setLoading(false)
  }

  const goPrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const reset = () => {
    setStep(0)
    setAnswers(Array(QUESTIONS.length).fill(''))
    setFeedback(null)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.h2
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('Simulador Completo de Entrevista em Inglês')}
        </motion.h2>

        {feedback ? (
          <motion.div
            className="p-6 bg-card/30 backdrop-blur-md rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              {t('Feedback da IA')}
            </h3>
            <ul className="space-y-2 text-sm mb-4">
              {feedback.split('\n').map((line, i) => {
                const [key, value] = line.split(':')
                const numeric = parseInt(value?.trim().split('/')[0] || '0', 10)
                const Icon = numeric >= 7 ? CheckCircle : XCircle
                return (
                  <li key={i} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{line}</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
              >
                {t('Reiniciar Simulação')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-card/30 backdrop-blur-md rounded-xl p-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {t('Pergunta')} {step + 1} {t('de')} {QUESTIONS.length}
              </span>
              <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full transition-width"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
  <motion.div
    whileHover={{ rotate: 15 }}
    animate={{ rotate: [0, 5, -5, 0] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    className="text-primary"
  >
    <Brain className="w-5 h-5" />
  </motion.div>
  <p className="font-medium text-foreground">
    <span className="text-red-600">L</span><span style={{ color: '#0d1e3e' }}>E</span><span className="text-red-600">B</span> IA: {QUESTIONS[step]}
  </p>
</div>
            <textarea
              rows={4}
              placeholder={t('Sua resposta...')}
              className="w-full p-3 border border-border/30 rounded-md bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary transition mb-4"
              value={answers[step]}
              onChange={handleAnswerChange}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> {t('Anterior')}
              </button>
              <button
                onClick={goNext}
                disabled={loading}
                className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
              >
                {loading ? t('Gerando Feedback…') : step === QUESTIONS.length - 1 ? t('Finalizar') : t('Próxima')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
