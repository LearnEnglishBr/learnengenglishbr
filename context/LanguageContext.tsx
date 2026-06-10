'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type Language = 'pt' | 'en'

const en: Record<string, string> = {
  'PT': 'EN',
  'Login': 'Login',
  'Criar Conta': 'Sign Up',
  'Desenvolvido com padrão Enterprise': 'Built with enterprise standards',
  'Orgulhosamente desenvolvido por': 'Proudly developed by',
  'Voltris': 'Voltris',
  'Por que escolher a': 'Why choose',
  'Método baseado em neurociência': 'Neuroscience-based method',
  'Estruturado para otimizar a retenção e acelerar a fluência.': 'Structured to optimize retention and accelerate fluency.',
  'Prática real de conversação': 'Real conversation practice',
  'Aulas ao vivo com feedback imediato para melhorar a fala.': 'Live classes with immediate feedback to improve speaking.',
  'Acesso global': 'Global access',
  'Estude a qualquer hora, em qualquer lugar, no seu ritmo.': 'Study anytime, anywhere, at your own pace.',
  'Acompanhamento personalizado': 'Personalized monitoring',
  'Monitoramento de progresso e ajustes contínuos ao seu plano.': 'Progress tracking and continuous adjustments to your plan.',
  'Começar Agora': 'Start Now',
  'Ver Método': 'See Method',
  'Matricular': 'Enroll',
  'Aulas ao vivo': 'Live classes',
  'Suporte individual': 'One-on-one support',
  'Acompanhamento de progresso': 'Progress tracking',
  'Acesso vitalício': 'Lifetime access',
  'Início': 'Home',
  'Cursos': 'Courses',
  'Metodologia': 'Methodology',
  'Resultados': 'Results',
  'Depoimentos': 'Testimonials',
  'Blog': 'Blog',
  '+2.500 alunos satisfeitos': '+2,500 satisfied students',
  'Aprenda': 'Learn',
  'Pratique': 'Practice',
  'Converse': 'Speak',
  'Fluência': 'Fluency',
  'Aulas teóricas de alta qualidade direto ao ponto, com foco na vida real.': 'High-quality straight-to-the-point theoretical lessons focused on real life.',
  'Exercícios focados e gamificados para retenção extrema e memória de longo prazo.': 'Focused gamified exercises for extreme retention and long-term memory.',
  'Sessões de conversação ao vivo para destravar o seu speaking.': 'Live conversation sessions to unlock your speaking.',
  'Domínio avançado do inglês, reconhecido globalmente.': 'Advanced English mastery, globally recognized.',
  'Mais de 2.500 alunos transformados': 'More than 2,500 students transformed',
  'Domine o Inglês. Transforme seu Futuro.': 'Master English. Transform Your Future.',
  'A Central de Ajuda': 'Help Center',
  'Fale Conosco': 'Contact Us',
  'Termos de Uso': 'Terms of Use',
  'Política de Privacidade': 'Privacy Policy',
  'Política de Cookies': 'Cookie Policy',
  'Conformidade LGPD': 'LGPD Compliance',
  'Reembolso e Cancelamento': 'Refund and Cancellation',
  'Plataforma': 'Platform',
  'Suporte': 'Support',
  'Legal': 'Legal',
  'Cursos de Inglês Online': 'Online English Courses',
   'Sobre o Professor': 'About the Teacher',
   'Novos cursos em breve': 'New courses coming soon',
   'Estamos preparando conteúdo incrível para você.': "We're preparing amazing content for you.",
   'Aprenda com o melhor método do mercado.': 'Learn with the best method in the market.',
}

interface LanguageContextType {
  locale: Language
  setLocale: (l: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>('pt')

  const t = (key: string): string => {
    if (locale === 'en' && en[key]) return en[key]
    return key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
