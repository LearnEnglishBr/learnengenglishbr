'use client'

import { FadeIn } from './FadeIn'
import Link from 'next/link'

export function CtaFinal() {
  return (
    <section className="py-32 relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-4xl">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
            Comece sua jornada rumo à fluência hoje.
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de alunos que já transformaram suas carreiras com o nosso método.
          </p>
          <Link href="#cursos" className="inline-flex h-16 items-center justify-center rounded-full bg-background text-foreground px-10 text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-2xl">
            Quero Me Tornar Fluente
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
