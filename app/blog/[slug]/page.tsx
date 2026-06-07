import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Revalidar a cada 1 hora para SEO Cache
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Artigo não encontrado' }

  return {
    title: `${post.title} | Plataforma de Inglês`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) {
    notFound()
  }

  // Schema.org para AEO/SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    author: {
      '@type': 'Organization',
      name: 'Escola Premium de Inglês',
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background pt-32 pb-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Voltar para o blog
          </Link>

          <header className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</time>
              <span>•</span>
              <span>5 min de leitura</span>
            </div>
          </header>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
