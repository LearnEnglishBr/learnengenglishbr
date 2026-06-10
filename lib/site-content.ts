import { createClient } from '@/lib/supabase/server'

// Bilingual helpers: values are stored as {pt, en} or as plain string (backwards compat)
export function pt(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value.pt ?? ''
  return ''
}

export function en(value: any): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value.en ?? value.pt ?? ''
  return ''
}

export function localeValue(value: any, locale: 'pt' | 'en'): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    if (locale === 'en' && value.en != null) return value.en
    return value.pt ?? ''
  }
  return ''
}

export interface SiteContent {
  hero: {
    badge: string
    title: string
    subtitle: string
    cta_primary_text: string
    cta_primary_href: string
    cta_secondary_text: string
    cta_secondary_href: string
    social_proof_text: string
    main_image: string
    benefits: Array<{ text: string }>
  }
  methodology: {
    title: string
    paragraph_1: string
    paragraph_2: string
    paragraph_3: string
    section_subtitle: string
    steps: Array<{
      step_number: string
      title: string
      description: string
      icon_name: string
      icon_color: string
    }>
  }
  courses: {
    title: string
    subtitle: string
    badge_text: string
    feature_1: string
    feature_2: string
    feature_3: string
    button_text: string
  }
  testimonials: {
    title: string
    subtitle: string
    items: Array<{
      id: string
      name: string
      role: string
      content: string
      image_url: string | null
      rating: number
    }>
  }
  about_teacher: {
    title: string
    name: string
    bio_paragraph_1: string
    bio_paragraph_2: string
    bio_paragraph_3: string
    info_box_1_title: string
    info_box_1_text: string
    info_box_2_title: string
    info_box_2_text: string
    info_box_3_title: string
    info_box_3_text: string
    gallery_images: string[]
  }
  blog_preview: {
    title: string
    subtitle: string
    view_all_text: string
    view_all_href: string
  }
  cta: {
    title: string
    subtitle: string
    button_text: string
    button_href: string
  }
  social_proof: {
    paragraph_1: string
    paragraph_2: string
  }
  results: {
    stats: Array<{
      label: string
      value_prefix: string
      value_suffix: string
      value_type: string
      value: number | string
    }>
  }
  header: {
    navigation: Array<{ label: string; href: string }>
    social_links: Array<{ platform: string; url: string }>
    logo_text: string | null
  }
  footer: {
    description: string | null
    copyright_text: string | null
    columns: Array<{
      title: string
      links: Array<{ label: string; href: string }>
    }>
    social_links: Array<{ platform: string; url: string }>
  }
  branding: {
    site_name: string
    site_description: string
    logo_url: string | null
    favicon_url: string | null
    theme_primary_color: string
    theme_secondary_color: string
    theme_accent_color: string
  }
  why_choose: {
    title: string
    items: Array<{ icon_name: string; title: string; description: string }>
  }
}

export async function getSiteContent(locale: 'pt' | 'en' = 'pt'): Promise<SiteContent> {
  const supabase = await createClient()

  // Fetch all data in parallel
  const [
    siteContentRes,
    navLinksRes,
    socialLinksRes,
    statsRes,
    stepsRes,
    benefitsRes,
    testimonialsRes,
    footerColumnsRes,
    footerLinksRes,
    settingsRes,
    whyChooseItemsRes,
  ] = await Promise.all([
    supabase.from('site_content').select('*'),
    supabase.from('navigation_links').select('*').order('sort_order'),
    supabase.from('social_links').select('*'),
    supabase.from('site_stats').select('*').order('sort_order'),
    supabase.from('methodology_steps').select('*').order('sort_order'),
    supabase.from('hero_benefits').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('footer_columns').select('*').order('sort_order'),
    supabase.from('footer_links').select('*').order('sort_order'),
    supabase.from('settings').select('*').single(),
    supabase.from('why_choose_items').select('*').order('sort_order'),
  ])

  const contentMap: Record<string, Record<string, any>> = {}
  if (siteContentRes.data) {
    for (const item of siteContentRes.data) {
      if (!contentMap[item.section]) contentMap[item.section] = {}
      contentMap[item.section][item.key] = item.value
    }
  }

  const settings = settingsRes.data || {}

  const navLinks = navLinksRes.data?.length ? navLinksRes.data : [
    { id: 'default-1', label: 'Início', href: '#inicio', sort_order: 1 },
    { id: 'default-2', label: 'Cursos', href: '#cursos', sort_order: 2 },
    { id: 'default-3', label: 'Metodologia', href: '#metodologia', sort_order: 3 },
    { id: 'default-4', label: 'Resultados', href: '#resultados', sort_order: 4 },
    { id: 'default-5', label: 'Depoimentos', href: '#depoimentos', sort_order: 5 },
    { id: 'default-6', label: 'Blog', href: '/blog', sort_order: 6 },
  ]
  const socialLinks = socialLinksRes.data?.length ? socialLinksRes.data : [
    { id: 'default-1', platform: 'instagram', url: 'https://www.instagram.com/prof_vitor1' },
    { id: 'default-2', platform: 'youtube', url: 'https://youtube.com/@teachervitor-learnenglishbr' },
    { id: 'default-3', platform: 'tiktok', url: 'https://www.tiktok.com/@learnenglishbr' },
    { id: 'default-4', platform: 'whatsapp', url: 'https://chat.whatsapp.com/CDDXQNIUxNWIsRlqAV8Sct' },
    { id: 'default-5', platform: 'discord', url: 'https://discord.gg/N2XYFMXC2' },
  ]
  const stats = statsRes.data?.length ? statsRes.data : [
    { id: 'default-1', label: 'Alunos Formados', value_prefix: '+', value_suffix: '', value_type: 'number', sort_order: 1 },
    { id: 'default-2', label: 'Taxa de Satisfação', value_prefix: '', value_suffix: '%', value_type: 'number', sort_order: 2 },
    { id: 'default-3', label: 'Países Atendidos', value_prefix: '', value_suffix: '', value_type: 'number', sort_order: 3 },
    { id: 'default-4', label: 'Avaliação Média', value_prefix: '', value_suffix: '/5', value_type: 'decimal', sort_order: 4 },
  ]
  const steps = stepsRes.data?.length ? stepsRes.data : [
    { id: 'default-1', step_number: '01', title: 'Learn', description: 'High-quality straight-to-the-point theoretical lessons focused on real life.', icon_name: 'BookOpen', icon_color: 'text-primary', sort_order: 1 },
    { id: 'default-2', step_number: '02', title: 'Practice', description: 'Focused gamified exercises for extreme retention and long-term memory.', icon_name: 'Target', icon_color: 'text-blue-500', sort_order: 2 },
    { id: 'default-3', step_number: '03', title: 'Speak', description: 'Sessões de conversação ao vivo para destravar o seu speaking.', icon_name: 'MessagesSquare', icon_color: 'text-emerald-500', sort_order: 3 },
    { id: 'default-4', step_number: '04', title: 'Fluency', description: 'Domínio avançado do inglês, reconhecido globalmente.', icon_name: 'Award', icon_color: 'text-amber-500', sort_order: 4 },
  ]
  const benefits = benefitsRes.data?.length ? benefitsRes.data : [
    { id: 'default-1', text: 'Live classes', sort_order: 1 },
    { id: 'default-2', text: 'One-on-one support', sort_order: 2 },
    { id: 'default-3', text: 'Progress tracking', sort_order: 3 },
    { id: 'default-4', text: 'Lifetime access', sort_order: 4 },
  ]
  const testimonials = testimonialsRes.data?.length ? testimonialsRes.data : [
    { id: 'default-1', name: 'Maria Silva', role: 'Aluna', content: 'Método incrível! Consegui finalmente destravar meu inglês.', image_url: '', rating: 5, is_active: true, sort_order: 1 },
    { id: 'default-2', name: 'João Santos', role: 'Aluno', content: 'As aulas ao vivo fizeram toda a diferença no meu aprendizado.', image_url: '', rating: 5, sort_order: 2 },
    { id: 'default-3', name: 'Ana Oliveira', role: 'Aluna', content: 'Professor extremamente capacitado. Recomendo demais!', image_url: '', rating: 5, sort_order: 3 },
  ]

  const whyChooseItems = whyChooseItemsRes.data?.length ? whyChooseItemsRes.data : [
    { id: 'default-1', icon_name: 'Brain', title: 'Método baseado em neurociência', description: 'Estruturado para otimizar a retenção e acelerar a fluência.', sort_order: 1 },
    { id: 'default-2', icon_name: 'MessageSquare', title: 'Prática real de conversação', description: 'Aulas ao vivo com feedback imediato para melhorar a fala.', sort_order: 2 },
    { id: 'default-3', icon_name: 'Globe', title: 'Acesso global', description: 'Estude a qualquer hora, em qualquer lugar, no seu ritmo.', sort_order: 3 },
    { id: 'default-4', icon_name: 'UserCheck', title: 'Acompanhamento personalizado', description: 'Monitoramento de progresso e ajustes contínuos ao seu plano.', sort_order: 4 },
  ]

  // Build footer
  const footerColumnsData = footerColumnsRes.data || []
  const footerLinksData = footerLinksRes.data || []
  const footerColumns = footerColumnsData.length > 0 ? footerColumnsData.map(col => ({
    title: col.title,
    links: footerLinksData
      .filter(link => link.column_id === col.id)
      .map(link => ({ label: link.label, href: link.href })),
  })) : [
    {
      title: 'Plataforma',
      links: [
        { label: 'Cursos', href: '#cursos' },
        { label: 'Metodologia', href: '#metodologia' },
        { label: 'Resultados', href: '#resultados' },
        { label: 'Depoimentos', href: '#depoimentos' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Central de Ajuda', href: '/ajuda' },
        { label: 'Fale Conosco', href: '/ajuda' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Termos de Uso', href: '/termos' },
        { label: 'Política de Privacidade', href: '/privacidade' },
        { label: 'Política de Cookies', href: '/cookies' },
        { label: 'Conformidade LGPD', href: '/lgpd' },
        { label: 'Reembolso e Cancelamento', href: '/reembolso' },
      ],
    },
  ]

  const h = contentMap.hero || {}
  const m = contentMap.methodology || {}
  const c = contentMap.courses || {}
  const t = contentMap.testimonials || {}
  const a = contentMap.about_teacher || {}
  const bp = contentMap.blog_preview || {}
  const ct = contentMap.cta || {}
  const sp = contentMap.social_proof || {}
  const wc = contentMap.why_choose || {}

  const galleryImages: string[] = a.gallery_images || [
    '/images/1b633f1d-8a11-46fa-bb35-67a57ceb0820.jpg',
    '/images/1deed1b3-7c7f-412b-9b53-8c351abf6f78.jpg',
    '/images/70a978a5-8190-48a7-9e7f-01b66d726989.jpg',
    '/images/7580baee-1eae-4df3-a457-f6b4360ac460.jpg',
    '/images/77b455ab-4a7f-4cb7-b9aa-430ffd6fa1b2.jpg',
    '/images/997057a3-9025-4574-9fdc-ae64d89e0e2f.jpg',
    '/images/c2ad8f45-e651-40e8-aef8-b52cb6d9e9e8.jpg',
    '/images/d6ba8d73-2dc4-4466-96ee-711918c3695e.jpg',
    '/images/e9652d56-4de1-4684-b654-01a3cf8b3392.jpg',
    '/images/ed1f1591-ba81-4efb-bc0b-40d422a7d54a.jpg',
    '/images/f292fdac-d500-4e74-82ae-8f8229ba9238.jpg',
    '/images/f8b641e7-afaf-40d1-9543-80902e2fd3a8.jpg',
  ]

  return {
    hero: {
      badge: localeValue(h.badge, locale) || (locale === 'en' ? '+2,500 satisfied students' : 'Mais de 2.500 alunos transformados'),
      title: localeValue(h.title, locale) || (locale === 'en' ? 'Master English. Transform Your Future.' : 'Domine o Inglês. Transforme seu Futuro.'),
      subtitle: localeValue(h.subtitle, locale) || '',
      cta_primary_text: localeValue(h.cta_primary_text, locale) || (locale === 'en' ? 'Start Now' : 'Começar Agora'),
      cta_primary_href: h.cta_primary_href || '#cursos',
      cta_secondary_text: localeValue(h.cta_secondary_text, locale) || (locale === 'en' ? 'See Method' : 'Ver Método'),
      cta_secondary_href: h.cta_secondary_href || '#metodologia',
      social_proof_text: localeValue(h.social_proof_text, locale) || (locale === 'en' ? '+2,500 satisfied students' : '+2.500 alunos satisfeitos'),
      main_image: h.main_image || '/images/principal.jpg',
      benefits: benefits.map(b => ({ text: b.text })),
    },
    methodology: {
      title: localeValue(m.title, locale) || (locale === 'en' ? 'Modern and Strategic Methodology' : 'Metodologia Moderna e Estratégica'),
      paragraph_1: localeValue(m.paragraph_1, locale) || '',
      paragraph_2: localeValue(m.paragraph_2, locale) || '',
      paragraph_3: localeValue(m.paragraph_3, locale) || '',
      section_subtitle: localeValue(m.section_subtitle, locale) || '',
      steps: steps.map(s => ({
        step_number: s.step_number,
        title: s.title,
        description: s.description,
        icon_name: s.icon_name,
        icon_color: s.icon_color,
      })),
    },
    courses: {
      title: localeValue(c.title, locale) || (locale === 'en' ? 'Full Programs' : 'Formações Completas'),
      subtitle: localeValue(c.subtitle, locale) || '',
      badge_text: localeValue(c.badge_text, locale) || 'Premium',
      feature_1: localeValue(c.feature_1, locale) || (locale === 'en' ? 'Lifetime' : 'Vitalício'),
      feature_2: localeValue(c.feature_2, locale) || (locale === 'en' ? 'Certificate' : 'Certificado'),
      feature_3: localeValue(c.feature_3, locale) || (locale === 'en' ? 'VIP Support' : 'Suporte VIP'),
      button_text: localeValue(c.button_text, locale) || (locale === 'en' ? 'Enroll' : 'Matricular'),
    },
    testimonials: {
      title: localeValue(t.title, locale) || (locale === 'en' ? 'What Our Students Say' : 'O Que Nossos Alunos Dizem'),
      subtitle: localeValue(t.subtitle, locale) || '',
      items: testimonials.map(tm => ({
        id: tm.id,
        name: tm.name,
        role: tm.role,
        content: tm.content,
        image_url: tm.image_url,
        rating: tm.rating,
      })),
    },
    about_teacher: {
      title: localeValue(a.title, locale) || (locale === 'en' ? 'Meet the Teacher' : 'Conheça o Professor'),
      name: localeValue(a.name, locale) || 'Vitor Brandino',
      bio_paragraph_1: localeValue(a.bio_paragraph_1, locale) || '',
      bio_paragraph_2: localeValue(a.bio_paragraph_2, locale) || '',
      bio_paragraph_3: localeValue(a.bio_paragraph_3, locale) || '',
      info_box_1_title: localeValue(a.info_box_1_title, locale) || (locale === 'en' ? 'Academic Background' : 'Formação Acadêmica'),
      info_box_1_text: localeValue(a.info_box_1_text, locale) || '',
      info_box_2_title: localeValue(a.info_box_2_title, locale) || (locale === 'en' ? 'Professional Translator' : 'Tradutor Profissional'),
      info_box_2_text: localeValue(a.info_box_2_text, locale) || '',
      info_box_3_title: localeValue(a.info_box_3_title, locale) || (locale === 'en' ? 'Language Teaching Researcher' : 'Pesquisador em Ensino de Línguas'),
      info_box_3_text: localeValue(a.info_box_3_text, locale) || '',
      gallery_images: galleryImages,
    },
    blog_preview: {
      title: localeValue(bp.title, locale) || (locale === 'en' ? 'Latest Articles' : 'Últimos Artigos'),
      subtitle: localeValue(bp.subtitle, locale) || '',
      view_all_text: localeValue(bp.view_all_text, locale) || (locale === 'en' ? 'View All Posts' : 'Ver todo o Blog'),
      view_all_href: bp.view_all_href || '/blog',
    },
    cta: {
      title: localeValue(ct.title, locale) || (locale === 'en' ? 'Start your journey to fluency today.' : 'Comece sua jornada rumo à fluência hoje.'),
      subtitle: localeValue(ct.subtitle, locale) || '',
      button_text: localeValue(ct.button_text, locale) || (locale === 'en' ? 'I Want to Become Fluent' : 'Quero Me Tornar Fluente'),
      button_href: ct.button_href || '#cursos',
    },
    social_proof: {
      paragraph_1: localeValue(sp.paragraph_1, locale) || '',
      paragraph_2: localeValue(sp.paragraph_2, locale) || '',
    },
    results: {
      stats: stats.map(s => ({
        label: s.label,
        value_prefix: s.value_prefix,
        value_suffix: s.value_suffix,
        value_type: s.value_type,
        value: s.value_type === 'decimal' ? 4.9 : parseInt(String(Math.random() * 2500)) || 0,
      })),
    },
    header: {
      navigation: navLinks.map(l => ({ label: l.label, href: l.href })),
      social_links: socialLinks.map(l => ({ platform: l.platform, url: l.url })),
      logo_text: settings.header_logo_text || 'Learneng English BR',
    },
    footer: {
      description: settings.footer_description || '',
      copyright_text: settings.copyright_text || 'Learneng English BR. Todos os direitos reservados.',
      columns: footerColumns,
      social_links: socialLinks.map(l => ({ platform: l.platform, url: l.url })),
    },
    branding: {
      site_name: settings.site_name || 'LearningEnglishBR',
      site_description: settings.site_description || '',
      logo_url: settings.logo_url || null,
      favicon_url: settings.favicon_url || null,
      theme_primary_color: settings.theme_primary_color || '#B62C27',
      theme_secondary_color: settings.theme_secondary_color || '#FDB62F',
      theme_accent_color: settings.theme_accent_color || '#FDB62F',
    },
    why_choose: {
      title: localeValue(wc.title, locale) || (locale === 'en' ? 'Why choose Learneng English BR?' : 'Por que escolher a Learneng English BR?'),
      items: whyChooseItems.map(w => ({ icon_name: w.icon_name, title: w.title, description: w.description })),
    },
  }
}
