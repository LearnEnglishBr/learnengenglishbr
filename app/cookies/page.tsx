import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | LearningEnglishBR',
  description: 'Como utilizamos cookies e tecnologias de rastreamento na plataforma LearningEnglishBR.',
}

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Política de Cookies
          </h1>
          <p className="text-muted-foreground">Entenda como utilizamos tecnologias de rastreamento.</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto que são armazenados no seu navegador ou dispositivo móvel (computador, smartphone, tablet) quando você visita o nosso site. Eles desempenham um papel essencial para permitir que plataformas modernas funcionem corretamente, armazenando preferências e auxiliando na segurança das sessões.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como e por que utilizamos Cookies</h2>
            <p className="mb-4">
              A <strong>LearningEnglishBR</strong> utiliza essas tecnologias em conformidade com as diretrizes do Google (Consent Mode v2) e da Lei Geral de Proteção de Dados (LGPD). Nossos cookies são divididos nas seguintes categorias:
            </p>
            <ul className="space-y-4">
              <li className="bg-muted p-4 rounded-lg border border-border">
                <strong className="text-foreground block mb-1">Cookies Estritamente Necessários (Essenciais)</strong>
                São fundamentais para o funcionamento da plataforma. Permitem que você faça login de forma segura (inclusive utilizando sua conta Google), acesse as áreas exclusivas de alunos e realizem compras. Sem eles, o site não funcionaria. <em>Eles não podem ser desativados.</em>
              </li>
              <li className="bg-muted p-4 rounded-lg border border-border">
                <strong className="text-foreground block mb-1">Cookies de Desempenho (Analytics)</strong>
                Coletam informações anônimas sobre como os visitantes utilizam o site (ex: páginas mais acessadas, tempo de permanência, mensagens de erro). Usamos o <strong>Google Analytics</strong> para nos ajudar a melhorar o desempenho e a estrutura da plataforma.
              </li>
              <li className="bg-muted p-4 rounded-lg border border-border">
                <strong className="text-foreground block mb-1">Cookies de Publicidade (Marketing)</strong>
                Usados para fornecer anúncios e conteúdos mais relevantes para você. Eles lembram que você visitou nosso site (via Google Ads ou Meta Ads) e podem ser compartilhados com essas organizações para que campanhas sejam mais assertivas, sem identificar os usuários individualmente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Consentimento para Serviços do Google</h2>
            <p>
              Para respeitar rigorosamente as políticas de desenvolvedor do Google (Google API Services User Data Policy e Consent Mode), nós não enviamos dados de rastreamento não essenciais ao Google Analytics ou Google Ads até que você forneça o consentimento no nosso banner de navegação inicial. O login social (Google OAuth) requer exclusivamente cookies de sessão necessários para a sua segurança, sem fins de rastreamento publicitário.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Como gerenciar e excluir seus Cookies</h2>
            <p className="mb-4">
              Você pode alterar suas preferências de cookies a qualquer momento gerenciando as configurações do seu próprio navegador. Abaixo, listamos os links oficiais de ajuda para os navegadores mais populares:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
              <li><a href="https://support.mozilla.org/pt-BR/kb/desative-cookies-terceiros-impedir-rastreamento" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/pt-br/windows/excluir-e-gerenciar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
            </ul>
            <p className="mt-4 text-sm">
              *Atenção: Ao desativar ou limpar os cookies essenciais, é possível que você precise refazer seu login ou que algumas áreas interativas da plataforma fiquem inacessíveis.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
