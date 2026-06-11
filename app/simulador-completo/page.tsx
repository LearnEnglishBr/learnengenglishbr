

import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { cookies } from 'next/headers'


import LocaleRefresh from '@/components/LocaleRefresh'
import { JsonLd } from '@/components/seo/JsonLd'
import { FullInterviewSimulator } from '@/components/landing/FullInterviewSimulator'
import { DesistirButton } from '@/components/landing/DesistirButton'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://learningenglishbr.com.br'

export default async function SimuladorCompletoPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('locale')?.value === 'en' ? 'en' : 'pt') as 'pt' | 'en'
  const supabase = await createClient()
  const content = await getSiteContent(lang)

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: content.branding.site_name || 'LearningEnglishBR',
    url: BASE_URL,
    logo: content.branding.logo_url || `${BASE_URL}/og-image.jpg`,
    description: content.branding.site_description || 'Plataforma de ensino de inglês.',
    founder: {
      '@type': 'Person',
      name: content.about_teacher.name || 'Vitor Brandino',
      jobTitle: 'Professor de Inglês',
    },
    sameAs: [],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: content.branding.site_name || 'LearningEnglishBR',
    url: BASE_URL,
    description: content.branding.site_description || 'Aprenda inglês com metodologia comprovada.',
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary"><LocaleRefresh />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <div className="flex justify-end p-4"><DesistirButton /></div>
        <main>
        <FullInterviewSimulator />
      </main>

    </div>
  )
}
