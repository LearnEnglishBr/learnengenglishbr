import { Phone, Mail, Clock, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Central de Ajuda e Contato | LearnEnglishBR',
  description: 'Precisa de ajuda? Entre em contato com nossa equipe de suporte pelo WhatsApp ou e-mail. Estamos aqui para garantir que você tenha a melhor experiência.',
}

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Como podemos te ajudar?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nossa equipe de especialistas está pronta para tirar todas as suas dúvidas e acelerar o seu aprendizado no inglês.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* WhatsApp Card */}
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageCircle className="w-32 h-32" />
              </div>
              <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Atendimento via WhatsApp</h2>
              <p className="text-muted-foreground mb-6">
                Fale diretamente com um especialista da nossa equipe. O atendimento é rápido e direto ao ponto.
              </p>
              <div className="flex items-center gap-3 text-lg font-bold mb-8 text-foreground">
                <Phone className="w-5 h-5 text-green-600" />
                +55 43 8818-3381
              </div>
              <a 
                href="https://wa.me/554388183381?text=Olá!%20Gostaria%20de%20ajuda%20com%20a%20plataforma%20LearnEnglishBR." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full"
              >
                Chamar no WhatsApp
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Mail className="w-32 h-32" />
              </div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Suporte por E-mail</h2>
              <p className="text-muted-foreground mb-6">
                Prefere enviar um e-mail? Sem problemas. Responderemos o mais rápido possível (geralmente em até 24h úteis).
              </p>
              <div className="flex items-center gap-3 text-lg font-medium mb-8 text-foreground">
                <Mail className="w-5 h-5 text-primary" />
                suporte@learnenglishbr.com.br
              </div>
              <a 
                href="mailto:suporte@learnenglishbr.com.br"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 px-6 rounded-xl transition-colors w-full"
              >
                Enviar E-mail
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Dúvidas Frequentes Rápidas */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Dúvidas Frequentes Rápidas</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Qual é o horário de atendimento?</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Segunda a Sexta, das 09h às 18h (Horário de Brasília).
                </p>
              </div>
              <hr className="border-border" />
              <div>
                <h3 className="font-bold text-lg mb-2">Como solicito reembolso?</h3>
                <p className="text-muted-foreground">
                  Se você estiver dentro do prazo de garantia de 7 dias, basta entrar em contato conosco pelo WhatsApp ou e-mail acima que processaremos o seu reembolso de imediato, sem burocracia. Para mais detalhes, veja nossa <Link href="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link>.
                </p>
              </div>
              <hr className="border-border" />
              <div>
                <h3 className="font-bold text-lg mb-2">Esqueci minha senha, o que fazer?</h3>
                <p className="text-muted-foreground">
                  Basta ir na página de <Link href="/login" className="text-primary hover:underline">Login</Link> e clicar em "Esqueci minha senha". Enviaremos um link de recuperação diretamente para o seu e-mail cadastrado.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
