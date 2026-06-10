'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
   'Vitalício': 'Lifetime',
   'Certificado': 'Certificate',
   'Suporte VIP': 'VIP Support',
   'O Que Nossos Alunos Dizem': 'What Our Students Say',
   'Alunos Formados': 'Graduated Students',
   'Taxa de Satisfação': 'Satisfaction Rate',
   'Países Atendidos': 'Countries Served',
   'Avaliação Média': 'Average Rating',
   'Metodologia Moderna e Estratégica': 'Modern and Strategic Methodology',
   'Comece sua jornada rumo à fluência hoje.': 'Start your journey to fluency today.',
   'Quero Me Tornar Fluente': 'I Want to Become Fluent',
   'Últimos Artigos': 'Latest Articles',
   'Ver todo o Blog': 'View All Posts',
   'Conheça o Professor': 'Meet the Teacher',
   'Depoimento anterior': 'Previous testimonial',
   'Próximo depoimento': 'Next testimonial',
   'Em breve novos depoimentos serão adicionados.': 'New testimonials will be added soon.',
   'Artigo': 'Article',
   'Recentemente': 'Recently',
   'Professor': 'Professor',
   'foto': 'photo',
   'de': 'of',
   'Foto anterior': 'Previous photo',
   'Próxima foto': 'Next photo',
   'Ver foto': 'View photo',
   'Formação Acadêmica': 'Academic Background',
   'Tradutor Profissional': 'Professional Translator',
   'Pesquisador em Ensino de Línguas': 'Language Teaching Researcher',
   'Aprender': 'Learn',
   'Praticar': 'Practice',
   'Falar': 'Speak',
   'Formações Completas': 'Full Programs',
   'Como acelerar seu Listening': 'How to Accelerate Your Listening',
   'Vocabulário para Entrevistas': 'Vocabulary for Interviews',
   'Erros comuns de brasileiros': 'Common Mistakes Brazilians Make',
   'Fechar menu': 'Close menu',
   'Abrir menu': 'Open menu',
   'Respeitamos a sua Privacidade': 'We Respect Your Privacy',
   'Utilizamos cookies essenciais para o funcionamento seguro da plataforma (como login via Google) e cookies de analytics/marketing para aprimorar sua experiência.': 'We use essential cookies for the secure operation of the platform (such as Google login) and analytics/marketing cookies to enhance your experience.',
   'Ao continuar, você concorda com o uso de cookies em conformidade com o': 'By continuing, you agree to the use of cookies in accordance with',
   'e nossa': 'and our',
   'Recusar não essenciais': 'Reject non-essential',
   'Aceitar e Continuar': 'Accept and Continue',
   'Vídeo indisponível ou URL inválida.': 'Video unavailable or invalid URL.',
   'Entrar na Plataforma': 'Sign In to Platform',
   'Acesse seus cursos e materiais.': 'Access your courses and materials.',
   'Esqueceu a senha?': 'Forgot your password?',
   'Entrando...': 'Signing in...',
   'Entrar': 'Sign In',
   'Ou continue com': 'Or continue with',
   'Ainda não tem conta?': "Don't have an account yet?",
   'Cadastre-se': 'Sign Up',
   'Junte-se à English School Premium.': 'Join English School Premium.',
   'Nome Completo': 'Full Name',
   'Cadastrando...': 'Registering...',
   'Cadastrar': 'Register',
   'Ou cadastre-se com': 'Or sign up with',
   'Já tem uma conta?': 'Already have an account?',
   'Faça login': 'Sign In',
   'Recuperar Senha': 'Reset Password',
   'Enviaremos um link para redefinir sua senha.': 'We will send you a link to reset your password.',
   'Enviar Link': 'Send Link',
   'Lembrou a senha?': 'Remember your password?',
   'Voltar ao Login': 'Back to Login',
   'Complete seu Cadastro': 'Complete Your Registration',
   'Faltam poucos passos para você acessar a plataforma.': 'Just a few steps left to access the platform.',
   'CPF': 'CPF',
   'Telefone': 'Phone',
   'Endereço': 'Address',
   'CEP': 'ZIP Code',
   'Rua': 'Street',
   'Número': 'Number',
   'Complemento': 'Complement',
   'Bairro': 'Neighborhood',
   'Cidade': 'City',
   'Estado': 'State',
   'País': 'Country',
   'Aceito os': 'I accept the',
   'Salvando...': 'Saving...',
   'Completar Cadastro': 'Complete Registration',
   'Nossos Cursos': 'Our Courses',
   'Escolha o programa ideal para o seu nível e alcance a fluência com a nossa metodologia comprovada.': 'Choose the ideal program for your level and achieve fluency with our proven methodology.',
   'Carregando...': 'Loading...',
   'Acesso Vitalício': 'Lifetime Access',
   'Aprenda com o melhor método do mercado e alcance seus objetivos rapidamente.': 'Learn with the best method in the market and achieve your goals quickly.',
   'Comprar Agora': 'Buy Now',
   'Blog e Artigos sobre Inglês': 'Blog and Articles about English',
   'Blog e Artigos': 'Blog and Articles',
   'Conteúdos profundos, metodologias e dicas avançadas para você atingir a fluência real em inglês.': 'In-depth content, methodologies and advanced tips for you to achieve real fluency in English.',
   'Em breve novos artigos serão publicados.': 'New articles will be published soon.',
   'Ler mais': 'Read more',
   'Artigo não encontrado': 'Article not found',
   'Voltar ao Blog': 'Back to Blog',
   'Professor Especialista': 'Specialist Teacher',
   'Escrito por Vitor Brandino': 'Written by Vitor Brandino',
   'Professor especialista em fluência rápida e preparação para exames TOEFL e IELTS. Mais de 10 anos ajudando brasileiros a dominarem o inglês de verdade.': 'Specialist teacher in fast fluency and preparation for TOEFL and IELTS exams. Over 10 years helping Brazilians master real English.',
   'Ler biografia completa': 'Read full biography',
   'Portal do Aluno': 'Student Portal',
   'Meus Cursos': 'My Courses',
   'Histórico': 'History',
   'Meus Downloads': 'My Downloads',
   'Perfil': 'Profile',
   'Configurações': 'Settings',
   'Sair': 'Sign Out',
   'Alunos': 'Students',
   'Blog AI': 'Blog AI',
   'Produtos Digitais': 'Digital Products',
    'Learneng English BR. Todos os direitos reservados.': 'Learneng English BR. All rights reserved.',
  'E-mail': 'Email',
  'Senha': 'Password',
  'e a': 'and the',
  'Estamos preparando um conteúdo incrível para você.': "We're preparing amazing content for you.",
  'Maria Silva': 'Maria Silva',
  'João Santos': 'João Santos',
  'Ana Oliveira': 'Ana Oliveira',
  'Aluna': 'Student',
  'Aluno': 'Student',
  'Método incrível! Consegui finalmente destravar meu inglês.': 'Amazing method! I finally unlocked my English.',
  'As aulas ao vivo fizeram toda a diferença no meu aprendizado.': 'The live classes made all the difference in my learning.',
  'Professor extremamente capacitado. Recomendo demais!': 'Extremely capable teacher. Highly recommend!',
}

interface LanguageContextType {
  locale: Language
  setLocale: (l: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('pt')

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Language | null
    if (stored === 'en' || stored === 'pt') {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = (l: Language) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

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
