'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

const ptContent = {
  title: 'Política de Cookies',
  subtitle: 'Entenda como utilizamos tecnologias de rastreamento.',
  sections: [
    { h: '1. O que são Cookies?', p: 'Cookies são pequenos arquivos de texto que são armazenados no seu navegador ou dispositivo móvel (computador, smartphone, tablet) quando você visita o nosso site. Eles desempenham um papel essencial para permitir que plataformas modernas funcionem corretamente, armazenando preferências e auxiliando na segurança das sessões.' },
    { h: '2. Como e por que utilizamos Cookies', sub: 'A LearningEnglishBR utiliza essas tecnologias em conformidade com as diretrizes do Google (Consent Mode v2) e da Lei Geral de Proteção de Dados (LGPD). Nossos cookies são divididos nas seguintes categorias:', cards: [
      { l: 'Cookies Estritamente Necessários (Essenciais)', t: 'São fundamentais para o funcionamento da plataforma. Permitem que você faça login de forma segura (inclusive utilizando sua conta Google), acesse as áreas exclusivas de alunos e realizem compras. Sem eles, o site não funcionaria. Eles não podem ser desativados.' },
      { l: 'Cookies de Desempenho (Analytics)', t: 'Coletam informações anônimas sobre como os visitantes utilizam o site (ex: páginas mais acessadas, tempo de permanência, mensagens de erro). Usamos o Google Analytics para nos ajudar a melhorar o desempenho e a estrutura da plataforma.' },
      { l: 'Cookies de Publicidade (Marketing)', t: 'Usados para fornecer anúncios e conteúdos mais relevantes para você. Eles lembram que você visitou nosso site (via Google Ads ou Meta Ads) e podem ser compartilhados com essas organizações para que campanhas sejam mais assertivas, sem identificar os usuários individualmente.' },
    ] },
    { h: '3. Consentimento para Serviços do Google', p: 'Para respeitar rigorosamente as políticas de desenvolvedor do Google (Google API Services User Data Policy e Consent Mode), nós não enviamos dados de rastreamento não essenciais ao Google Analytics ou Google Ads até que você forneça o consentimento no nosso banner de navegação inicial. O login social (Google OAuth) requer exclusivamente cookies de sessão necessários para a sua segurança, sem fins de rastreamento publicitário.' },
    { h: '4. Como gerenciar e excluir seus Cookies', sub: 'Você pode alterar suas preferências de cookies a qualquer momento gerenciando as configurações do seu próprio navegador. Abaixo, listamos os links oficiais de ajuda para os navegadores mais populares:', note: 'Atenção: Ao desativar ou limpar os cookies essenciais, é possível que você precise refazer seu login ou que algumas áreas interativas da plataforma fiquem inacessíveis.' },
  ],
}

const enContent = {
  title: 'Cookie Policy',
  subtitle: 'Understand how we use tracking technologies.',
  sections: [
    { h: '1. What are Cookies?', p: 'Cookies are small text files that are stored on your browser or mobile device (computer, smartphone, tablet) when you visit our website. They play an essential role in enabling modern platforms to function properly, storing preferences and assisting in session security.' },
    { h: '2. How and why we use Cookies', sub: 'LearningEnglishBR uses these technologies in compliance with Google guidelines (Consent Mode v2) and the Brazilian General Data Protection Law (LGPD). Our cookies are divided into the following categories:', cards: [
      { l: 'Strictly Necessary Cookies (Essential)', t: 'They are essential for the platform to function. They allow you to log in securely (including using your Google account), access exclusive student areas and make purchases. Without them, the site would not work. They cannot be disabled.' },
      { l: 'Performance Cookies (Analytics)', t: 'They collect anonymous information about how visitors use the site (e.g., most accessed pages, time spent, error messages). We use Google Analytics to help us improve the performance and structure of the platform.' },
      { l: 'Advertising Cookies (Marketing)', t: 'Used to provide more relevant ads and content to you. They remember that you visited our site (via Google Ads or Meta Ads) and may be shared with these organizations to make campaigns more assertive, without identifying users individually.' },
    ] },
    { h: '3. Consent for Google Services', p: 'To strictly comply with Google developer policies (Google API Services User Data Policy and Consent Mode), we do not send non-essential tracking data to Google Analytics or Google Ads until you provide consent in our initial navigation banner. Social login (Google OAuth) exclusively requires session cookies necessary for your security, with no advertising tracking purposes.' },
    { h: '4. How to manage and delete your Cookies', sub: 'You can change your cookie preferences at any time by managing your own browser settings. Below, we list the official help links for the most popular browsers:', note: 'Warning: When disabling or clearing essential cookies, you may need to log in again or some interactive areas of the platform may become inaccessible.' },
  ],
}

export default function CookiesPolicyPage() {
  const { locale } = useLanguage()
  const [siteContent, setSiteContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const c = locale === 'en' ? enContent : ptContent

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [navRes, socialRes, settingsRes, footerRes] = await Promise.all([
        supabase.from('navigation_links').select('*').order('sort_order'),
        supabase.from('social_links').select('*'),
        supabase.from('settings').select('*').single(),
        supabase.from('site_content').select('value').eq('key', 'footer').single(),
      ])
      const navLinks = navRes.data?.map(l => ({ label: l.label, href: l.href })) || []
      const socialLinks = socialRes.data?.map(l => ({ platform: l.platform, url: l.url })) || []
      setSiteContent({
        header: {
          navigation: navLinks,
          social_links: socialLinks,
          logo_text: (settingsRes.data as any)?.header_logo_text || 'Learneng',
        },
        footer: footerRes.data?.value || { description: '', copyright_text: '', columns: [], social_links: [] },
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => { document.title = `${c.title} | LearningEnglishBR` }, [locale])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header navigation={siteContent.header.navigation || []} social_links={siteContent.header.social_links || []} logo_text={siteContent.header.logo_text || 'Learneng'} />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{c.title}</h1>
          <p className="text-muted-foreground">{c.subtitle}</p>
        </div>
        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          {c.sections.map((s: any, i: number) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{s.h}</h2>
              {s.p && <p>{s.p}</p>}
              {s.sub && <p className="mb-4">{s.sub}</p>}
              {s.cards && (
                <ul className="space-y-4">
                  {s.cards.map((card: any, j: number) => (
                    <li key={j} className="bg-muted p-4 rounded-lg border border-border">
                      <strong className="text-foreground block mb-1">{card.l}</strong>
                      {card.t}
                    </li>
                  ))}
                </ul>
              )}
              {s.note && <p className="mt-4 text-sm">{s.note}</p>}
            </section>
          ))}
        </div>
      </main>
      <Footer description={siteContent.footer.description || ''} copyright_text={siteContent.footer.copyright_text || ''} columns={siteContent.footer.columns || []} social_links={siteContent.footer.social_links || []} />
    </div>
  )
}
