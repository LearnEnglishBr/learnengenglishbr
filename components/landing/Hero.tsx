'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Star } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface HeroProps {
  badge: string
  title: string
  subtitle: string
  cta_primary_text: string
  cta_primary_href: string
  cta_secondary_text: string
  cta_secondary_href: string
  social_proof_text: string
  main_image: string
  benefits: Array<{ text: string }>
}

export function Hero({ badge, title, subtitle, cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href, social_proof_text, main_image, benefits }: HeroProps) {
  const { t } = useLanguage()
  return (
    <section id="inicio" className="relative min-h-screen lg:h-screen pt-24 sm:pt-28 lg:pt-32 pb-8 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-background overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] lg:w-[1000px] h-[300px] lg:h-[400px] bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
      </div>

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="max-w-2xl order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-medium mb-4 sm:mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t(badge)}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 sm:mb-4 text-foreground"
          >
            {title.split('|').map((part, i) => (
              <span key={i}>
                {i > 0 && <><br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t(part)}</span></>}
                {i === 0 && <span>{t(part)}</span>}
              </span>
            ))}
          </motion.h1>

          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-5"
            >
              {t(subtitle)}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6 text-xs sm:text-sm font-medium text-foreground/80"
          >
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                {t(b.text)}
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6"
          >
            <Link href={cta_primary_href} className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-primary px-6 sm:px-8 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/25">
              {t(cta_primary_text)}
            </Link>
            <Link href={cta_secondary_href} className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-card border border-border px-6 sm:px-8 text-sm sm:text-base font-semibold text-foreground transition-all hover:bg-accent hover:scale-105 active:scale-95">
              {t(cta_secondary_text)}
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <div className="flex -space-x-2.5 sm:-space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-500 mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />)}
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">{t(social_proof_text)}</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative order-1 lg:order-2"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4] max-h-[30vh] sm:max-h-[35vh] lg:max-h-[calc(100vh-12rem)] rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-card to-muted border border-border/50 shadow-2xl overflow-hidden mx-auto max-w-sm sm:max-w-md lg:max-w-none">
             <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-luminosity" style={{ backgroundImage: `url(${main_image})` }}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
