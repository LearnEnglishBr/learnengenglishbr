import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.learnenglishbr.com.br'

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
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
