'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  image_url: string | null
  rating: number
}

interface TestimonialsProps {
  title: string
  subtitle: string
  items: Testimonial[]
}

export function Testimonials({ title, subtitle, items }: TestimonialsProps) {
  const { t } = useLanguage()
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

  if (items.length === 0) {
    return (
      <section id="depoimentos" className="py-32 bg-muted/30 overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t(title)}</h2>
          <p className="text-muted-foreground">{t('Em breve novos depoimentos serão adicionados.')}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="depoimentos" className="py-32 bg-muted/30 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{t(title)}</h2>
        {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t(subtitle)}</p>}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 touch-pan-y">
            {items.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="flex-none w-[90vw] sm:w-[500px] md:w-[600px] pl-4"
              >
                <div className="h-full p-8 md:p-10 bg-card border border-border/50 shadow-xl shadow-black/5 rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                  <div>
                    <Quote className="w-10 h-10 text-primary/20 mb-6" />
                    <p className="text-lg md:text-xl text-foreground font-medium mb-8 leading-relaxed">
                      "{t(testimonial.content)}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                    <img
  src={testimonial.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&size=128&background=random`}
  alt={t(testimonial.name)}
  className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-md"
  onError={(e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&size=128&background=random`;
  }}
/>
                    <div>
                      <h4 className="font-bold text-foreground">{t(testimonial.name)}</h4>
                      <p className="text-sm text-muted-foreground">{t(testimonial.role)}</p>
                      <div className="flex items-center gap-0.5 text-yellow-500 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
          <button 
            onClick={scrollPrev} 
            disabled={!canScrollPrev}
            aria-label={t('Depoimento anterior')} 
            className="p-4 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollNext} 
            disabled={!canScrollNext}
            aria-label={t('Próximo depoimento')} 
            className="p-4 rounded-full bg-background border border-border shadow-sm hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
