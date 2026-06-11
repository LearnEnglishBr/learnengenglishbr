'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

const ptContent = {
  title: 'Conformidade LGPD',
  subtitle: 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018)',
  sections: [
    { h: '1. Nosso Compromisso com a LGPD', p: 'A LearningEnglishBR atua em total conformidade com a Lei Geral de Proteção de Dados do Brasil (LGPD). Assumimos o compromisso público de tratar todos os dados dos nossos alunos e usuários com absoluta transparência, respeitando o direito fundamental à privacidade.' },
    { h: '2. Bases Legais para o Tratamento', sub: 'O tratamento dos seus dados é fundamentado nas seguintes bases legais estabelecidas pela LGPD:', list: [
      { l: 'Execução de Contrato:', t: 'Para o processamento de compras e liberação do acesso à plataforma educacional.' },
      { l: 'Consentimento:', t: 'Fornecido ativamente pelo usuário ao criar sua conta (via formulário ou Google OAuth) e ao se inscrever em newsletters.' },
      { l: 'Obrigação Legal ou Regulatória:', t: 'Para manutenção de registros fiscais e emissão de notas das compras realizadas.' },
      { l: 'Legítimo Interesse:', t: 'Para promoção de novos cursos e melhoria técnica da infraestrutura.' },
    ] },
    { h: '3. Os Direitos do Titular (Art. 18 da LGPD)', sub: 'Como titular dos dados, você possui os seguintes direitos garantidos:', list: [
      { l: 'Acesso e Confirmação:', t: 'Saber se tratamos os seus dados e ter acesso a eles.' },
      { l: 'Correção:', t: 'Solicitar a atualização de dados incompletos, inexatos ou desatualizados.' },
      { l: 'Anonimização ou Bloqueio:', t: 'Solicitar anonimização de dados excessivos ou tratados em desconformidade.' },
      { l: 'Portabilidade:', t: 'Solicitar a transferência dos seus dados a outro prestador de serviços.' },
      { l: 'Eliminação (Direito ao Esquecimento):', t: 'Solicitar a exclusão permanente dos seus dados (exceto quando a retenção for exigida por lei).' },
      { l: 'Revogação do Consentimento:', t: 'Desistir, a qualquer momento, do consentimento para tratamento de dados que o exijam.' },
    ] },
    { h: '4. Canal de Comunicação do Titular e DPO', p1: 'Para exercer qualquer um de seus direitos ou esclarecer dúvidas em relação à proteção dos seus dados, entre em contato com o nosso Encarregado de Proteção de Dados (DPO) através do endereço:', p2: 'ou preenchendo o formulário em nossa aba de suporte. O prazo legal para atendimento dessas solicitações é de até 15 dias.' },
  ],
}

const enContent = {
  title: 'LGPD Compliance',
  subtitle: 'Brazilian General Data Protection Law (Law No. 13,709/2018)',
  sections: [
    { h: '1. Our Commitment to LGPD', p: 'LearningEnglishBR operates in full compliance with the Brazilian General Data Protection Law (LGPD). We publicly commit to processing all data of our students and users with absolute transparency, respecting the fundamental right to privacy.' },
    { h: '2. Legal Bases for Processing', sub: 'The processing of your data is based on the following legal bases established by the LGPD:', list: [
      { l: 'Contract Execution:', t: 'For processing purchases and granting access to the educational platform.' },
      { l: 'Consent:', t: 'Actively provided by the user when creating their account (via form or Google OAuth) and when subscribing to newsletters.' },
      { l: 'Legal or Regulatory Obligation:', t: 'For maintaining tax records and issuing invoices for purchases made.' },
      { l: 'Legitimate Interest:', t: 'For promoting new courses and technical improvement of the infrastructure.' },
    ] },
    { h: '3. Data Subject Rights (Art. 18 of LGPD)', sub: 'As a data subject, you have the following guaranteed rights:', list: [
      { l: 'Access and Confirmation:', t: 'Know whether we process your data and have access to it.' },
      { l: 'Correction:', t: 'Request the update of incomplete, inaccurate or outdated data.' },
      { l: 'Anonymization or Blocking:', t: 'Request anonymization of excessive data or data processed in non-compliance.' },
      { l: 'Portability:', t: 'Request the transfer of your data to another service provider.' },
      { l: 'Deletion (Right to be Forgotten):', t: 'Request the permanent deletion of your data (except when retention is required by law).' },
      { l: 'Consent Revocation:', t: 'Withdraw, at any time, consent for data processing that requires it.' },
    ] },
    { h: '4. Data Subject Communication Channel and DPO', p1: 'To exercise any of your rights or clarify questions regarding the protection of your data, contact our Data Protection Officer (DPO) at:', p2: 'or by filling out the form in our support tab. The legal deadline for responding to these requests is up to 15 days.' },
  ],
}

export default function LGPDPage() {
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
          logo_text: (settingsRes.data as any)?.header_logo_text || 'Learn',
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
      <Header navigation={siteContent.header.navigation || []} social_links={siteContent.header.social_links || []} logo_text={siteContent.header.logo_text || 'Learn'} />
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
              {s.p1 && <p>{s.p1} <strong>dpo@learningenglishbr.com.br</strong> {s.p2}</p>}
              {s.sub && <p className="mb-4">{s.sub}</p>}
              {s.list && (
                <ul className="list-disc pl-6 space-y-2">
                  {s.list.map((item: any, j: number) => <li key={j}><strong>{item.l}</strong> {item.t}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer description={siteContent.footer.description || ''} copyright_text={siteContent.footer.copyright_text || ''} columns={siteContent.footer.columns || []} social_links={siteContent.footer.social_links || []} />
    </div>
  )
}
