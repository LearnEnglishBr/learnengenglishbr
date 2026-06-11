'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { CheckCircle, XCircle, Clock, BarChart2, Brain } from 'lucide-react'

export const InterviewSimulator = () => {
  const { t } = useLanguage()
  const [stage, setStage] = useState<'intro' | 'question' | 'feedback'>('intro')
  const [question, setQuestion] = useState('Hello! Tell me about yourself.')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const submitAnswer = async () => {
    const mocked = `Clareza: 8/10\nGramática: 7/10\nVocabulário: 6/10\nFluência: 7/10`
    await new Promise(r => setTimeout(r, 800))
    setFeedback(mocked)
    setStage('feedback')
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
        <motion.h2
          className="text-4xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('Experimente uma entrevista em inglês agora')}
        </motion.h2>
        {stage === 'intro' && (
          <motion.button
            onClick={() => setStage('question')}
            className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
            whileHover={{ scale: 1.02 }}
          >
            {t('Começar Simulação Gratuita')}
          </motion.button>
        )}
        {stage === 'question' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card/30 backdrop-blur-md p-4 rounded-xl mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
  <motion.div
    whileHover={{ rotate: 15 }}
    animate={{ rotate: [0, 5, -5, 0] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    className="text-primary"
  >
    <Brain className="w-5 h-5" />
  </motion.div>
  <p className="font-medium text-foreground">
    <span className="text-red-600">L</span><span style={{ color: '#0d1e3e' }}>E</span><span className="text-red-600">B</span> IA:
  </p>
</div>
              <p className="mt-1">{question}</p>
            </div>
            <textarea
              rows={4}
              placeholder={t('Sua resposta...')}
              className="w-full p-3 border border-primary rounded-md bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary transition"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <motion.button
                onClick={submitAnswer}
                className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                whileHover={{ scale: 1.03 }}
              >
                {t('Enviar resposta')}
              </motion.button>
            </div>
          </motion.div>
        )}
        {stage === 'feedback' && feedback && (
          <motion.div
            className="mt-6 p-6 bg-card/30 backdrop-blur-md rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              {t('Feedback da IA')}
            </h3>
            <ul className="space-y-2 text-sm">
              {feedback.split('\n').map((line, i) => {
                const [metric, score] = line.split(':')
                const numeric = parseInt(score.split('/')[0] || '0', 10)
                const Icon = numeric >= 7 ? CheckCircle : XCircle
                return (
                  <li key={i} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{metric.trim()}: {score.trim()}</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-center mt-5">
              <Link
                href="/simulador-completo"
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
              >
                {t('Desbloquear Simulador Completo')}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
