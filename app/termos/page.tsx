import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | LearningEnglishBR',
  description: 'Termos de Serviço e Condições de Uso da plataforma de ensino LearningEnglishBR.',
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Termos e Condições de Uso
          </h1>
          <p className="text-muted-foreground">Regras e responsabilidades no uso da plataforma educacional.</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar, se cadastrar ou efetuar uma compra na plataforma <strong>LearningEnglishBR</strong>, operada e administrada pelo Prof. Vitor Brandino, você atesta que leu, compreendeu e concordou integralmente com estes Termos de Uso. Caso não concorde com qualquer cláusula deste documento, você não deverá utilizar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Direitos de Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponibilizado na plataforma (incluindo, sem limitação, videoaulas, textos, planilhas, PDFs, marcas, designs, código e software) é propriedade exclusiva da LearningEnglishBR ou de seus licenciadores. O uso não autorizado, compartilhamento de senhas, cópia, gravação de tela, distribuição ou revenda dos materiais <strong>constitui violação direta de direitos autorais</strong>, estando o infrator sujeito a sanções civis e criminais, além da rescisão imediata e definitiva de sua conta sem direito a qualquer tipo de reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Conta de Usuário</h2>
            <p>
              Para acessar os cursos, o usuário deverá criar uma conta (via formulário ou provedor de identidade, como o Google). O acesso à plataforma é <strong>pessoal e intransferível</strong>. É responsabilidade exclusiva do aluno manter a confidencialidade de sua senha e notificar imediatamente o suporte sobre qualquer uso não autorizado de sua conta. O sistema monitora logins múltiplos simultâneos em diferentes IPs e pode bloquear preventivamente o acesso em casos suspeitos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Obrigações do Usuário</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar a plataforma apenas para fins educacionais lícitos.</li>
              <li>Não tentar realizar engenharia reversa, acessar sistemas internos ou interferir nas operações de segurança da plataforma.</li>
              <li>Fornecer informações verdadeiras, atualizadas e completas no momento da compra e cadastro.</li>
              <li>Manter um ambiente de respeito cívico nos canais de suporte, áreas de comentários (se houver) e grupos externos vinculados ao curso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disponibilidade da Plataforma</h2>
            <p>
              A LearningEnglishBR se compromete a empregar os melhores esforços para garantir que a plataforma fique disponível 24 horas por dia, 7 dias por semana. No entanto, o acesso poderá ser temporariamente interrompido devido a atualizações agendadas, manutenções, falhas em provedores de hospedagem ou casos fortuitos/força maior. Tais interrupções não darão direito a compensações financeiras ou abatimentos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, visando melhorias técnicas ou adequações legais. Os usuários ativos serão notificados sobre as mudanças substanciais através de banners na plataforma ou e-mails. O uso contínuo após as modificações implicará o consentimento dos novos Termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Foro de Eleição</h2>
            <p>
              Fica eleito o foro da comarca da sede administrativa da LearningEnglishBR para dirimir quaisquer litígios oriundos deste Termo ou do uso da plataforma, com expressa renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
