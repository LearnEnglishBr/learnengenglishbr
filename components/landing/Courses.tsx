'use client'

import { createCheckoutSessionAction } from '@/actions/stripe'
import { FadeIn } from './FadeIn'
import { PlayCircle, Clock, BarChart } from 'lucide-react'

export function Courses({ courses }: { courses: any[] }) {
  return (
    <section id="cursos" className="py-32 bg-background relative">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Cursos Disponíveis</h2>
            <p className="text-xl text-muted-foreground">
              Programas intensivos desenhados para máxima retenção e aplicação prática no mundo real.
            </p>
          </div>
        </FadeIn>

        {!courses || courses.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed rounded-xl">
            <p className="text-muted-foreground">Novos cursos em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <FadeIn key={course.id} delay={idx * 0.1}>
                <div className="group relative flex flex-col rounded-3xl border border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/20 hover:border-primary/30">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-accent">
                        <PlayCircle className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Premium
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col relative z-10">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-8">
                      <div className="flex items-center gap-1.5"><BarChart className="w-4 h-4 text-primary" /> {course.level || 'Geral'}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Acesso Vitalício</div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-3xl font-black tracking-tight">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                      </div>
                      
                      <form action={async () => {
                        await createCheckoutSessionAction(course.id, course.title, course.price)
                      }}>
                        <button type="submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-bold text-background transition-transform hover:scale-105 shadow-lg">
                          Comprar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
