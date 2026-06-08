'use client'

import { motion } from 'framer-motion'
import { BookOpen, Target, MessagesSquare, Award } from 'lucide-react'

export function Methodology() {
  const steps = [
    { 
      num: '01', 
      title: 'Aprenda', 
      desc: 'Aulas teóricas de alta qualidade direto ao ponto, com foco na vida real.',
      icon: <BookOpen className="w-8 h-8 text-primary" />
    },
    { 
      num: '02', 
      title: 'Pratique', 
      desc: 'Exercícios focados e gamificados para retenção extrema e memória de longo prazo.',
      icon: <Target className="w-8 h-8 text-blue-500" />
    },
    { 
      num: '03', 
      title: 'Converse', 
      desc: 'Sessões de conversação nativa ao vivo para destravar o seu speaking.',
      icon: <MessagesSquare className="w-8 h-8 text-emerald-500" />
    },
    { 
      num: '04', 
      title: 'Fluência', 
      desc: 'Atingimento e certificação de capacidade técnica com reconhecimento internacional.',
      icon: <Award className="w-8 h-8 text-amber-500" />
    },
  ]

  return (
    <section id="metodologia" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">A Metodologia do Sucesso</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Um processo de 4 passos simples, validado cientificamente para te levar do zero à fluência no menor tempo possível.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative group bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 text-center flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative w-24 h-24 rounded-2xl bg-background border border-border shadow-md flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {/* Glowing subtle ring */}
                <div className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-125 transition-all duration-500" />
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                  {step.num}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
