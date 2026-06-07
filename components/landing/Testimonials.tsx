'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Senior Developer na Microsoft",
    content: "O método da Learneng English BR transformou minha carreira. Consegui a fluência necessária para liderar reuniões com times globais em apenas 6 meses de estudo focado.",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Carlos Mendes",
    role: "CEO de Startup Tech",
    content: "A qualidade da plataforma e do material é comparável às maiores instituições de ensino do mundo. O suporte premium realmente faz a diferença para profissionais.",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Juliana Costa",
    role: "Diretora de Marketing",
    content: "Pela primeira vez senti que um curso de inglês foi pensado para pessoas ocupadas. O aplicativo mobile e as aulas ao vivo se encaixaram perfeitamente na minha rotina.",
    image: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 4,
    name: "Roberto Almeida",
    role: "Engenheiro de Software",
    content: "Finalmente consegui a vaga no exterior que sempre sonhei. O foco na comunicação real e não apenas em gramática chata foi o que destravou meu inglês de vez.",
    image: "https://i.pravatar.cc/150?img=59"
  }
]

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 5000, stopOnInteraction: true })])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section id="depoimentos" className="py-32 bg-muted/30 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">O Que Nossos Alunos Dizem</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Histórias reais de profissionais que impulsionaram suas carreiras com o nosso método exclusivo.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Carousel Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 touch-pan-y">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="flex-none w-[90vw] sm:w-[500px] md:w-[600px] pl-4"
              >
                <div className="h-full p-8 md:p-10 bg-card border border-border/50 shadow-xl shadow-black/5 rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                  <div>
                    <Quote className="w-10 h-10 text-primary/20 mb-6" />
                    <p className="text-lg md:text-xl text-foreground font-medium mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                    <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-md" />
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex items-center gap-0.5 text-yellow-500 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button 
            onClick={scrollPrev} 
            disabled={!canScrollPrev}
            aria-label="Depoimento anterior" 
            className="p-4 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollNext} 
            disabled={!canScrollNext}
            aria-label="Próximo depoimento" 
            className="p-4 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
