import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cursos de Inglês Online',
  description:
    'Explore nossos cursos de inglês do básico ao avançado. Metodologia comprovada, acesso vitalício e suporte personalizado com o professor Vitor Brandino.',
  openGraph: {
    title: 'Cursos de Inglês Online | LearningEnglishBR',
    description:
      'Programas intensivos desenhados para máxima retenção e aplicação prática no mundo real.',
  },
}

export default async function PublicCoursesPage() {
  const supabase = await createClient()

  // Busca todos os cursos publicados
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Cursos</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Escolha o programa ideal para o seu nível e alcance a fluência com a nossa metodologia comprovada.
            </p>
          </div>
        </section>

        {/* Lista de Cursos */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          {!courses || courses.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Novos cursos em breve</h2>
              <p className="text-muted-foreground">Estamos preparando um conteúdo incrível para você.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  {/* Thumbnail Placeholder */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary opacity-50" />
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                      <span className="font-medium text-foreground">5.0</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" /> Acesso Vitalício
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h2>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                      {course.description || "Aprenda com o melhor método do mercado e alcance seus objetivos rapidamente."}
                    </p>
                    
                    <div className="mt-auto border-t border-border pt-4 flex items-center justify-between">
                      <div className="font-bold text-2xl text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                      </div>
                      
                      {/* O botão de comprar chama a API do Stripe que já existe no Hero ou redireciona pro login/checkout */}
                      {/* Como não temos a página de checkout direto conectada ao ID do curso ainda, vamos mandar o cliente contatar ou ir pra Home. */}
                      <Link 
                        href="/login" 
                        className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                        title="Comprar Agora"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
