'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'

export default function BlogPage() {
  const { t, locale } = useLanguage()
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [postsRes, headerRes, footerRes] = await Promise.all([
        supabase.from('blog_posts').select('id, title, slug, excerpt, created_at').eq('published', true).order('created_at', { ascending: false }),
        supabase.from('site_content').select('value').eq('key', 'header').single(),
        supabase.from('site_content').select('value').eq('key', 'footer').single(),
      ])
      setPosts(postsRes.data || [])
      const headerVal = headerRes.data?.value || { logo_text: 'Learneng', navigation: [], social_links: [] }
      const footerVal = footerRes.data?.value || { description: '', copyright_text: '', columns: [], social_links: [] }
      setContent({ header: headerVal, footer: footerVal })
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    document.title = t('Blog e Artigos sobre Inglês')
  }, [locale])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('Carregando...')}</p></div>

  return (
    <div className="min-h-screen flex flex-col">
      <Header navigation={content.header.navigation || []} social_links={content.header.social_links || []} logo_text={content.header.logo_text || 'Learneng'} />
      <main className="flex-1 bg-background pt-32 pb-24">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{t('Blog e Artigos')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t('Conteúdos profundos, metodologias e dicas avançadas para você atingir a fluência real em inglês.')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {!posts || posts.length === 0 ? (
              <p className="text-muted-foreground">{t('Em breve novos artigos serão publicados.')}</p>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{t(post.title)}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt ? t(post.excerpt) : ''}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')}</span>
                    <span className="font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('Ler mais')} &rarr;
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer description={content.footer.description || ''} copyright_text={content.footer.copyright_text || ''} columns={content.footer.columns || []} social_links={content.footer.social_links || []} />
    </div>
  )
}
