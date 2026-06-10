'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

const ptContent = {
  title: 'Termos e Condições de Uso',
  subtitle: 'Regras e responsabilidades no uso da plataforma educacional.',
  sections: [
    { h: '1. Aceitação dos Termos', p: 'Ao acessar, se cadastrar ou efetuar uma compra na plataforma LearningEnglishBR, operada e administrada pelo Prof. Vitor Brandino, você atesta que leu, compreendeu e concordou integralmente com estes Termos de Uso. Caso não concorde com qualquer cláusula deste documento, você não deverá utilizar a plataforma.' },
    { h: '2. Direitos de Propriedade Intelectual', p: 'Todo o conteúdo disponibilizado na plataforma (incluindo, sem limitação, videoaulas, textos, planilhas, PDFs, marcas, designs, código e software) é propriedade exclusiva da LearningEnglishBR ou de seus licenciadores. O uso não autorizado, compartilhamento de senhas, cópia, gravação de tela, distribuição ou revenda dos materiais constitui violação direta de direitos autorais, estando o infrator sujeito a sanções civis e criminais, além da rescisão imediata e definitiva de sua conta sem direito a qualquer tipo de reembolso.' },
    { h: '3. Conta de Usuário', p: 'Para acessar os cursos, o usuário deverá criar uma conta (via formulário ou provedor de identidade, como o Google). O acesso à plataforma é pessoal e intransferível. É responsabilidade exclusiva do aluno manter a confidencialidade de sua senha e notificar imediatamente o suporte sobre qualquer uso não autorizado de sua conta. O sistema monitora logins múltiplos simultâneos em diferentes IPs e pode bloquear preventivamente o acesso em casos suspeitos.' },
    { h: '4. Obrigações do Usuário', list: ['Utilizar a plataforma apenas para fins educacionais lícitos.', 'Não tentar realizar engenharia reversa, acessar sistemas internos ou interferir nas operações de segurança da plataforma.', 'Fornecer informações verdadeiras, atualizadas e completas no momento da compra e cadastro.', 'Manter um ambiente de respeito cívico nos canais de suporte, áreas de comentários (se houver) e grupos externos vinculados ao curso.'] },
    { h: '5. Disponibilidade da Plataforma', p: 'A LearningEnglishBR se compromete a empregar os melhores esforços para garantir que a plataforma fique disponível 24 horas por dia, 7 dias por semana. No entanto, o acesso poderá ser temporariamente interrompido devido a atualizações agendadas, manutenções, falhas em provedores de hospedagem ou casos fortuitos/força maior. Tais interrupções não darão direito a compensações financeiras ou abatimentos.' },
    { h: '6. Modificações dos Termos', p: 'Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, visando melhorias técnicas ou adequações legais. Os usuários ativos serão notificados sobre as mudanças substanciais através de banners na plataforma ou e-mails. O uso contínuo após as modificações implicará o consentimento dos novos Termos.' },
    { h: '7. Foro de Eleição', p: 'Fica eleito o foro da comarca da sede administrativa da LearningEnglishBR para dirimir quaisquer litígios oriundos deste Termo ou do uso da plataforma, com expressa renúncia a qualquer outro, por mais privilegiado que seja.' },
  ],
}

const enContent = {
  title: 'Terms and Conditions of Use',
  subtitle: 'Rules and responsibilities for using the educational platform.',
  sections: [
    { h: '1. Acceptance of Terms', p: 'By accessing, registering or making a purchase on the LearningEnglishBR platform, operated and administered by Prof. Vitor Brandino, you certify that you have read, understood and fully agreed with these Terms of Use. If you do not agree with any clause of this document, you should not use the platform.' },
    { h: '2. Intellectual Property Rights', p: 'All content made available on the platform (including, without limitation, video lessons, texts, worksheets, PDFs, trademarks, designs, code and software) is the exclusive property of LearningEnglishBR or its licensors. Unauthorized use, password sharing, copying, screen recording, distribution or resale of materials constitutes a direct violation of copyright, and the infringer is subject to civil and criminal sanctions, in addition to the immediate and definitive termination of their account without any right to a refund.' },
    { h: '3. User Account', p: 'To access the courses, the user must create an account (via form or identity provider, such as Google). Access to the platform is personal and non-transferable. It is the student\'s sole responsibility to maintain the confidentiality of their password and immediately notify support of any unauthorized use of their account. The system monitors simultaneous multiple logins from different IPs and may preventively block access in suspected cases.' },
    { h: '4. User Obligations', list: ['Use the platform only for lawful educational purposes.', 'Do not attempt to reverse engineer, access internal systems or interfere with the platform\'s security operations.', 'Provide true, up-to-date and complete information at the time of purchase and registration.', 'Maintain an environment of civic respect in support channels, comment areas (if any) and external groups linked to the course.'] },
    { h: '5. Platform Availability', p: 'LearningEnglishBR undertakes to use its best efforts to ensure that the platform is available 24 hours a day, 7 days a week. However, access may be temporarily interrupted due to scheduled updates, maintenance, failures in hosting providers or fortuitous events/force majeure. Such interruptions shall not entitle to financial compensation or deductions.' },
    { h: '6. Modifications to Terms', p: 'We reserve the right to modify these Terms of Use at any time, aiming at technical improvements or legal adjustments. Active users will be notified of substantial changes through banners on the platform or emails. Continued use after the modifications shall imply consent to the new Terms.' },
    { h: '7. Jurisdiction', p: 'The jurisdiction of the district of the administrative headquarters of LearningEnglishBR is elected to settle any disputes arising from this Term or from the use of the platform, with express waiver of any other, however privileged it may be.' },
  ],
}

export default function TermsOfUsePage() {
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
              {s.list && <ul className="list-disc pl-6 space-y-2">{s.list.map((item: string, j: number) => <li key={j}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>
      </main>
      <Footer description={siteContent.footer.description || ''} copyright_text={siteContent.footer.copyright_text || ''} columns={siteContent.footer.columns || []} social_links={siteContent.footer.social_links || []} />
    </div>
  )
}
