'use client'

import { FadeIn } from './FadeIn'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BlogPreview() {
  const posts = [
    { title: 'Como acelerar seu Listening', category: 'Dicas', time: '5 min' },
    { title: 'Vocabulário para Entrevistas', category: 'Carreira', time: '8 min' },
    { title: 'Erros comuns de brasileiros', category: 'Gramática', time: '4 min' },
  ]

  return (
    <section id="blog" className="py-24 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Últimos Artigos</h2>
            <p className="text-muted-foreground">Conteúdo exclusivo para acelerar sua jornada.</p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Ver todo o Blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Link href="/blog" className="group block rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-video bg-muted relative overflow-hidden">
                   <img src={`https://images.unsplash.com/photo-1513258496099-481620d4ce8d?auto=format&fit=crop&q=80&w=800&sig=${idx}`} alt="Blog" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span className="text-primary">{post.category}</span>
                    <span>•</span>
                    <span>{post.time} read</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
