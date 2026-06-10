'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

export default function BlogPostPage() {
  const { t, locale } = useLanguage()
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [postRes, headerRes, footerRes] = await Promise.all([
        supabase.from('blog_posts').select('*, author:profiles(id, full_name)').eq('slug', slug).single(),
        supabase.from('site_content').select('value').eq('key', 'header').single(),
        supabase.from('site_content').select('value').eq('key', 'footer').single(),
      ])
      if (!postRes.data) { setNotFound(true); setLoading(false); return }
      setPost(postRes.data)
      const headerVal = headerRes.data?.value || { logo_text: 'Learneng', navigation: [], social_links: [] }
      const footerVal = footerRes.data?.value || { description: '', copyright_text: '', columns: [], social_links: [] }
      setContent({ header: headerVal, footer: footerVal })
      setLoading(false)
    }
    fetchData()
  }, [slug])

  useEffect(() => {
    if (post) document.title = post.title
  }, [post, locale])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('Carregando...')}</p></div>
  if (notFound) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('Artigo não encontrado')}</p></div>

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.learnenglishbr.com.br"

  return (
    <div className="min-h-screen flex flex-col">
      <Header navigation={content.header.navigation || []} social_links={content.header.social_links || []} logo_text={content.header.logo_text || 'Learneng'} />
      <main className="flex-1 bg-background pt-32 pb-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('Voltar ao Blog')}
            </Link>
          </div>

          <header className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">{t(post.title)}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
              <Link href="/sobre-o-professor" className="flex items-center gap-3 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  VB
                </div>
                <div>
                  <p className="font-bold text-foreground">Vitor Brandino</p>
                  <p className="text-xs">{t('Professor Especialista')}</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <time dateTime={post.published_at || post.created_at}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', { dateStyle: 'long' })}
                  </time>
                </div>
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:mt-12 prose-a:text-primary prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 p-8 bg-muted/30 rounded-2xl border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-xl mb-2">{t('Escrito por Vitor Brandino')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('Professor especialista em fluência rápida e preparação para exames TOEFL e IELTS. Mais de 10 anos ajudando brasileiros a dominarem o inglês de verdade.')}
              </p>
              <Link href="/sobre-o-professor" className="text-primary font-bold hover:underline">
                {t('Ler biografia completa')} &rarr;
              </Link>
            </div>
          </div>

        </article>
      </main>
      <Footer description={content.footer.description || ''} copyright_text={content.footer.copyright_text || ''} columns={content.footer.columns || []} social_links={content.footer.social_links || []} />
    </div>
  )
}
