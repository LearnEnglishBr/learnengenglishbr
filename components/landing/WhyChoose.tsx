'use client'

import { motion } from 'framer-motion'
import { Brain, MessageSquare, Globe, UserCheck } from 'lucide-react'

export function WhyChoose() {
  const items = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />, 
      title: 'Método baseado em neurociência',
      description: 'Estruturado para otimizar a retenção e acelerar a fluência.',
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />, 
      title: 'Prática real de conversação',
      description: 'Aulas ao vivo com feedback imediato para melhorar a fala.',
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />, 
      title: 'Acesso global',
      description: 'Estude a qualquer hora, em qualquer lugar, no seu ritmo.',
    },
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />, 
      title: 'Acompanhamento personalizado',
      description: 'Monitoramento de progresso e ajustes contínuos ao seu plano.',
    },
  ]

  return (
    <section id="por-que" className="py-20 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Por que escolher a <span className="text-primary">LearningEnglishBR</span>?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {item.icon}
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
