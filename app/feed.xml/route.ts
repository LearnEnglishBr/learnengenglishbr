import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import RSS from 'rss'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.learnenglishbr.com.br'

  const feed = new RSS({
    title: 'Blog | LearningEnglishBR',
    description: 'Aprenda Inglês de Verdade com o Professor Vitor Brandino.',
    feed_url: `${baseUrl}/feed.xml`,
    site_url: baseUrl,
    image_url: `${baseUrl}/images/logo.png`,
    managingEditor: 'vitor@learnenglishbr.com.br (Vitor Brandino)',
    webMaster: 'vitor@learnenglishbr.com.br (Vitor Brandino)',
    copyright: `${new Date().getFullYear()} LearningEnglishBR`,
    language: 'pt-BR',
    pubDate: new Date().toUTCString(),
    ttl: 60,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, excerpt, slug, published_at, updated_at, focus_keyword')
    .eq('status', 'PUBLISHED')
    .order('published_at', { ascending: false })
    .limit(20)

  if (posts) {
    posts.forEach((post) => {
      feed.item({
        title: post.title,
        description: post.excerpt || '',
        url: `${baseUrl}/blog/${post.slug}`,
        categories: post.focus_keyword ? [post.focus_keyword] : [],
        author: 'Vitor Brandino',
        date: new Date(post.published_at || post.updated_at).toUTCString(),
      })
    })
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
