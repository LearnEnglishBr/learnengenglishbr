'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, GraduationCap, Languages, BookOpen } from 'lucide-react'
import { FadeIn } from './FadeIn'

const galleryImages = [
  '/images/1b633f1d-8a11-46fa-bb35-67a57ceb0820.jpg',
  '/images/1deed1b3-7c7f-412b-9b53-8c351abf6f78.jpg',
  '/images/70a978a5-8190-48a7-9e7f-01b66d726989.jpg',
  '/images/7580baee-1eae-4df3-a457-f6b4360ac460.jpg',
  '/images/77b455ab-4a7f-4cb7-b9aa-430ffd6fa1b2.jpg',
  '/images/997057a3-9025-4574-9fdc-ae64d89e0e2f.jpg',
  '/images/c2ad8f45-e651-40e8-aef8-b52cb6d9e9e8.jpg',
  '/images/d6ba8d73-2dc4-4466-96ee-711918c3695e.jpg',
  '/images/e9652d56-4de1-4684-b654-01a3cf8b3392.jpg',
  '/images/ed1f1591-ba81-4efb-bc0b-40d422a7d54a.jpg',
  '/images/f292fdac-d500-4e74-82ae-8f8229ba9238.jpg',
  '/images/f8b641e7-afaf-40d1-9543-80902e2fd3a8.jpg'
]

export function AboutTeacher() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play the carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  return (
    <section id="sobre" className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content — Bio real do Vitor Brandino */}
          <FadeIn direction="right">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Conheça o Professor<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  Vitor Brandino
                </span>
              </h2>

              <div className="space-y-4 text-base text-muted-foreground leading-relaxed mb-10">
                <p>
                  <strong className="text-foreground">Vitor Brandino</strong> é graduado em Letras – Inglês pela Universidade Estadual do Paraná (UNESPAR) e possui pós-graduação em Linguística e Linguística Aplicada ao Ensino de Línguas. Com sólida formação acadêmica e ampla experiência na área educacional, atua como professor da rede pública de ensino do Estado do Paraná e também como tutor na área de língua japonesa.
                </p>
                <p>
                  Ao longo de sua trajetória profissional, desenvolveu pesquisas e produziu trabalhos voltados ao ensino de língua inglesa, com foco na utilização de mídias educacionais, abordagens decoloniais, processos de ensino e aprendizagem de idiomas e formação de professores de língua inglesa.
                </p>
                <p>
                  Além de sua atuação como educador, possui extensa experiência em tradução, tendo trabalhado por quase uma década em diferentes projetos e contextos linguísticos. Sua combinação de conhecimento acadêmico, prática docente e vivência internacional proporciona uma metodologia de ensino moderna, eficiente e alinhada às necessidades reais dos estudantes que buscam alcançar fluência e confiança na comunicação em inglês.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Formação Acadêmica</h4>
                    <p className="text-muted-foreground text-sm">Letras – Inglês (UNESPAR) · Pós em Linguística Aplicada ao Ensino de Línguas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Tradutor Profissional</h4>
                    <p className="text-muted-foreground text-sm">Quase uma década de experiência em tradução em diversos projetos e contextos linguísticos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Pesquisador em Ensino de Línguas</h4>
                    <p className="text-muted-foreground text-sm">Pesquisas em mídias educacionais, abordagens decoloniais e formação de professores de inglês.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Modern Carousel */}
          <FadeIn direction="left">
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-square w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={galleryImages[currentIndex]}
                  alt={`Professor Vitor Brandino em atividade educacional — foto ${currentIndex + 1} de ${galleryImages.length}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Carousel Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button onClick={prev} aria-label="Foto anterior" className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors border border-white/20">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                  {galleryImages.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
                <button onClick={next} aria-label="Próxima foto" className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors border border-white/20">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
