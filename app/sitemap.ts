import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.learnenglishbr.com.br'

  // Initialize Supabase admin client to bypass RLS for sitemap generation if needed,
  // or use anon key if policies allow read access to published posts/courses.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch Published Blog Posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')
  
  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Fetch Published Courses
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')

  const courseUrls = (courses || []).map((course) => ({
    url: `${baseUrl}/cursos/${course.slug}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Static Pages
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
    changeFrequency: (route === '' ? 'daily' : 'monthly') as "daily" | "monthly",
    priority: route === '' ? 1.0 : 0.7,
  }))

  return [...staticUrls, ...courseUrls, ...postUrls]
}
