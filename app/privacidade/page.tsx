import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Política de Privacidade | LearningEnglishBR',
  description: 'Política de privacidade e tratamento de dados da plataforma LearningEnglishBR.',
}

export default async function PrivacyPolicyPage() {
  const siteContent = await getSiteContent()
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header navigation={siteContent.header.navigation} social_links={siteContent.header.social_links} logo_text={siteContent.header.logo_text} />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p>
              A privacidade e a segurança dos seus dados são fundamentais para a <strong>LearningEnglishBR</strong>. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos as suas informações pessoais quando você acessa e utiliza a nossa plataforma de cursos de inglês, bem como ao realizar login com provedores externos como o Google.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Dados que Coletamos</h2>
            <p className="mb-4">Podemos coletar as seguintes categorias de dados pessoais:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de Registro:</strong> Nome completo, endereço de e-mail e senha (se aplicável).</li>
              <li><strong>Login com Google:</strong> Ao optar por fazer login através do Google (OAuth), coletaremos seu endereço de e-mail primário, nome completo e foto de perfil, unicamente para fins de autenticação e criação de perfil na plataforma.</li>
              <li><strong>Dados de Pagamento:</strong> Informações de faturamento geradas durante a compra de nossos cursos (processadas de forma segura por gateways de pagamento terceirizados).</li>
              <li><strong>Dados de Uso:</strong> Informações sobre como você interage com a plataforma (aulas assistidas, progresso, acessos).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Usamos as Informações</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Para fornecer, operar e manter os cursos adquiridos.</li>
              <li>Para gerenciar sua conta de usuário e facilitar o processo de login (incluindo login social via Google).</li>
              <li>Para processar pagamentos de forma segura e realizar suporte financeiro/reembolsos.</li>
              <li>Para enviar comunicações importantes, como atualizações da plataforma, recibos, redefinições de senha e notificações de suporte.</li>
              <li>Para melhorar a experiência educacional e personalizar o conteúdo de acordo com o seu progresso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Dados</h2>
            <p>
              A LearningEnglishBR <strong>não vende</strong>, aluga ou comercializa os seus dados pessoais. Compartilhamos informações apenas com prestadores de serviços estritamente necessários para a operação do site, como provedores de infraestrutura em nuvem, gateways de pagamento e plataformas de envio de e-mails, sempre exigindo altos padrões de segurança e conformidade com a legislação aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais rígidas (como criptografia e conexões seguras HTTPS) para proteger as suas informações contra acesso não autorizado, alteração, divulgação ou destruição acidental.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Retenção e Exclusão de Conta</h2>
            <p>
              Manteremos os seus dados enquanto sua conta estiver ativa ou enquanto for necessário para lhe fornecer os serviços e cumprir nossas obrigações legais. Você pode solicitar a <strong>exclusão completa</strong> da sua conta e de todos os seus dados a qualquer momento enviando um e-mail para o nosso suporte ou utilizando as opções no painel da sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contato</h2>
            <p>
              Se você tiver dúvidas sobre nossa Política de Privacidade, entre em contato através da nossa página de suporte ou envie-nos um e-mail diretamente.
            </p>
          </section>
        </div>
      </main>
      <Footer description={siteContent.footer.description} copyright_text={siteContent.footer.copyright_text} columns={siteContent.footer.columns} social_links={siteContent.footer.social_links} />
    </div>
  )
}
