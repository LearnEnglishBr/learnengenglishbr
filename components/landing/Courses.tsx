'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface CoursesSectionProps {
  title: string
  subtitle: string
  badge_text: string
  feature_1: string
  feature_2: string
  feature_3: string
  button_text: string
  courses: Array<{
    id: string
    title: string
    description: string | null
    price: number
    slug: string
    thumbnail: string | null
  }>
}

export function Courses({ title, subtitle, badge_text, feature_1, feature_2, feature_3, button_text, courses }: CoursesSectionProps) {
  const { t, locale } = useLanguage()
  return (
    <section id="cursos" className="py-24 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">{t('Novos cursos em breve')}</h3>
            <p className="text-muted-foreground">{t('Estamos preparando conteúdo incrível para você.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 group-hover:scale-105 transition-transform duration-500"></div>
                  )}
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    {badge_text}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                    <span className="font-medium text-foreground">5.0</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" /> {feature_1}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h2>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                    {course.description || t('Aprenda com o melhor método do mercado.')}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">{feature_1}</span>
                    <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">{feature_2}</span>
                    <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">{feature_3}</span>
                  </div>
                  
                  <div className="mt-auto border-t border-border pt-4 flex items-center justify-between">
                    <div className="font-bold text-2xl text-primary">
                      {new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                    </div>
                    <Link 
                      href="/login" 
                      className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                      title={button_text}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
