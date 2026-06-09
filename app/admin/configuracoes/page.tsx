import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { Tabs } from './Tabs'
import { SettingsForm } from './SettingsForm'
import { HeroForm } from './HeroForm'
import { MethodologyForm } from './MethodologyForm'
import { CoursesForm } from './CoursesForm'
import { TestimonialsForm } from './TestimonialsForm'
import { AboutTeacherForm } from './AboutTeacherForm'
import { HeaderForm } from './HeaderForm'
import { FooterForm } from './FooterForm'
import { CTASectionForm } from './CTASectionForm'
import { ResultsForm } from './ResultsForm'
import { SocialProofForm } from './SocialProofForm'
import { GalleryForm } from './GalleryForm'

export default async function AdminConfiguracoesPage() {
  const supabase = await createClient()

  const [
    defaultContent,
    settingsRes,
    siteContentRes,
    navLinksRes,
    socialLinksRes,
    statsRes,
    stepsRes,
    benefitsRes,
    testimonialsRes,
    footerColumnsRes,
    footerLinksRes,
  ] = await Promise.all([
    getSiteContent(),
    supabase.from('settings').select('*').single(),
    supabase.from('site_content').select('*'),
    supabase.from('navigation_links').select('*').order('sort_order'),
    supabase.from('social_links').select('*'),
    supabase.from('site_stats').select('*').order('sort_order'),
    supabase.from('methodology_steps').select('*').order('sort_order'),
    supabase.from('hero_benefits').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
    supabase.from('footer_columns').select('*').order('sort_order'),
    supabase.from('footer_links').select('*').order('sort_order'),
  ])

  const settings = settingsRes.data || defaultContent.branding
  const siteContentArray = siteContentRes.data || []
  const navLinks = navLinksRes.data || []
  const socialLinks = socialLinksRes.data || []
  const stats = statsRes.data || []
  const steps = stepsRes.data || []
  const benefits = benefitsRes.data || []
  const testimonials = testimonialsRes.data || []
  const footerColumns = footerColumnsRes.data || []
  const footerLinks = footerLinksRes.data || []

  const contentMap: Record<string, Record<string, any>> = {}
  for (const item of siteContentArray) {
    if (!contentMap[item.section]) contentMap[item.section] = {}
    contentMap[item.section][item.key] = item.value
  }

  // Fill missing site_content keys with defaults from getSiteContent()
  const fillMissing = (section: string, keys: string[], source: Record<string, any>) => {
    if (!contentMap[section]) contentMap[section] = {}
    for (const key of keys) {
      if (!(key in contentMap[section])) contentMap[section][key] = source[key]
    }
  }

  fillMissing('hero', ['badge', 'title', 'subtitle', 'cta_primary_text', 'cta_primary_href', 'cta_secondary_text', 'cta_secondary_href', 'social_proof_text', 'main_image'], defaultContent.hero as any)
  fillMissing('methodology', ['title', 'paragraph_1', 'paragraph_2', 'paragraph_3', 'section_subtitle'], defaultContent.methodology as any)
  fillMissing('courses', ['title', 'subtitle', 'badge_text', 'feature_1', 'feature_2', 'feature_3', 'button_text'], defaultContent.courses as any)
  fillMissing('testimonials', ['title', 'subtitle'], defaultContent.testimonials as any)
  fillMissing('about_teacher', ['title', 'name', 'bio_paragraph_1', 'bio_paragraph_2', 'bio_paragraph_3', 'info_box_1_title', 'info_box_1_text', 'info_box_2_title', 'info_box_2_text', 'info_box_3_title', 'info_box_3_text'], defaultContent.about_teacher as any)
  fillMissing('cta', ['title', 'subtitle', 'button_text', 'button_href'], defaultContent.cta as any)
  fillMissing('social_proof', ['paragraph_1', 'paragraph_2'], defaultContent.social_proof as any)

  // Gallery images defaults
  if (!contentMap.about_teacher?.gallery_images) {
    if (!contentMap.about_teacher) contentMap.about_teacher = {}
    contentMap.about_teacher.gallery_images = defaultContent.about_teacher.gallery_images
  }

  const footerColsWithLinks = footerColumns.length > 0
    ? footerColumns.map(col => ({
        id: col.id,
        title: col.title,
        links: footerLinks.filter(link => link.column_id === col.id).map(l => ({ label: l.label, href: l.href })),
      }))
    : defaultContent.footer.columns.map(col => ({ id: '', title: col.title, links: col.links }))

  const tabs = [
    { id: 'branding', label: 'Branding', content: <SettingsForm settings={settings} /> },
    { id: 'header', label: 'Header & Nav', content: <HeaderForm navLinks={navLinks.length > 0 ? navLinks : defaultContent.header.navigation} socialLinks={socialLinks.length > 0 ? socialLinks : defaultContent.header.social_links} /> },
    { id: 'hero', label: 'Hero', content: <HeroForm content={contentMap.hero} benefits={benefits.length > 0 ? benefits : defaultContent.hero.benefits} /> },
    { id: 'methodology', label: 'Metodologia', content: <MethodologyForm content={contentMap.methodology} steps={steps.length > 0 ? steps : defaultContent.methodology.steps} /> },
    { id: 'courses', label: 'Cursos', content: <CoursesForm content={contentMap.courses} /> },
    { id: 'results', label: 'Resultados', content: <ResultsForm stats={stats.length > 0 ? stats : defaultContent.results.stats} /> },
    { id: 'testimonials', label: 'Depoimentos', content: <TestimonialsForm testimonials={testimonials.length > 0 ? testimonials : defaultContent.testimonials.items} /> },
    { id: 'about', label: 'Sobre Professor', content: <AboutTeacherForm content={contentMap.about_teacher} /> },
    { id: 'gallery', label: 'Galeria Fotos', content: <GalleryForm content={contentMap.about_teacher} /> },
    { id: 'social-proof', label: 'Social Proof', content: <SocialProofForm content={contentMap.social_proof} /> },
    { id: 'cta', label: 'CTA Final', content: <CTASectionForm content={contentMap.cta} /> },
    { id: 'footer', label: 'Footer', content: <FooterForm footerColumns={footerColsWithLinks} socialLinks={socialLinks} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Controle Total do Site</h1>
        <p className="text-muted-foreground">Gerencie cada seção do site — textos, imagens, cores e conteúdo completo.</p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  )
}
