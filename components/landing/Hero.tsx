'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Star, Users, GraduationCap, Award, Globe2 } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="inicio" className="relative h-screen pt-32 pb-8 overflow-hidden flex items-center">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-background overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Mais de 2.500 alunos transformados
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 text-foreground"
          >
            Domine o Inglês.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Transforme seu Futuro.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5"
          >
            Método exclusivo para acelerar sua fluência com aulas práticas, suporte personalizado e certificação internacional reconhecida pelas maiores empresas do mercado.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 mb-6 text-sm font-medium text-foreground/80"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Aulas ao vivo</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Suporte individual</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Certificação reconhecida</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Acesso vitalício</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Link href="#cursos" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/25">
              Começar Agora
            </Link>
            <Link href="#metodologia" className="inline-flex h-14 items-center justify-center rounded-full bg-card border border-border px-8 text-base font-semibold text-foreground transition-all hover:bg-accent hover:scale-105 active:scale-95">
              Ver Método
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt={`Foto de aluno satisfeito ${i}`} />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs font-medium text-muted-foreground">+2.500 alunos satisfeitos</p>
            </div>
          </motion.div>
        </div>

        {/* Right Content - 3D/Floating Elements Illusion */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full max-h-[calc(100vh-12rem)] aspect-[3/4] rounded-3xl bg-gradient-to-tr from-card to-muted border border-border/50 shadow-2xl overflow-hidden">
             {/* Mock placeholder for Video or 3D Render */}
             <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity" style={{ backgroundImage: 'url(/images/principal.jpg)' }}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </div>


        </motion.div>
      </div>
    </section>
  )
}
