import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { AboutTeacher } from '@/components/landing/AboutTeacher'
import { Courses } from '@/components/landing/Courses'
import { Results } from '@/components/landing/Results'
import { Testimonials } from '@/components/landing/Testimonials'
import { Methodology } from '@/components/landing/Methodology'
import { BlogPreview } from '@/components/landing/BlogPreview'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { Footer } from '@/components/landing/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://learningenglishbr.com.br'

export default async function LandingPage() {
  const supabase = await createClient()

  // Buscar cursos publicados para passar ao componente cliente
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })

  // JSON-LD Structured Data — EducationalOrganization + WebSite
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'LearningEnglishBR',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.jpg`,
    description:
      'Plataforma de ensino de inglês com metodologia comprovada, aulas práticas e suporte personalizado.',
    founder: {
      '@type': 'Person',
      name: 'Vitor Brandino',
      jobTitle: 'Professor de Inglês',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade Estadual do Paraná (UNESPAR)',
      },
    },
    sameAs: [],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LearningEnglishBR',
    url: BASE_URL,
    description:
      'Aprenda inglês com metodologia comprovada. Cursos completos do básico ao avançado.',
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Header />
      <main>
        <Hero />
        <AboutTeacher />
        <Courses courses={courses || []} />
        <Results />
        <Testimonials />
        <Methodology />
        <BlogPreview />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
