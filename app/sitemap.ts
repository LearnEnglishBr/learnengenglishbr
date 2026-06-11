import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the public site URL if set; fallback to the production domain.
  const rawBase = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const baseUrl = rawBase && !rawBase.includes('localhost') ? rawBase : 'https://www.learnenglishbr.com.br'

  // Initialize Supabase client only if environment variables are present.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Prepare placeholders for dynamic URLs.
  let postUrls: MetadataRoute.Sitemap[0][] = []
  let courseUrls: MetadataRoute.Sitemap[0][] = []

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    try {
      // Fetch Published Blog Posts
      const { data: posts, error: postError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('status', 'PUBLISHED')
      if (!postError && posts) {
        postUrls = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      }

      // Fetch Published Courses
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('slug, updated_at')
        .eq('status', 'PUBLISHED')
      if (!courseError && courses) {
        courseUrls = courses.map((course) => ({
          url: `${baseUrl}/cursos/${course.slug}`,
          lastModified: new Date(course.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.9,
        }))
      }
    } catch (e) {
      // If Supabase throws an unexpected error, we simply ignore dynamic URLs.
    }
  }

  // Static Pages (always available)
  const staticUrls = [
    '',
    '/cursos',
    '/blog',
    '/ajuda',
    '/termos',
    '/privacidade',
    '/lgpd',
    '/cookies',
    '/reembolso',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'monthly') as 'daily' | 'monthly',
    priority: route === '' ? 1.0 : 0.7,
  }))

  return [...staticUrls, ...courseUrls, ...postUrls]
}

