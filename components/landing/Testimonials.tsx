'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Senior Developer na Microsoft",
    content: "O método da English Premium transformou minha carreira. Consegui a fluência necessária para liderar reuniões com times globais em apenas 6 meses de estudo focado.",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Carlos Mendes",
    role: "CEO de Startup Tech",
    content: "A qualidade da plataforma e do material é comparável às maiores instituições de ensino do mundo. O suporte premium realmente faz a diferença.",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Juliana Costa",
    role: "Diretora de Marketing",
    content: "Pela primeira vez senti que um curso de inglês foi pensado para profissionais ocupados. O aplicativo mobile e as aulas ao vivo se encaixaram perfeitamente na minha rotina.",
    image: "https://i.pravatar.cc/150?img=32"
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="depoimentos" className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">O Que Nossos Alunos Dizem</h2>
        
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <Quote className="w-12 h-12 text-primary/20 mb-6" />
              <p className="text-xl md:text-2xl text-foreground font-medium italic mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={testimonials[currentIndex].image} alt={`Foto de ${testimonials[currentIndex].name}, ${testimonials[currentIndex].role}`} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                <div className="text-left">
                  <h4 className="font-bold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
            <button onClick={prev} aria-label="Depoimento anterior" className="p-3 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
            <button onClick={next} aria-label="Próximo depoimento" className="p-3 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
