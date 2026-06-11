'use client'

import { motion } from 'framer-motion'
import { Brain, MessageSquare, Globe, UserCheck, BookOpen } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-8 h-8 text-primary" />,
  MessageSquare: <MessageSquare className="w-8 h-8 text-blue-500" />,
  Globe: <Globe className="w-8 h-8 text-emerald-500" />,
  UserCheck: <UserCheck className="w-8 h-8 text-amber-500" />,
}

interface WhyChooseProps {
  title: string
  items: Array<{ icon_name: string; title: string; description: string }>
}

export function WhyChoose({ title, items }: WhyChooseProps) {
  const { t } = useLanguage()

  if (items.length === 0) return null

  return (
    <section id="por-que" className="py-20 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {(() => {
              const rawTitle = t(title);
              const brandNameMarkup = (
                <>
                  <span className="text-red-600">Learn</span>{' '}
                  <span className="text-[#0d1e3e]">English</span>{' '}
                  <span className="text-red-600">BR</span>
                </>
              );
              const parts = rawTitle.split('Learn English BR');
              return (
                <>{parts[0]}{brandNameMarkup}{parts[1] ?? ''}</>
              );
            })()}
          </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {iconMap[item.icon_name] || <BookOpen className="w-8 h-8 text-primary" />}
              <h3 className="mt-4 text-xl font-semibold">{t(item.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(item.description)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}