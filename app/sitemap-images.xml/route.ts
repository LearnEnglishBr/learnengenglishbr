import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Image‑sitemap endpoint (/sitemap-images.xml).
 * Generates XML according to Google/Bing image‑sitemap specifications.
 */
export async function GET() {
  const rawBase = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const baseUrl = rawBase && !rawBase.includes('localhost') ? rawBase : 'https://www.learnenglishbr.com.br'
  const toAbsolute = (url: string) => (url.startsWith('http') ? url : `${baseUrl}${url}`)
  const entries: string[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    try {
      const { data: posts, error: postError } = await supabase
        .from('blog_posts')
        .select('slug, cover_image, updated_at')
        .eq('status', 'PUBLISHED')
      if (!postError && posts) {
        for (const p of posts) {
          if (!p.cover_image) continue
          const imageUrl = toAbsolute(p.cover_image as string)
          entries.push(
            `  <url>\n` +
              `    <loc>${baseUrl}/blog/${p.slug}</loc>\n` +
              `    <lastmod>${new Date(p.updated_at as string).toISOString()}</lastmod>\n` +
              `    <changefreq>weekly</changefreq>\n` +
              `    <priority>0.8</priority>\n` +
              `    <image:image>\n` +
              `      <image:loc>${imageUrl}</image:loc>\n` +
              `      <image:title>Imagem de destaque – ${p.slug}</image:title>\n` +
              `      <image:caption>Imagem de destaque do post "${p.slug}"</image:caption>\n` +
              `    </image:image>\n` +
              `  </url>`
          )
        }
      }

      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('slug, thumbnail, banner, updated_at')
        .eq('status', 'PUBLISHED')
      if (!courseError && courses) {
        for (const c of courses) {
          const imgs: string[] = []
          if (c.thumbnail) imgs.push(toAbsolute(c.thumbnail as string))
          if (c.banner) imgs.push(toAbsolute(c.banner as string))
          if (imgs.length === 0) continue
          const imageTags = imgs
            .map(
              (url) =>
                `      <image:image>\n` +
                `        <image:loc>${url}</image:loc>\n` +
                `        <image:title>${c.slug} – imagem</image:title>\n` +
                `      </image:image>`
            )
            .join('\n')
          entries.push(
            `  <url>\n` +
              `    <loc>${baseUrl}/cursos/${c.slug}</loc>\n` +
              `    <lastmod>${new Date(c.updated_at as string).toISOString()}</lastmod>\n` +
              `    <changefreq>monthly</changefreq>\n` +
              `    <priority>0.9</priority>\n` +
              `${imageTags}\n` +
              `  </url>`
          )
        }
      }
    } catch {
      // Silently ignore Supabase errors – static URLs will still be emitted.
    }
  }

  const staticRoutes = [
    '',
    '/cursos',
    '/blog',
    '/ajuda',
    '/termos',
    '/privacidade',
    '/lgpd',
    '/cookies',
    '/reembolso',
  ]
  for (const r of staticRoutes) {
    entries.push(
      `  <url>\n` +
        `    <loc>${baseUrl}${r}</loc>\n` +
        `    <lastmod>${new Date().toISOString()}</lastmod>\n` +
        `    <changefreq>${r === '' ? 'daily' : 'monthly'}</changefreq>\n` +
        `    <priority>${r === '' ? '1.0' : '0.7'}</priority>\n` +
        `  </url>`
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${entries.join('\n')}\n` +
    `</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
