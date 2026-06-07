'use client'

import { FadeIn } from './FadeIn'

export function Results() {
  const stats = [
    { value: '+2.500', label: 'Alunos Formados' },
    { value: '98%', label: 'Taxa de Satisfação' },
    { value: '15', label: 'Países Atendidos' },
    { value: '4.9/5', label: 'Avaliação Média' },
  ]

  return (
    <section id="resultados" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-sm">{stat.value}</span>
                <span className="text-sm md:text-base font-medium opacity-80 uppercase tracking-widest">{stat.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
