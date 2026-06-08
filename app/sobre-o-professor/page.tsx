import Image from 'next/image'
import Link from 'next/link'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Award, BookOpen, GraduationCap, Users } from 'lucide-react'

export const metadata = {
  title: 'Sobre o Professor Vitor Brandino | LearningEnglishBR',
  description: 'Conheça Vitor Brandino, especialista em fluência rápida e preparação para exames internacionais como TOEFL e IELTS. Mais de 10 anos de experiência transformando o inglês de brasileiros.',
}

export default function SobreOProfessorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vitor Brandino',
    jobTitle: 'Professor de Inglês Especialista',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/sobre-o-professor`,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/images/professor.jpg`,
    sameAs: [
      'https://www.instagram.com/prof_vitor1',
      'https://youtube.com/@teachervitor-learnenglishbr',
      'https://www.tiktok.com/@learnenglishbr',
    ],
    knowsAbout: ['English Language', 'TOEFL', 'IELTS', 'Business English', 'Fluency'],
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'LearningEnglishBR',
    },
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SchemaMarkup schema={schema} />
      
      {/* Header */}
      <section className="bg-primary/5 pt-32 pb-20 px-6 border-b border-border relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10">
          <Breadcrumbs items={[{ label: 'Sobre o Professor', href: '/sobre-o-professor' }]} />
          
          <div className="flex flex-col md:flex-row items-center gap-12 mt-8">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-background shadow-xl flex-shrink-0 bg-accent relative">
              {/* O usuário deve enviar uma foto para /public/images/professor.jpg depois */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium text-sm text-center px-4">
                [Adicionar imagem em /public/images/professor.jpg]
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">Vitor Brandino</h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-medium">
                Especialista em Fluência Rápida e Certificações Internacionais.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm font-bold border border-border shadow-sm">
                  <GraduationCap className="w-4 h-4 text-primary" /> +10 Anos de Experiência
                </span>
                <span className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm font-bold border border-border shadow-sm">
                  <Award className="w-4 h-4 text-primary" /> Preparatório TOEFL/IELTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Minha Missão</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Acredito que o inglês não deve ser uma barreira, mas sim uma ponte para o seu sucesso profissional e pessoal. Com mais de uma década dedicada ao ensino, desenvolvi uma metodologia focada naquilo que realmente importa: a comunicação efetiva, destravar a fala e atingir a confiança necessária para participar de reuniões e viagens internacionais.
            </p>

            <h3 className="text-2xl font-bold mb-6 mt-12">Por que estudar comigo?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 not-prose">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <BookOpen className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-bold mb-2">Metodologia Direta</h4>
                <p className="text-muted-foreground text-sm">Sem enrolação. Foco em estruturas de alta frequência para você falar mais rápido.</p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-bold mb-2">Milhares de Alunos</h4>
                <p className="text-muted-foreground text-sm">Uma comunidade crescente de brasileiros que superaram o medo de falar.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-6 mt-12">Certificações e Exames (TOEFL / IELTS)</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Se o seu objetivo é morar fora ou aplicar para mestrados no exterior, eu posso te ajudar. Conheço intimamente a estrutura das principais provas de proficiência e ensino as estratégias exatas para maximizar o seu "score" (pontuação) na parte do Speaking e do Writing.
            </p>
          </div>

          <div className="mt-16 bg-primary/10 rounded-3xl p-8 md:p-12 text-center border border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para dar o próximo passo?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se à plataforma LearningEnglishBR e comece a transformar o seu futuro hoje mesmo.
            </p>
            <Link 
              href="/#cursos" 
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-primary/25"
            >
              Conhecer os Cursos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
