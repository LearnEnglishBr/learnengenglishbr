'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

const ptContent = {
  title: 'Política de Privacidade',
  subtitle: 'Última atualização:',
  sections: [
    { h: '1. Introdução', p: 'A privacidade e a segurança dos seus dados são fundamentais para a LearningEnglishBR. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos as suas informações pessoais quando você acessa e utiliza a nossa plataforma de cursos de inglês, bem como ao realizar login com provedores externos como o Google.' },
    { h: '2. Dados que Coletamos', sub: 'Podemos coletar as seguintes categorias de dados pessoais:', list: [
      { l: 'Dados de Registro:', t: 'Nome completo, endereço de e-mail e senha (se aplicável).' },
      { l: 'Login com Google:', t: 'Ao optar por fazer login através do Google (OAuth), coletaremos seu endereço de e-mail primário, nome completo e foto de perfil, unicamente para fins de autenticação e criação de perfil na plataforma.' },
      { l: 'Dados de Pagamento:', t: 'Informações de faturamento geradas durante a compra de nossos cursos (processadas de forma segura por gateways de pagamento terceirizados).' },
      { l: 'Dados de Uso:', t: 'Informações sobre como você interage com a plataforma (aulas assistidas, progresso, acessos).' },
    ] },
    { h: '3. Como Usamos as Informações', list: [
      'Para fornecer, operar e manter os cursos adquiridos.',
      'Para gerenciar sua conta de usuário e facilitar o processo de login (incluindo login social via Google).',
      'Para processar pagamentos de forma segura e realizar suporte financeiro/reembolsos.',
      'Para enviar comunicações importantes, como atualizações da plataforma, recibos, redefinições de senha e notificações de suporte.',
      'Para melhorar a experiência educacional e personalizar o conteúdo de acordo com o seu progresso.',
    ] },
    { h: '4. Compartilhamento de Dados', p: 'A LearningEnglishBR não vende, aluga ou comercializa os seus dados pessoais. Compartilhamos informações apenas com prestadores de serviços estritamente necessários para a operação do site, como provedores de infraestrutura em nuvem, gateways de pagamento e plataformas de envio de e-mails, sempre exigindo altos padrões de segurança e conformidade com a legislação aplicável.' },
    { h: '5. Segurança dos Dados', p: 'Implementamos medidas técnicas e organizacionais rígidas (como criptografia e conexões seguras HTTPS) para proteger as suas informações contra acesso não autorizado, alteração, divulgação ou destruição acidental.' },
    { h: '6. Retenção e Exclusão de Conta', p: 'Manteremos os seus dados enquanto sua conta estiver ativa ou enquanto for necessário para lhe fornecer os serviços e cumprir nossas obrigações legais. Você pode solicitar a exclusão completa da sua conta e de todos os seus dados a qualquer momento enviando um e-mail para o nosso suporte ou utilizando as opções no painel da sua conta.' },
    { h: '7. Contato', p: 'Se você tiver dúvidas sobre nossa Política de Privacidade, entre em contato através da nossa página de suporte ou envie-nos um e-mail diretamente.' },
  ],
}

const enContent = {
  title: 'Privacy Policy',
  subtitle: 'Last updated:',
  sections: [
    { h: '1. Introduction', p: 'Your privacy and data security are fundamental to LearningEnglishBR. This Privacy Policy describes how we collect, use, share and protect your personal information when you access and use our English course platform, as well as when you log in with external providers such as Google.' },
    { h: '2. Data We Collect', sub: 'We may collect the following categories of personal data:', list: [
      { l: 'Registration Data:', t: 'Full name, email address and password (if applicable).' },
      { l: 'Google Login:', t: 'When you choose to log in through Google (OAuth), we will collect your primary email address, full name and profile picture, solely for authentication and profile creation purposes on the platform.' },
      { l: 'Payment Data:', t: 'Billing information generated during the purchase of our courses (securely processed by third-party payment gateways).' },
      { l: 'Usage Data:', t: 'Information about how you interact with the platform (watched lessons, progress, accesses).' },
    ] },
    { h: '3. How We Use the Information', list: [
      'To provide, operate and maintain the purchased courses.',
      'To manage your user account and facilitate the login process (including social login via Google).',
      'To process payments securely and provide financial support/refunds.',
      'To send important communications, such as platform updates, receipts, password resets and support notifications.',
      'To improve the educational experience and personalize content according to your progress.',
    ] },
    { h: '4. Data Sharing', p: 'LearningEnglishBR does not sell, rent or trade your personal data. We only share information with service providers strictly necessary for the operation of the site, such as cloud infrastructure providers, payment gateways and email sending platforms, always requiring high security standards and compliance with applicable legislation.' },
    { h: '5. Data Security', p: 'We implement strict technical and organizational measures (such as encryption and secure HTTPS connections) to protect your information against unauthorized access, alteration, disclosure or accidental destruction.' },
    { h: '6. Retention and Account Deletion', p: 'We will keep your data as long as your account is active or as long as necessary to provide you with services and comply with our legal obligations. You may request the complete deletion of your account and all your data at any time by sending an email to our support or using the options in your account panel.' },
    { h: '7. Contact', p: 'If you have questions about our Privacy Policy, please contact us through our support page or send us an email directly.' },
  ],
}

export default function PrivacyPolicyPage() {
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

  const renderList = (list: any[]) => {
    if (typeof list[0] === 'string') {
      return <ul className="list-disc pl-6 space-y-2">{list.map((item: string, j: number) => <li key={j}>{item}</li>)}</ul>
    }
    return <ul className="list-disc pl-6 space-y-2">{list.map((item: any, j: number) => <li key={j}><strong>{item.l}</strong> {item.t}</li>)}</ul>
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header navigation={siteContent.header.navigation || []} social_links={siteContent.header.social_links || []} logo_text={siteContent.header.logo_text || 'Learneng'} />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{c.title}</h1>
          <p className="text-muted-foreground">{c.subtitle} {new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')}</p>
        </div>
        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          {c.sections.map((s: any, i: number) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{s.h}</h2>
              {s.p && <p>{s.p}</p>}
              {s.sub && <p className="mb-4">{s.sub}</p>}
              {s.list && renderList(s.list)}
            </section>
          ))}
        </div>
      </main>
      <Footer description={siteContent.footer.description || ''} copyright_text={siteContent.footer.copyright_text || ''} columns={siteContent.footer.columns || []} social_links={siteContent.footer.social_links || []} />
    </div>
  )
}
