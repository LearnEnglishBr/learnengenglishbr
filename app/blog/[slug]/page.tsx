import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { getSiteContent } from '@/lib/site-content'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

export const revalidate = 3600 // Cache ISR

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, canonical_url, og_image, focus_keyword')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Artigo não encontrado' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.learnenglishbr.com.br"

  return {
    title: post.meta_title || `${post.title} | LearningEnglishBR`,
    description: post.meta_description || post.excerpt,
    keywords: post.focus_keyword ? [post.focus_keyword] : undefined,
    alternates: {
      canonical: post.canonical_url || `${baseUrl}/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [{ url: post.og_image }] : undefined,
      type: 'article',
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Buscar o artigo com autor
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(id, full_name)')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) {
    notFound()
  }

  const siteContent = await getSiteContent()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.learnenglishbr.com.br"

  // Schema.org E-E-A-T Avançado
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    image: post.og_image || `${baseUrl}/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: 'Vitor Brandino',
      url: `${baseUrl}/sobre-o-professor`
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'LearningEnglishBR',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navigation={siteContent.header.navigation}
        social_links={siteContent.header.social_links}
        logo_text={siteContent.header.logo_text}
      />
      <main className="flex-1 bg-background pt-32 pb-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <SchemaMarkup schema={jsonLd} />

          <div className="mb-8">
            <Breadcrumbs items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}` }
            ]} />
          </div>

          <header className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
              <Link href="/sobre-o-professor" className="flex items-center gap-3 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  VB
                </div>
                <div>
                  <p className="font-bold text-foreground">Vitor Brandino</p>
                  <p className="text-xs">Professor Especialista</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <time dateTime={post.published_at || post.created_at}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                  </time>
                </div>
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:mt-12 prose-a:text-primary prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* E-E-A-T Author Box Footer */}
          <div className="mt-16 p-8 bg-muted/30 rounded-2xl border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-xl mb-2">Escrito por Vitor Brandino</h3>
              <p className="text-muted-foreground mb-4">
                Professor especialista em fluência rápida e preparação para exames TOEFL e IELTS. Mais de 10 anos ajudando brasileiros a dominarem o inglês de verdade.
              </p>
              <Link href="/sobre-o-professor" className="text-primary font-bold hover:underline">
                Ler biografia completa &rarr;
              </Link>
            </div>
          </div>

        </article>
      </main>
      <Footer
        description={siteContent.footer.description}
        copyright_text={siteContent.footer.copyright_text}
        columns={siteContent.footer.columns}
        social_links={siteContent.footer.social_links}
      />
    </div>
  )
}
