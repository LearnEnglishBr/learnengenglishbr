'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, GraduationCap, Languages, BookOpen } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { useLanguage } from '@/context/LanguageContext'

interface AboutTeacherProps {
  title: string
  name: string
  bio_paragraph_1: string
  bio_paragraph_2: string
  bio_paragraph_3: string
  info_box_1_title: string
  info_box_1_text: string
  info_box_2_title: string
  info_box_2_text: string
  info_box_3_title: string
  info_box_3_text: string
  gallery_images: string[]
}

export function AboutTeacher({ title, name, bio_paragraph_1, bio_paragraph_2, bio_paragraph_3, info_box_1_title, info_box_1_text, info_box_2_title, info_box_2_text, info_box_3_title, info_box_3_text, gallery_images }: AboutTeacherProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery_images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [gallery_images.length])

  const next = () => setCurrentIndex((prev) => (prev + 1) % gallery_images.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + gallery_images.length) % gallery_images.length)

  return (
    <section id="sobre" className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <FadeIn direction="right">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                {t(title)}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  {t(name)}
                </span>
              </h2>

              <div className="space-y-4 text-base text-muted-foreground leading-relaxed mb-10">
                {bio_paragraph_1 && <p><strong className="text-foreground">{t(name)}</strong> {t(bio_paragraph_1)}</p>}
                {bio_paragraph_2 && <p>{t(bio_paragraph_2)}</p>}
                {bio_paragraph_3 && <p>{t(bio_paragraph_3)}</p>}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{t(info_box_1_title)}</h4>
                    <p className="text-muted-foreground text-sm">{t(info_box_1_text)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{t(info_box_2_title)}</h4>
                    <p className="text-muted-foreground text-sm">{t(info_box_2_text)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{t(info_box_3_title)}</h4>
                    <p className="text-muted-foreground text-sm">{t(info_box_3_text)}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-square w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              {gallery_images.length > 0 && (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      src={gallery_images[currentIndex]}
                      alt={`${t('Professor')} ${t(name)} — ${t('foto')} ${currentIndex + 1} ${t('de')} ${gallery_images.length}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button onClick={prev} aria-label={t('Foto anterior')} className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors border border-white/20">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex gap-2">
                      {gallery_images.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`${t('Ver foto')} ${idx + 1}`}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                        />
                      ))}
                    </div>
                    <button onClick={next} aria-label={t('Próxima foto')} className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors border border-white/20">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
