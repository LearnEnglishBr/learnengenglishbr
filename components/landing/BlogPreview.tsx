'use client'

import { FadeIn } from './FadeIn'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface BlogPreviewProps {
  title: string
  subtitle: string
  view_all_text: string
  view_all_href: string
  posts?: Array<{ id: string; title: string; slug: string; excerpt?: string | null; created_at: string; cover_image_url?: string | null }>
}

export function BlogPreview({ title, subtitle, view_all_text, view_all_href, posts = [] }: BlogPreviewProps) {
  const { t, locale } = useLanguage()
  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : [
    { id: '1', title: 'Como acelerar seu Listening', slug: 'acelerar-listening', created_at: new Date().toISOString() },
    { id: '2', title: 'Vocabulário para Entrevistas', slug: 'vocabulario-entrevistas', created_at: new Date().toISOString() },
    { id: '3', title: 'Erros comuns de brasileiros', slug: 'erros-comuns-brasileiros', created_at: new Date().toISOString() },
  ]

  return (
    <section id="blog" className="py-24 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t(title)}</h2>
            {subtitle && <p className="text-muted-foreground">{t(subtitle)}</p>}
          </div>
          <Link href={view_all_href} className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            {t(view_all_text)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, idx) => (
            <FadeIn key={post.id} delay={idx * 0.1}>
              <Link href={`/blog/${post.slug}`} className="group block rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-video bg-muted relative overflow-hidden">
                   <img src={post.cover_image_url || `https://images.unsplash.com/photo-1513258496099-481620d4ce8d?auto=format&fit=crop&q=80&w=800&sig=${idx}`} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span className="text-primary">{t('Artigo')}</span>
                    <span>•</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR') : t('Recentemente')}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{t(post.title)}</h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
