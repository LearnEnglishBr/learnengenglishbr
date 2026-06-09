import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import Link from 'next/link'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Blog e Artigos sobre Inglês',
  description:
    'Conteúdos aprofundados, metodologias e dicas avançadas para você atingir a fluência real em inglês. Artigos escritos pelo professor Vitor Brandino.',
  openGraph: {
    title: 'Blog | LearningEnglishBR',
    description:
      'Dicas, metodologias e artigos para acelerar sua jornada rumo à fluência em inglês.',
  },
}

export default async function BlogPage() {
  const supabase = await createClient()
  const content = await getSiteContent()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header navigation={content.header.navigation} social_links={content.header.social_links} logo_text={content.header.logo_text} />
      <main className="flex-1 bg-background pt-32 pb-24">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Blog e Artigos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Conteúdos profundos, metodologias e dicas avançadas para você atingir a fluência real em inglês.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {!posts || posts.length === 0 ? (
              <p className="text-muted-foreground">Em breve novos artigos serão publicados.</p>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    <span className="font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler mais &rarr;
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer description={content.footer.description} copyright_text={content.footer.copyright_text} columns={content.footer.columns} social_links={content.footer.social_links} />
    </div>
  )
}
