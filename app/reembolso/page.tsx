'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

const ptContent = {
  title: 'Política de Reembolso e Cancelamento',
  subtitle: 'Transparência nas devoluções e direito de arrependimento.',
  sections: [
    { h: '1. Direito de Arrependimento (Garantia de 7 Dias)', p: 'Na LearningEnglishBR, temos total confiança na qualidade da nossa metodologia. Em total conformidade com o Artigo 49 do Código de Defesa do Consumidor (CDC) brasileiro, garantimos o Direito de Arrependimento.', highlight: 'Se você adquirir qualquer um de nossos cursos e decidir que ele não é o ideal para você, poderá solicitar o cancelamento e a devolução integral (100%) do valor pago, desde que a solicitação seja feita no prazo máximo de 7 (sete) dias corridos, contados a partir da data de aprovação da compra.' },
    { h: '2. Solicitação Fora do Prazo', p: 'Solicitações de cancelamento ou estorno efetuadas após o prazo estrito de 7 dias corridos não serão aceitas sob nenhuma circunstância. Após este período, o serviço é considerado prestado, o acesso ao material continuará ativo até o fim do ciclo contratado (seja assinatura mensal, anual ou acesso vitalício, conforme o produto) e nenhum valor parcial ou total será devolvido.' },
    { h: '3. Como Solicitar o Reembolso', sub: 'O processo de cancelamento é feito sem burocracia. Para acionar a sua garantia dentro do prazo de 7 dias, basta seguir os seguintes passos:', list: [
      'Envie um e-mail para o nosso suporte formalizando a solicitação de cancelamento.',
      'Informe no e-mail o endereço cadastrado na plataforma e o número do recibo da transação.',
      'Nossa equipe processará o cancelamento da sua conta na plataforma e submeterá a ordem de devolução ao intermediador de pagamento no prazo de até 2 dias úteis.',
    ] },
    { h: '4. Prazos para Processamento do Estorno', sub: 'O tempo necessário para que o valor retorne à sua conta dependerá do método de pagamento utilizado na compra:', list: [
      { l: 'Cartão de Crédito:', t: 'O estorno poderá demorar de 1 a 2 faturas subsequentes para constar no extrato, de acordo com as regras da administradora do seu cartão.' },
      { l: 'PIX ou Boleto:', t: 'O reembolso será transferido diretamente para a conta bancária do titular da compra em até 10 dias úteis após a aprovação do estorno pela nossa equipe.' },
    ] },
    { h: '5. Cancelamento de Assinaturas Recorrentes', p: 'Se você possui uma assinatura recorrente, pode cancelar as próximas cobranças a qualquer momento através do seu painel de usuário. O cancelamento da assinatura interromperá as cobranças futuras, mas manterá seu acesso à plataforma ativo até o término do ciclo já pago. O cancelamento das cobranças futuras não confere o direito a reembolso dos meses já faturados e utilizados.' },
  ],
}

const enContent = {
  title: 'Refund and Cancellation Policy',
  subtitle: 'Transparency in returns and right of withdrawal.',
  sections: [
    { h: '1. Right of Withdrawal (7-Day Guarantee)', p: 'At LearningEnglishBR, we have full confidence in the quality of our methodology. In full compliance with Article 49 of the Brazilian Consumer Protection Code (CDC), we guarantee the Right of Withdrawal.', highlight: 'If you purchase any of our courses and decide it is not ideal for you, you may request cancellation and full refund (100%) of the amount paid, provided the request is made within a maximum of 7 (seven) calendar days from the date of purchase approval.' },
    { h: '2. Late Request', p: 'Cancellation or refund requests made after the strict 7 calendar day period will not be accepted under any circumstances. After this period, the service is considered rendered, access to the material will remain active until the end of the contracted cycle (whether monthly, annual subscription or lifetime access, depending on the product) and no partial or total amount will be refunded.' },
    { h: '3. How to Request a Refund', sub: 'The cancellation process is hassle-free. To activate your guarantee within the 7-day period, simply follow these steps:', list: [
      'Send an email to our support formalizing the cancellation request.',
      'Include in the email the address registered on the platform and the transaction receipt number.',
      'Our team will process the cancellation of your account on the platform and submit the refund order to the payment intermediary within up to 2 business days.',
    ] },
    { h: '4. Refund Processing Times', sub: 'The time required for the amount to return to your account will depend on the payment method used in the purchase:', list: [
      { l: 'Credit Card:', t: 'The refund may take 1 to 2 subsequent billing cycles to appear on your statement, according to the rules of your card issuer.' },
      { l: 'PIX or Boleto:', t: 'The refund will be transferred directly to the purchaser\'s bank account within up to 10 business days after approval of the refund by our team.' },
    ] },
    { h: '5. Cancellation of Recurring Subscriptions', p: 'If you have a recurring subscription, you can cancel future charges at any time through your user panel. Cancelling the subscription will stop future charges, but will keep your access to the platform active until the end of the already paid cycle. Cancellation of future charges does not entitle you to a refund for months already billed and used.' },
  ],
}

export default function RefundPolicyPage() {
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
              {s.highlight && <div className="bg-muted p-6 rounded-lg mt-6 border border-border"><p className="font-medium text-foreground">{s.highlight}</p></div>}
              {s.sub && <p className="mb-4">{s.sub}</p>}
              {s.list && (
                Array.isArray(s.list) && typeof s.list[0] === 'string'
                  ? <ol className="list-decimal pl-6 space-y-2">{s.list.map((item: string, j: number) => <li key={j}>{item}</li>)}</ol>
                  : <ul className="list-disc pl-6 space-y-2">{s.list.map((item: any, j: number) => <li key={j}><strong>{item.l}</strong> {item.t}</li>)}</ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer description={siteContent.footer.description || ''} copyright_text={siteContent.footer.copyright_text || ''} columns={siteContent.footer.columns || []} social_links={siteContent.footer.social_links || []} />
    </div>
  )
}
