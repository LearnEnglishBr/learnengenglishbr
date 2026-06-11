import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use the public site URL if set; fallback to the production domain.
  const rawBase = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const baseUrl = rawBase && !rawBase.includes('localhost') ? rawBase : 'https://www.learnenglishbr.com.br'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/api/',
        '/auth/',
        '/login',
        '/register',
        '/forgot-password',
      ],
    },
    // Multiple sitemap entries are accepted by Google and Bing.
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-images.xml`,
    ],
  }
}
