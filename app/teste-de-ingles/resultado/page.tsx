'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getAttemptFromCookie } from '@/actions/assessment'
import { calculateResult, CEFR_LEVELS, getLevelDisplayName, getCategoryDisplayName } from '@/lib/assessment'
import { motion } from 'framer-motion'
import { Award, Trophy, Share2, RotateCcw, BookOpen, CheckCircle2, AlertCircle, Target, BarChart3, Loader2, MessageCircle, MessageSquare, FileDown } from 'lucide-react'

type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

const LEVEL_CONFIG: Record<CefrLevel, { color: string; border: string; text: string; gradient: string; icon: typeof Award }> = {
  A1: { color: '#d97706', border: 'border-amber-500/40', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-700', icon: Trophy },
  A2: { color: '#64748b', border: 'border-slate-500/40', text: 'text-slate-600', gradient: 'from-slate-400 to-slate-600', icon: Award },
  B1: { color: '#ca8a04', border: 'border-yellow-500/40', text: 'text-yellow-600', gradient: 'from-yellow-400 to-yellow-600', icon: Award },
  B2: { color: '#059669', border: 'border-emerald-500/40', text: 'text-emerald-600', gradient: 'from-emerald-400 to-emerald-600', icon: Award },
  C1: { color: '#2563eb', border: 'border-blue-500/40', text: 'text-blue-600', gradient: 'from-blue-400 to-blue-600', icon: Award },
  C2: { color: '#7c3aed', border: 'border-purple-500/40', text: 'text-purple-600', gradient: 'from-purple-400 to-purple-600', icon: Award },
}

const LEVEL_EMOJI: Record<CefrLevel, string> = {
  A1: '🥉',
  A2: '🥈',
  B1: '🥇',
  B2: '🏆',
  C1: '💎',
  C2: '👑',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

function ScoreCircle({ percent, color, size = 140 }: { percent: number; color: string; size?: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(percent, 100) / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-muted" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' as const, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="text-center"
        >
          <span className="text-4xl font-black tracking-tight" style={{ color }}>{percent}</span>
          <span className="block text-xs font-medium text-muted-foreground -mt-1">/ 100</span>
        </motion.div>
      </div>
    </div>
  )
}

function AnimatedBar({ percent, color, delay = 0 }: { percent: number; color: string; delay?: number }) {
  return (
    <div className="h-3 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' as const, delay }}
      />
    </div>
  )
}

function getBarColor(percent: number): string {
  if (percent >= 80) return '#059669'
  if (percent >= 60) return '#ca8a04'
  return '#dc2626'
}

function getShareText(level: CefrLevel): string {
  const displayName = getLevelDisplayName(level, 'pt')
  return `Acabei de descobrir meu nível de inglês: ${level} (${displayName})! Faça você também o teste gratuito: https://learnenglishbr.com.br/teste-de-ingles`
}

function getWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

function getDiscordText(name: string, level: CefrLevel, displayName: string, score: number): string {
  return [
    `📊 **Resultado do Teste de Inglês**`,
    ``,
    `👤 **Aluno(a):** ${name}`,
    `🏅 **Nível:** ${level} — ${displayName}`,
    `🎯 **Pontuação:** ${score}/100`,
    ``,
    `👉 Faça você também: https://learnenglishbr.com.br/teste-de-ingles`,
  ].join('\n')
}

function handlePrint() {
  window.print()
}

export default function ResultadoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Awaited<ReturnType<typeof calculateResult>> | null>(null)
  const [leadName, setLeadName] = useState<string>('')
  const [cefrLevel, setCefrLevel] = useState<CefrLevel | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadResult() {
      try {
        let attemptId: string | null = null

        if (typeof window !== 'undefined') {
          attemptId = sessionStorage.getItem('assessment_attempt_id')
        }

        if (!attemptId) {
          attemptId = (await getAttemptFromCookie()) ?? null
        }

        if (!attemptId) {
          router.replace('/teste-de-ingles')
          return
        }

        const supabase = createClient()

        const { data: attempt, error: attemptError } = await supabase
          .from('english_test_attempts')
          .select('*')
          .eq('id', attemptId)
          .single()

        if (attemptError || !attempt) {
          throw new Error('Tentativa não encontrada')
        }

        const { data: answers, error: answersError } = await supabase
          .from('english_test_answers')
          .select('*')
          .eq('attempt_id', attemptId)

        if (answersError) throw answersError

        if (!answers || answers.length === 0) {
          throw new Error('Nenhuma resposta encontrada para esta tentativa')
        }

        const questionIds = answers.map((a: any) => a.question_id)

        const { data: questions, error: questionsError } = await supabase
          .from('english_test_questions')
          .select('id, category')
          .in('id', questionIds)

        if (questionsError) throw questionsError

        const questionMap = new Map<string, string>()
        for (const q of questions || []) {
          questionMap.set(q.id, q.category)
        }

        const categoryData: Record<string, { correct: number; total: number }> = {}

        for (const answer of answers) {
          const cat = questionMap.get(answer.question_id) || 'OTHER'
          if (!categoryData[cat]) {
            categoryData[cat] = { correct: 0, total: 0 }
          }
          categoryData[cat].total++
          if (answer.is_correct) {
            categoryData[cat].correct++
          }
        }

        const catArray = Object.entries(categoryData).map(([category, data]) => ({
          category,
          correct: data.correct,
          total: data.total,
        }))

        const correctCount = answers.filter((a: any) => a.is_correct).length
        const totalCount = answers.length

        if (cancelled) return

        const r = calculateResult(correctCount, totalCount, catArray)

        setResult(r)
        setLeadName(attempt.lead_name || 'Aluno')
        setCefrLevel(r.cefrLevel as CefrLevel)
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Erro ao carregar resultado')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadResult()

    return () => { cancelled = true }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-lg font-semibold">Calculando seu resultado...</p>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !result || !cefrLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border border-border rounded-2xl shadow-sm max-w-md w-full p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-black">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground">{error || 'Não foi possível carregar seu resultado.'}</p>
          <button
            onClick={() => { setLoading(true); setError(null); router.refresh() }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-8 py-3.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-base"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  const levelConfig = LEVEL_CONFIG[cefrLevel]
  const levelEmoji = LEVEL_EMOJI[cefrLevel]
  const displayName = getLevelDisplayName(cefrLevel, 'pt')
  const LevelIcon = levelConfig.icon
  const shareText = getShareText(cefrLevel)

  async function handleShare() {
    const text = shareText
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Meu nível de inglês', text })
        return
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied('link')
    setTimeout(() => setCopied(null), 2500)
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-40 -left-40 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] lg:w-[1000px] h-[300px] bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      <motion.div
        className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12 space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: levelConfig.color }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <LevelIcon className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
          </div>

          <motion.h1
            className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            🎉 Parabéns, {leadName}!
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Sua pontuação foi: <span className="font-bold text-foreground">{result.scorePercent}/100</span>
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative">
            <ScoreCircle percent={result.scorePercent} color={levelConfig.color} size={160} />
            <motion.div
              className="absolute -top-2 -right-2 text-3xl"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
            >
              {levelEmoji}
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nível Estimado</span>
          </div>
          <p className="text-center">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-lg font-bold border-2"
              style={{
                backgroundColor: levelConfig.color + '15',
                borderColor: levelConfig.color + '40',
                color: levelConfig.color,
              }}
            >
              {levelEmoji} {cefrLevel} — {displayName}
            </span>
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 2px, transparent 0)', backgroundSize: '32px 32px' }} />
            <motion.div
              className="text-5xl mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
            >
              {levelEmoji}
            </motion.div>
            <h3 className="text-2xl font-black mb-1" style={{ color: levelConfig.color }}>
              {cefrLevel}
            </h3>
            <p className="text-lg font-semibold text-foreground mb-1">{displayName}</p>
            <p className="text-sm font-medium" style={{ color: levelConfig.color }}>
              {result.badgeText}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Desempenho por Categoria</h3>
                <p className="text-sm text-muted-foreground">Veja como você se saiu em cada área</p>
              </div>
            </div>
            <div className="space-y-5">
              {result.categoryBreakdown.map((cat, i) => {
                const barColor = getBarColor(cat.percent)
                return (
                  <motion.div
                    key={cat.category}
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{getCategoryDisplayName(cat.category as any, 'pt')}</span>
                      <span className="text-sm font-bold" style={{ color: barColor }}>{cat.correct}/{cat.total} ({cat.percent}%)</span>
                    </div>
                    <AnimatedBar percent={cat.percent} color={barColor} delay={0.9 + i * 0.1} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Análise do Resultado</h3>
                <p className="text-sm text-muted-foreground">Feedback personalizado para você</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl mb-5">
              <p className="text-sm leading-relaxed text-foreground/80">{result.feedback}</p>
            </div>

            {result.strengths.length > 0 && (
              <div className="mb-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <motion.li
                      key={s}
                      className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.08 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {result.weaknesses.length > 0 && (
              <div className="mb-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  Áreas para Melhorar
                </h4>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <motion.li
                      key={w}
                      className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 px-4 py-2.5 rounded-xl flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.08 }}
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      {w}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-3">
                <BookOpen className="w-4 h-4" />
                Recomendação
              </h4>
              <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 px-4 py-3.5 rounded-xl text-sm leading-relaxed">
                {result.recommendation}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} id="certificado-print">
          <div className="rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center shadow-sm relative" style={{ borderColor: levelConfig.color + '30' }}>
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-blue-500 no-print"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Certificado de Nível
            </motion.div>

            <div className="pt-4 space-y-4">
              <motion.div
                className="text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 150 }}
              >
                {levelEmoji}
              </motion.div>

              <h3 className="text-xl font-black" style={{ color: levelConfig.color }}>Certificado de Proficiência</h3>

              <p className="text-muted-foreground">
                Este certificado confirma que <span className="font-bold text-foreground">{leadName}</span> alcançou o nível
              </p>

              <p className="text-3xl font-black" style={{ color: levelConfig.color }}>
                {cefrLevel} — {displayName}
              </p>

              <p className="text-sm text-muted-foreground">
                com pontuação de <span className="font-bold text-foreground">{result.scorePercent}%</span>
              </p>

              <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: levelConfig.color }} />
            </div>

            <div className="mt-6 pt-6 border-t border-border no-print">
              <p className="text-sm font-semibold text-muted-foreground mb-4">Compartilhe seu resultado</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={getWhatsAppUrl(shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white font-semibold px-5 py-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={async () => {
                    const discordText = getDiscordText(leadName, cefrLevel, displayName, result.scorePercent)
                    try {
                      await navigator.clipboard.writeText(discordText)
                      setCopied('discord')
                      setTimeout(() => setCopied(null), 2500)
                    } catch {}
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5865F2] text-white font-semibold px-5 py-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  {copied === 'discord' ? '✓ Copiado!' : 'Discord'}
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-card border-2 border-border text-foreground font-semibold px-5 py-2.5 shadow-lg hover:bg-muted/50 active:scale-95 transition-all text-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Salvar PDF
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-2.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  {copied === 'link' ? (
                    <>✓ Link Copiado!</>
                  ) : (
                    <><Share2 className="w-4 h-4" /> Copiar Link</>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
                {shareText}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold">Quer alcançar o próximo nível?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-8 py-3.5 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-base"
            >
              <BookOpen className="w-5 h-5" />
              Ver Curso Recomendado
            </a>
            <a
              href="/teste-de-ingles/iniciar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-card border-2 border-border text-foreground font-bold px-8 py-3.5 hover:bg-muted/50 active:scale-[0.98] transition-all text-base"
            >
              <RotateCcw className="w-5 h-5" />
              Refazer Teste
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
