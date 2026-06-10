'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

function Counter({ from, to, duration = 2, suffix = '', prefix = '' }: { from: number, to: number, duration?: number, suffix?: string, prefix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" })
  const count = useMotionValue(from)
  
  const rounded = useTransform(count, (latest) => {
    if (to % 1 !== 0) {
      return prefix + latest.toFixed(1).replace('.', ',') + suffix
    }
    return prefix + Math.round(latest).toLocaleString('pt-BR') + suffix
  })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: "easeOut" })
      return controls.stop
    }
  }, [count, isInView, to, duration])

  return <motion.span ref={nodeRef}>{rounded}</motion.span>
}

interface ResultsProps {
  stats: Array<{
    label: string
    value_prefix: string
    value_suffix: string
    value_type: string
    value: number | string
  }>
}

export function Results({ stats }: ResultsProps) {
  const { t } = useLanguage()
  return (
    <section id="resultados" className="py-24 relative overflow-hidden bg-[#0a1120] text-white">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-300 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
                <Counter from={0} to={Number(stat.value)} prefix={stat.value_prefix} suffix={stat.value_suffix} />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-bold opacity-70 uppercase tracking-widest text-blue-200">
                {t(stat.label)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
