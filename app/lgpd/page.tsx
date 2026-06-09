import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Conformidade LGPD | LearningEnglishBR',
  description: 'Diretrizes da LearningEnglishBR em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
}

export default async function LGPDPage() {
  const siteContent = await getSiteContent()
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header navigation={siteContent.header.navigation} social_links={siteContent.header.social_links} logo_text={siteContent.header.logo_text} />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Conformidade LGPD
          </h1>
          <p className="text-muted-foreground">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Nosso Compromisso com a LGPD</h2>
            <p>
              A <strong>LearningEnglishBR</strong> atua em total conformidade com a Lei Geral de Proteção de Dados do Brasil (LGPD). Assumimos o compromisso público de tratar todos os dados dos nossos alunos e usuários com absoluta transparência, respeitando o direito fundamental à privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Bases Legais para o Tratamento</h2>
            <p className="mb-4">O tratamento dos seus dados é fundamentado nas seguintes bases legais estabelecidas pela LGPD:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Execução de Contrato:</strong> Para o processamento de compras e liberação do acesso à plataforma educacional.</li>
              <li><strong>Consentimento:</strong> Fornecido ativamente pelo usuário ao criar sua conta (via formulário ou Google OAuth) e ao se inscrever em newsletters.</li>
              <li><strong>Obrigação Legal ou Regulatória:</strong> Para manutenção de registros fiscais e emissão de notas das compras realizadas.</li>
              <li><strong>Legítimo Interesse:</strong> Para promoção de novos cursos e melhoria técnica da infraestrutura.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Os Direitos do Titular (Art. 18 da LGPD)</h2>
            <p className="mb-4">Como titular dos dados, você possui os seguintes direitos garantidos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso e Confirmação:</strong> Saber se tratamos os seus dados e ter acesso a eles.</li>
              <li><strong>Correção:</strong> Solicitar a atualização de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização ou Bloqueio:</strong> Solicitar anonimização de dados excessivos ou tratados em desconformidade.</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados a outro prestador de serviços.</li>
              <li><strong>Eliminação (Direito ao Esquecimento):</strong> Solicitar a exclusão permanente dos seus dados (exceto quando a retenção for exigida por lei).</li>
              <li><strong>Revogação do Consentimento:</strong> Desistir, a qualquer momento, do consentimento para tratamento de dados que o exijam.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Canal de Comunicação do Titular e DPO</h2>
            <p>
              Para exercer qualquer um de seus direitos ou esclarecer dúvidas em relação à proteção dos seus dados, entre em contato com o nosso Encarregado de Proteção de Dados (DPO) através do endereço: <strong>dpo@learningenglishbr.com.br</strong> ou preenchendo o formulário em nossa aba de suporte. O prazo legal para atendimento dessas solicitações é de até 15 dias.
            </p>
          </section>
        </div>
      </main>
      <Footer description={siteContent.footer.description} copyright_text={siteContent.footer.copyright_text} columns={siteContent.footer.columns} social_links={siteContent.footer.social_links} />
    </div>
  )
}
