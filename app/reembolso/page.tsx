import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Reembolso | LearningEnglishBR',
  description: 'Política de cancelamento e reembolso dos cursos da LearningEnglishBR.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Header />
      <main className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Política de Reembolso e Cancelamento
          </h1>
          <p className="text-muted-foreground">Transparência nas devoluções e direito de arrependimento.</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Direito de Arrependimento (Garantia de 7 Dias)</h2>
            <p>
              Na <strong>LearningEnglishBR</strong>, temos total confiança na qualidade da nossa metodologia. Em total conformidade com o Artigo 49 do Código de Defesa do Consumidor (CDC) brasileiro, garantimos o <strong>Direito de Arrependimento</strong>.
            </p>
            <div className="bg-muted p-6 rounded-lg mt-6 border border-border">
              <p className="font-medium text-foreground">
                Se você adquirir qualquer um de nossos cursos e decidir que ele não é o ideal para você, poderá solicitar o cancelamento e a devolução integral (100%) do valor pago, <strong>desde que a solicitação seja feita no prazo máximo de 7 (sete) dias corridos</strong>, contados a partir da data de aprovação da compra.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Solicitação Fora do Prazo</h2>
            <p>
              Solicitações de cancelamento ou estorno efetuadas <strong>após o prazo estrito de 7 dias</strong> corridos não serão aceitas sob nenhuma circunstância. Após este período, o serviço é considerado prestado, o acesso ao material continuará ativo até o fim do ciclo contratado (seja assinatura mensal, anual ou acesso vitalício, conforme o produto) e nenhum valor parcial ou total será devolvido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Solicitar o Reembolso</h2>
            <p className="mb-4">O processo de cancelamento é feito sem burocracia. Para acionar a sua garantia dentro do prazo de 7 dias, basta seguir os seguintes passos:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Envie um e-mail para o nosso suporte formalizando a solicitação de cancelamento.</li>
              <li>Informe no e-mail o endereço cadastrado na plataforma e o número do recibo da transação.</li>
              <li>Nossa equipe processará o cancelamento da sua conta na plataforma e submeterá a ordem de devolução ao intermediador de pagamento no prazo de até 2 dias úteis.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prazos para Processamento do Estorno</h2>
            <p>
              O tempo necessário para que o valor retorne à sua conta dependerá do método de pagamento utilizado na compra:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Cartão de Crédito:</strong> O estorno poderá demorar de 1 a 2 faturas subsequentes para constar no extrato, de acordo com as regras da administradora do seu cartão.</li>
              <li><strong>PIX ou Boleto:</strong> O reembolso será transferido diretamente para a conta bancária do titular da compra em até 10 dias úteis após a aprovação do estorno pela nossa equipe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cancelamento de Assinaturas Recorrentes</h2>
            <p>
              Se você possui uma assinatura recorrente, pode cancelar as próximas cobranças a qualquer momento através do seu painel de usuário. O cancelamento da assinatura interromperá as cobranças futuras, mas manterá seu acesso à plataforma ativo até o término do ciclo já pago. O cancelamento das cobranças futuras não confere o direito a reembolso dos meses já faturados e utilizados.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
