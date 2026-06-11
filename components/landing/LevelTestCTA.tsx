'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { Trophy, Star, Book, Coffee, Code, Users } from 'lucide-react'

const levels = [
  {
    label: 'A1',
    name: 'Beginner',
    desc: 'Entende frases simples e pode se apresentar.',
    icon: <Book className="w-8 h-8 text-blue-500" />, // placeholder icon
    color: 'bg-red-500/10',
  },
  {
    label: 'A2',
    name: 'Elementary',
    desc: 'Conversa sobre tópicos cotidianos.',
    icon: <Coffee className="w-8 h-8 text-amber-500" />, // placeholder
    color: 'bg-pink-500/10',
  },
  {
    label: 'B1',
    name: 'Intermediate',
    desc: 'Lida com situações de viagem e trabalho básico.',
    icon: <Code className="w-8 h-8 text-green-500" />, // placeholder
    color: 'bg-orange-500/10',
  },
  {
    label: 'B2',
    name: 'Upper‑Intermediate',
    desc: 'Participa de reuniões e discussões.',
    icon: <Users className="w-8 h-8 text-teal-500" />, // placeholder
    color: 'bg-teal-500/10',
  },
  {
    label: 'C1',
    name: 'Advanced',
    desc: 'Expressa ideias complexas com fluência.',
    icon: <Star className="w-8 h-8 text-yellow-500" />, // placeholder
    color: 'bg-indigo-500/10',
  },
  {
    label: 'C2',
    name: 'Proficiency',
    desc: 'Domínio completo, como nativo.',
    icon: <Trophy className="w-8 h-8 text-purple-500" />, // placeholder
    color: 'bg-purple-500/10',
  },
]

export const LevelTestCTA = () => {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <motion.h2
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('Descubra seu nível de inglês')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {levels.map((lvl, i) => (
            <motion.div
              key={lvl.label}
              className={`p-5 rounded-xl border border-border/20 ${lvl.color} backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow`}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-primary text-3xl font-bold">{lvl.label}</div>
                <div className="text-muted-foreground text-sm">{t(lvl.name)}</div>
                <div className="text-center text-sm text-muted-foreground">{t(lvl.desc)}</div>
                {lvl.icon}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/teste-de-ingles"
            className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
          >
            {t('Iniciar Avaliação')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
