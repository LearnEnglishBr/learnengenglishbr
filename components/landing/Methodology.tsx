'use client'

import { FadeIn } from './FadeIn'

export function Methodology() {
  const steps = [
    { num: '01', title: 'Aprenda', desc: 'Aulas teóricas de alta qualidade direto ao ponto.' },
    { num: '02', title: 'Pratique', desc: 'Exercícios focados e gamificados para retenção extrema.' },
    { num: '03', title: 'Converse', desc: 'Sessões de conversação nativa ao vivo.' },
    { num: '04', title: 'Fluência', desc: 'Atingimento e certificação de capacidade técnica.' },
  ]

  return (
    <section id="metodologia" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Como Funciona</h2>
          <p className="text-lg text-muted-foreground">O processo simples e comprovado para o seu sucesso.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
          
          {steps.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-3xl font-black text-primary mb-6 transform transition-transform hover:scale-110 hover:-translate-y-2 hover:shadow-primary/20">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
