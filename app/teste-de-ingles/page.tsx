import { User, FileText, Award, ChevronRight, HelpCircle, Clock, CheckCircle, BarChart3, BookOpen, MessageCircle, ArrowRight, Star, Sparkles, Target, Zap, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Teste de Nível de Inglês Gratuito | Descubra seu CEFR | LearningEnglishBR',
  description: 'Faça nosso teste de nível de inglês gratuito e descubra seu nível CEFR (A1 a C2). Avaliação completa de gramática, vocabulário e leitura. Resultado imediato!',
  keywords: [
    'teste de nível de inglês',
    'teste de inglês gratuito',
    'nível de inglês',
    'CEFR',
    'teste CEFR',
    'avaliação de inglês',
    'saber meu nível de inglês',
    'teste de proficiência em inglês',
    'A1 A2 B1 B2 C1 C2',
    'LearningEnglishBR',
  ],
  openGraph: {
    title: 'Teste de Nível de Inglês Gratuito | Descubra seu CEFR',
    description: 'Faça nossa avaliação gratuita e descubra exatamente em qual nível CEFR você está, do iniciante ao avançado.',
    url: '/teste-de-ingles',
    siteName: 'LearningEnglishBR',
    locale: 'pt_BR',
    type: 'website',
  },
}

const cefrLevels = [
  { code: 'A1', name: 'Iniciante', description: 'Você entende e usa expressões básicas do dia a dia. Consegue se apresentar e fazer perguntas simples.', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', width: 'w-1/6' },
  { code: 'A2', name: 'Básico', description: 'Consegue se comunicar em tarefas simples e rotineiras. Entende frases e expressões frequentes.', color: 'from-orange-400 to-yellow-500', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', width: 'w-2/6' },
  { code: 'B1', name: 'Intermediário', description: 'Você é capaz de lidar com a maioria das situações em viagens. Produz textos simples e conectados.', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', width: 'w-3/6' },
  { code: 'B2', name: 'Intermediário Superior', description: 'Comunica-se com fluência e naturalidade. Entende ideias principais de textos complexos.', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300', width: 'w-4/6' },
  { code: 'C1', name: 'Avançado', description: 'Você se expressa de forma fluente e espontânea. Usa a língua de forma flexível e eficaz.', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', width: 'w-5/6' },
  { code: 'C2', name: 'Proficiente', description: 'Compreende com facilidade praticamente tudo que ouve ou lê. Domínio completo do idioma.', color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', width: 'w-full' },
]

const steps = [
  { icon: User, title: 'Informe seus dados', description: 'Cadastre seu nome e email para começar a avaliação.' },
  { icon: FileText, title: 'Responda as questões', description: '40 questões de gramática, vocabulário e interpretação de texto.' },
  { icon: Award, title: 'Receba seu resultado', description: 'Descubra seu nível CEFR com uma análise completa e detalhada.' },
]

const testimonials = [
  { quote: 'Finalmente descobri meu nível real. O teste é muito completo e preciso!', author: 'Maria S.' },
  { quote: 'Achei que era B1, mas na verdade sou B2! Me ajudou a escolher o curso certo.', author: 'João P.' },
  { quote: 'Teste muito profissional. Recomendo para todos que querem saber seu nível.', author: 'Ana C.' },
]

const faqItems = [
  { question: 'Quanto tempo leva?', answer: 'Aproximadamente 25 minutos.' },
  { question: 'Preciso pagar?', answer: 'Não, é completamente gratuito.' },
  { question: 'Recebo certificado?', answer: 'Sim, você pode compartilhar seu resultado.' },
  { question: 'Posso fazer mais de uma vez?', answer: 'Sim, quantas vezes quiser.' },
]

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
      {children}
    </span>
  )
}

export default function TesteDeInglesPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-background overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen pointer-events-none" />
          <div className="absolute top-40 -left-40 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] lg:w-[1000px] h-[300px] lg:h-[400px] bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-medium mb-4 sm:mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Avaliação Gratuita
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 sm:mb-4">
              Descubra Seu{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Verdadeiro Nível
              </span>{' '}
              de Inglês
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-5 leading-relaxed">
              Faça nossa avaliação gratuita e descubra exatamente em qual nível você está, do iniciante ao avançado.
            </p>
            <Link
              href="/teste-de-ingles/iniciar"
              className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-primary px-6 sm:px-8 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/25 gap-2"
            >
              Começar Avaliação Gratuita
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
              <div className="flex -space-x-2.5 sm:-space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 sm:gap-1 fill-secondary text-secondary">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-secondary text-secondary" />)}
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">+2.000 alunos já testaram</p>
              </div>
            </div>
          </div>

          {/* CEFR Levels Visual */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex rounded-xl overflow-hidden h-10 shadow-lg shadow-black/10">
              {cefrLevels.map((level) => (
                <div
                  key={level.code}
                  className={`flex items-center justify-center text-xs md:text-sm font-bold text-white bg-gradient-to-r ${level.color} ${level.width} transition-all duration-300 hover:opacity-90 hover:flex-1 cursor-default`}
                >
                  {level.code}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Iniciante</span>
              <span>Intermediário</span>
              <span>Avançado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Como <GradientText>Funciona</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em apenas 3 passos simples você descobre seu nível de inglês.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 z-10 items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-border text-muted-foreground">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Níveis Section */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Conheça os <GradientText>Níveis CEFR</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              O Quadro Europeu Comum de Referência para Línguas (CEFR) é o padrão internacional para medir proficiência em inglês.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cefrLevels.map((level) => (
              <div
                key={level.code}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center gap-2 text-lg font-black ${level.text} mb-3`}>
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${level.color}`}></span>
                  {level.code}
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{level.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              O Que Nossos Alunos <GradientText>Dizem</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja os depoimentos de quem já fez o teste.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <blockquote className="text-foreground/90 mb-6 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {item.author.charAt(0)}
                  </div>
                  <div className="font-semibold text-sm">{item.author}</div>
                </div>
                <div className="absolute top-6 right-6 text-6xl text-primary/5 leading-none select-none">&ldquo;</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Perguntas <GradientText>Frequentes</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre o teste de nível.
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 open:shadow-md"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-bold text-lg hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    {item.question}
                  </span>
                  <ChevronRight className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:rotate-90 text-muted-foreground" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-muted-foreground border-t border-border pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden bg-background">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
          <div className="relative max-w-5xl mx-auto bg-[#0a1120] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-16 lg:p-24 overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8 sm:mb-10 shadow-inner">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
                Pronto para descobrir seu nível?
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 text-blue-100/70 max-w-3xl mx-auto leading-relaxed">
                Faça agora o teste gratuito e descubra exatamente onde você está na sua jornada de aprendizado de inglês.
              </p>

              <Link
                href="/teste-de-ingles/iniciar"
                className="group relative inline-flex h-14 sm:h-16 items-center justify-center rounded-full bg-white text-[#0a1120] px-8 sm:px-10 text-base sm:text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20 gap-2"
              >
                <span>Começar Avaliação Gratuita</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-6 mt-10 text-blue-200/60 text-sm">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Sem cadastro</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 100% gratuito</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Resultado imediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
