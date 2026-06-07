'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CtaFinal() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto bg-[#0a1120] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-16 lg:p-24 overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 text-center"
        >
          {/* Advanced Background Effects for CTA */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8 sm:mb-10 shadow-inner">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              Comece sua jornada rumo à <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">fluência hoje.</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 text-blue-100/70 max-w-3xl mx-auto leading-relaxed">
              Junte-se a milhares de profissionais que já transformaram suas carreiras e alcançaram oportunidades globais com o nosso método exclusivo.
            </p>
            
            <Link href="#cursos" className="group relative inline-flex h-14 sm:h-16 items-center justify-center rounded-full bg-white text-[#0a1120] px-8 sm:px-10 text-base sm:text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20">
              <span className="mr-2">Quero Me Tornar Fluente</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
