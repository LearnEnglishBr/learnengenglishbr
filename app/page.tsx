import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { AboutTeacher } from '@/components/landing/AboutTeacher'
import { Courses } from '@/components/landing/Courses'
import { Results } from '@/components/landing/Results'
import { Testimonials } from '@/components/landing/Testimonials'
import { Methodology } from '@/components/landing/Methodology'
import { BlogPreview } from '@/components/landing/BlogPreview'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { WhyChoose } from '@/components/landing/WhyChoose'
import { Footer } from '@/components/landing/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://learningenglishbr.com.br'

export default async function LandingPage() {
  const supabase = await createClient()
  const content = await getSiteContent()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, description, price, thumbnail')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })

  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

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
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Header navigation={content.header.navigation} social_links={content.header.social_links} logo_text={content.header.logo_text} />
      <main>
        <Hero
          badge={content.hero.badge}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          cta_primary_text={content.hero.cta_primary_text}
          cta_primary_href={content.hero.cta_primary_href}
          cta_secondary_text={content.hero.cta_secondary_text}
          cta_secondary_href={content.hero.cta_secondary_href}
          social_proof_text={content.hero.social_proof_text}
          main_image={content.hero.main_image}
           benefits={content.hero.benefits}
         />
        <WhyChoose title={content.why_choose.title} items={content.why_choose.items} />
        <AboutTeacher
          title={content.about_teacher.title}
          name={content.about_teacher.name}
          bio_paragraph_1={content.about_teacher.bio_paragraph_1}
          bio_paragraph_2={content.about_teacher.bio_paragraph_2}
          bio_paragraph_3={content.about_teacher.bio_paragraph_3}
          info_box_1_title={content.about_teacher.info_box_1_title}
          info_box_1_text={content.about_teacher.info_box_1_text}
          info_box_2_title={content.about_teacher.info_box_2_title}
          info_box_2_text={content.about_teacher.info_box_2_text}
          info_box_3_title={content.about_teacher.info_box_3_title}
          info_box_3_text={content.about_teacher.info_box_3_text}
          gallery_images={content.about_teacher.gallery_images}
        />
        <Courses
          title={content.courses.title}
          subtitle={content.courses.subtitle}
          badge_text={content.courses.badge_text}
          feature_1={content.courses.feature_1}
          feature_2={content.courses.feature_2}
          feature_3={content.courses.feature_3}
          button_text={content.courses.button_text}
          courses={courses || []}
        />
        <Results stats={content.results.stats} />
        <Testimonials title={content.testimonials.title} subtitle={content.testimonials.subtitle} items={content.testimonials.items} />
        <Methodology title={content.methodology.title} section_subtitle={content.methodology.section_subtitle} paragraph_1={content.methodology.paragraph_1} paragraph_2={content.methodology.paragraph_2} paragraph_3={content.methodology.paragraph_3} steps={content.methodology.steps} />
        <BlogPreview title={content.blog_preview.title} subtitle={content.blog_preview.subtitle} view_all_text={content.blog_preview.view_all_text} view_all_href={content.blog_preview.view_all_href} posts={blogPosts || []} />
        <SocialProof paragraph_1={content.social_proof.paragraph_1} paragraph_2={content.social_proof.paragraph_2} />
        <CtaFinal title={content.cta.title} subtitle={content.cta.subtitle} button_text={content.cta.button_text} button_href={content.cta.button_href} />
      </main>
      <Footer description={content.footer.description} copyright_text={content.footer.copyright_text} columns={content.footer.columns} social_links={content.footer.social_links} />
    </div>
  )
}
