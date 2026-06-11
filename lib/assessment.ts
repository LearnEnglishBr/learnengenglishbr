export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type QuestionCategory = 'GRAMMAR' | 'VOCABULARY' | 'READING' | 'LISTENING' | 'WRITING'

export interface Option {
  id: string
  optionText: string
  isCorrect: boolean
  position: number
}

export interface Question {
  id: string
  question: string
  explanation: string
  cefrLevel: CefrLevel
  category: QuestionCategory
  difficulty: number
  position: number
  options: Option[]
}

export interface TestResult {
  cefrLevel: CefrLevel
  minScore: number
  maxScore: number
  title: string
  description: string
  recommendation: string
  badgeText: string
}

export interface AttemptAnswer {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
}

export interface Attempt {
  leadName: string
  leadEmail: string
  leadPhone?: string
  answers: AttemptAnswer[]
}

export interface CategoryBreakdown {
  category: string
  correct: number
  total: number
  percent: number
}

export interface AssessmentResult {
  cefrLevel: CefrLevel
  scorePercent: number
  correctAnswers: number
  totalQuestions: number
  categoryBreakdown: CategoryBreakdown[]
  strengths: string[]
  weaknesses: string[]
  recommendation: string
  feedback: string
  badgeText: string
}

export const CEFR_LEVELS: Record<CefrLevel, { pt: string; en: string }> = {
  A1: { pt: 'Iniciante', en: 'Beginner' },
  A2: { pt: 'Básico', en: 'Elementary' },
  B1: { pt: 'Intermediário', en: 'Intermediate' },
  B2: { pt: 'Intermediário Avançado', en: 'Upper Intermediate' },
  C1: { pt: 'Avançado', en: 'Advanced' },
  C2: { pt: 'Proficiente', en: 'Proficient' },
}

export const CATEGORY_NAMES: Record<QuestionCategory, { pt: string; en: string }> = {
  GRAMMAR: { pt: 'Gramática', en: 'Grammar' },
  VOCABULARY: { pt: 'Vocabulário', en: 'Vocabulary' },
  READING: { pt: 'Leitura', en: 'Reading' },
  LISTENING: { pt: 'Compreensão Auditiva', en: 'Listening' },
  WRITING: { pt: 'Escrita', en: 'Writing' },
}

export function getLevelDisplayName(level: CefrLevel, language: 'pt' | 'en'): string {
  return CEFR_LEVELS[level][language]
}

export function getCategoryDisplayName(category: QuestionCategory, language: 'pt' | 'en'): string {
  return CATEGORY_NAMES[category][language]
}

function mapScoreToCefrLevel(scorePercent: number): CefrLevel {
  if (scorePercent <= 20) return 'A1'
  if (scorePercent <= 40) return 'A2'
  if (scorePercent <= 60) return 'B1'
  if (scorePercent <= 75) return 'B2'
  if (scorePercent <= 90) return 'C1'
  return 'C2'
}

const levelRecommendations: Record<CefrLevel, string> = {
  A1: 'Recomendamos o curso "Inglês do Zero", com foco em vocabulário básico, verbos essenciais e compreensão de frases simples.',
  A2: 'Recomendamos o curso "Inglês para o Dia a Dia", focando em conversação simples, ampliação de vocabulário e tempos verbais básicos.',
  B1: 'Recomendamos o curso "Inglês Intermediário", com ênfase em fluência conversacional, leitura de textos autênticos e gramática aplicada.',
  B2: 'Recomendamos o curso "Inglês Avançado Intermediário", aprofundando compreensão textual, expressões idiomáticas e produção escrita.',
  C1: 'Recomendamos o curso "Inglês Avançado", com foco em nuances linguísticas, argumentação, listening avançado e preparação para certificações.',
  C2: 'Recomendamos o curso "Inglês para Proficiência", desenvolvendo precisão comunicativa, domínio de register formal e acadêmico.',
}

const levelBadgeText: Record<CefrLevel, string> = {
  A1: 'Primeiros Passos',
  A2: 'Explorador',
  B1: 'Comunicador',
  B2: 'Construtor',
  C1: 'Mestre',
  C2: 'Poliglota',
}

function buildFeedback(
  level: CefrLevel,
  scorePercent: number,
  strengths: string[],
  weaknesses: string[],
  strongestCategory: string | null,
): string {
  const levelIntro: Record<CefrLevel, string> = {
    A1: 'Você está dando os primeiros passos no inglês. Recomendamos focar em vocabulário básico e estruturas simples.',
    A2: 'Você já possui uma base inicial de inglês e consegue compreender expressões familiares e frases simples.',
    B1: 'Você consegue se comunicar em situações cotidianas e compreender ideias principais de textos simples. Continue praticando para ganhar mais fluência.',
    B2: 'Você demonstra boa compreensão do inglês, conseguindo se expressar com clareza em diversos contextos. Continue aprimorando suas habilidades.',
    C1: `Você demonstra excelente domínio da língua inglesa, principalmente em ${strongestCategory || 'diversas áreas'}. Seu desempenho indica um nível avançado de comunicação.`,
    C2: 'Você possui domínio completo do inglês, com capacidade de compreender e produzir discursos complexos com precisão e naturalidade.',
  }

  let feedback = levelIntro[level]

  if (strengths.length > 0) {
    feedback += ` Seus pontos fortes estão em: ${strengths.join(', ')}.`
  }

  if (weaknesses.length > 0) {
    feedback += ` Para continuar evoluindo, recomendamos dedicar mais atenção a: ${weaknesses.join(', ')}.`
  }

  return feedback
}

export function calculateResult(
  correctAnswers: number,
  totalQuestions: number,
  categoryData: { category: string; correct: number; total: number }[],
): AssessmentResult {
  const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const cefrLevel = mapScoreToCefrLevel(scorePercent)

  const categoryBreakdown: CategoryBreakdown[] = categoryData.map((cd) => ({
    category: cd.category,
    correct: cd.correct,
    total: cd.total,
    percent: cd.total > 0 ? Math.round((cd.correct / cd.total) * 100) : 0,
  }))

  const strengths = categoryBreakdown
    .filter((cb) => cb.percent > 80)
    .map((cb) => getCategoryDisplayName(cb.category as QuestionCategory, 'pt'))

  const weaknesses = categoryBreakdown
    .filter((cb) => cb.percent < 60)
    .map((cb) => getCategoryDisplayName(cb.category as QuestionCategory, 'pt'))

  const sorted = [...categoryBreakdown].sort((a, b) => b.percent - a.percent)
  const strongestCategory = sorted.length > 0 && sorted[0].percent > 80
    ? getCategoryDisplayName(sorted[0].category as QuestionCategory, 'pt')
    : null

  const feedback = buildFeedback(cefrLevel, scorePercent, strengths, weaknesses, strongestCategory)
  const recommendation = levelRecommendations[cefrLevel]
  const badgeText = levelBadgeText[cefrLevel]

  return {
    cefrLevel,
    scorePercent,
    correctAnswers,
    totalQuestions,
    categoryBreakdown,
    strengths,
    weaknesses,
    recommendation,
    feedback,
    badgeText,
  }
}

export function shuffleQuestions(questions: Question[], count: number): Question[] {
  const shuffled = [...questions]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function calculateCategoryBreakdown(
  answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[],
  questions: Question[],
): { category: string; correct: number; total: number; percent: number }[] {
  const questionMap = new Map<string, Question>()
  for (const q of questions) {
    questionMap.set(q.id, q)
  }

  const categoryMap = new Map<string, { correct: number; total: number }>()

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    if (!categoryMap.has(question.category)) {
      categoryMap.set(question.category, { correct: 0, total: 0 })
    }

    const entry = categoryMap.get(question.category)!
    entry.total++
    if (answer.isCorrect) {
      entry.correct++
    }
  }

  const result: { category: string; correct: number; total: number; percent: number }[] = []

  for (const [category, data] of categoryMap.entries()) {
    result.push({
      category,
      correct: data.correct,
      total: data.total,
      percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    })
  }

  return result
}

export interface QuestionBankManager {
  shuffleQuestions(questions: Question[], count: number): Question[]
  calculateCategoryBreakdown(
    answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[],
    questions: Question[],
  ): { category: string; correct: number; total: number; percent: number }[]
}
