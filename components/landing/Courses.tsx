'use client'

import { createCheckoutSessionAction } from '@/actions/stripe'
import { motion } from 'framer-motion'
import { PlayCircle, Clock, BarChart, CheckCircle2 } from 'lucide-react'

export function Courses({ courses }: { courses: any[] }) {
  return (
    <section id="cursos" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Formações Completas</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Programas intensivos com padrão internacional, desenhados para máxima retenção e aplicação prática no mundo real.
          </p>
        </motion.div>

        {!courses || courses.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed rounded-xl">
            <p className="text-muted-foreground">Novos cursos em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {courses.map((course, idx) => (
              <motion.div 
                key={course.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col rounded-[2rem] border border-border/50 bg-card overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-accent/20">
                      <PlayCircle className="w-16 h-16 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider text-primary border border-primary/20">
                    Premium
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8 border-y border-border/50 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <BarChart className="w-4 h-4 text-primary" /> 
                      <span>{course.level || 'Geral'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Clock className="w-4 h-4 text-primary" /> 
                      <span>Vitalício</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> 
                      <span>Certificado</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> 
                      <span>Suporte VIP</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Investimento único</p>
                      <div className="text-3xl font-black tracking-tight text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                      </div>
                    </div>
                    
                    <form action={async () => {
                      await createCheckoutSessionAction(course.id, course.title, course.price)
                    }}>
                      <button type="submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                        Matricular
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
