'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { CheckCircle, Laptop, UserCheck, Globe, Mic, Brain, FileCheck, School, MessageSquare, Award } from 'lucide-react'

export const AIPlanner = () => {
  const { t } = useLanguage()
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generatePlan = async () => {
    if (!prompt) return
    setLoading(true)
    const mocked = `Objetivo: ${prompt}\nNível recomendado: B2\nTempo estimado: 10 meses\nCompetências: Speaking, Listening, Business English, Presentations\nPlano sugerido:\n1️⃣ Teste de nível\n2️⃣ Curso Fundamental\n3️⃣ Conversação\n4️⃣ Simulador de Entrevistas\n5️⃣ Certificação`
    await new Promise(r => setTimeout(r, 1200))
    setResponse(mocked)
    setLoading(false)
  }

  const benefits = [
    { icon: <Laptop className="w-5 h-5" />, label: 'Trabalho Remoto' },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Entrevistas Internacionais' },
    { icon: <Globe className="w-5 h-5" />, label: 'Intercâmbio' },
    { icon: <Globe className="w-5 h-5" />, label: 'Imigração' },
    { icon: <Mic className="w-5 h-5" />, label: 'Conversação' },
    { icon: <Brain className="w-5 h-5" />, label: 'Fluência' },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left column – benefits list */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">{t('Transforme seu sonho em um plano real')}</h2>
            <p className="text-muted-foreground mb-6">{t('Descubra como a IA pode montar o caminho perfeito para seu objetivo.')}</p>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{t(b.label)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column – AI card */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col space-y-3">
              <textarea
                rows={3}
                placeholder={t('O que você deseja conquistar com o inglês?')}
                className="w-full p-3 border border-primary rounded-md bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary transition"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
              <button
                onClick={generatePlan}
                disabled={loading}
                className="self-center md:self-end px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? t('Gerando…') : t('Criar Meu Plano Gratuito')}
              </button>
            </div>
            {response && (
               <div className="mt-4 p-4 bg-card/30 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                 {response.split('\n').map((line, idx) => {
                   const trimmed = line.trim()
                   if (trimmed.startsWith('1️⃣')) {
                     return (
                       <div key={idx} className="mb-1 flex items-center gap-2">
                         <FileCheck className="w-5 h-5 text-primary" />
                         <span>{t('Teste de nível')}</span>
                        </div>
                     )
                   }
                   if (trimmed.startsWith('2️⃣')) {
                     return (
                       <div key={idx} className="mb-1 flex items-center gap-2">
                         <School className="w-5 h-5 text-primary" />
                         <span>{t('Curso Fundamental')}</span>
                        </div>
                     )
                   }
                   if (trimmed.startsWith('3️⃣')) {
                     return (
                       <div key={idx} className="mb-1 flex items-center gap-2">
                         <MessageSquare className="w-5 h-5 text-primary" />
                         <span>{t('Conversação')}</span>
                        </div>
                     )
                   }
                   if (trimmed.startsWith('4️⃣')) {
                     return (
                       <div key={idx} className="mb-1 flex items-center gap-2">
                         <UserCheck className="w-5 h-5 text-primary" />
                         <span>{t('Simulador de Entrevistas')}</span>
                        </div>
                     )
                   }
                   if (trimmed.startsWith('5️⃣')) {
                     return (
                       <div key={idx} className="mb-1 flex items-center gap-2">
                         <Award className="w-5 h-5 text-primary -mt-0.5" />
                         <span>{t('Certificação')}</span>
                        </div>
                     )
                   }
                   return <p key={idx} className="mb-1">{line}</p>
                 })}
               </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
