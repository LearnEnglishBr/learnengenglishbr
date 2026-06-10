'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Star } from 'lucide-react'
import { createCheckoutSessionAction } from '@/actions/stripe'

export default function PublicCoursesPage() {
  const { t, locale } = useLanguage()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [coursesRes, headerRes, footerRes, navRes, socialRes] = await Promise.all([
        supabase.from('courses').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }),
        supabase.from('site_content').select('value').eq('key', 'header').single(),
        supabase.from('site_content').select('value').eq('key', 'footer').single(),
        supabase.from('site_navigation').select('*').order('sort_order'),
        supabase.from('social_links').select('*').order('sort_order'),
      ])
      setCourses(coursesRes.data || [])
      const headerVal = headerRes.data?.value || { logo_text: 'Learneng', navigation: [], social_links: [] }
      const footerVal = footerRes.data?.value || { description: '', copyright_text: '', columns: [], social_links: [] }
      setContent({
        header: headerVal,
        footer: footerVal,
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('Carregando...')}</p></div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header navigation={content.header.navigation || []} social_links={content.header.social_links || []} logo_text={content.header.logo_text || 'Learneng'} />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('Nossos Cursos')}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('Escolha o programa ideal para o seu nível e alcance a fluência com a nossa metodologia comprovada.')}
            </p>
          </div>
        </section>

        <section className="py-20 px-4 max-w-6xl mx-auto">
          {!courses || courses.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">{t('Novos cursos em breve')}</h2>
              <p className="text-muted-foreground">{t('Estamos preparando um conteúdo incrível para você.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary opacity-50" />
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                      <span className="font-medium text-foreground">5.0</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" /> {t('Acesso Vitalício')}
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{t(course.title)}</h2>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                      {course.description ? t(course.description) : t('Aprenda com o melhor método do mercado e alcance seus objetivos rapidamente.')}
                    </p>
                    
                    <div className="mt-auto border-t border-border pt-4 flex items-center justify-between">
                      <div className="font-bold text-2xl text-primary">
                        {new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                      </div>
                      
                      <form action={createCheckoutSessionAction.bind(null, course.id, course.title, Number(course.price))}>
                        <button type="submit" className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors" title={t('Comprar Agora')}>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer description={content.footer.description || ''} copyright_text={content.footer.copyright_text || ''} columns={content.footer.columns || []} social_links={content.footer.social_links || []} />
    </div>
  )
}
