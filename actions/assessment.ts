'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const START_SCHEMA = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
})

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function getAttemptFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('assessment_attempt_id')?.value
}

export async function startAssessmentAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    const parsed = START_SCHEMA.safeParse({ name, email })
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()

    let { data: test } = await supabase
      .from('english_tests')
      .select('id')
      .eq('is_active', true)
      .single()

    if (!test) {
      const admin = await createAdminClient()
      const { data: newTest } = await admin.from('english_tests').insert({
        title: 'Teste de Nível de Inglês',
        description: 'Avaliação completa de proficiência em inglês.',
        is_active: true,
        question_count: 40,
        time_estimate_minutes: 25,
      }).select('id').single()
      if (!newTest) return { error: 'Nenhum teste ativo encontrado' }
      test = newTest
    }

    const { data, error } = await supabase
      .from('english_test_attempts')
      .insert({
        test_id: test.id,
        lead_name: name,
        lead_email: email,
        lead_phone: phone || null,
      })
      .select()
      .single()

    if (error) return { error: error.message }

    const cookieStore = await cookies()
    cookieStore.set('assessment_attempt_id', data.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { success: true, attemptId: data.id }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function submitAnswerAction(attemptId: string, questionId: string, selectedOptionId: string) {
  try {
    const supabase = await createClient()

    const attemptIdFromCookie = await getAttemptFromCookie()
    if (!attemptIdFromCookie || attemptIdFromCookie !== attemptId) {
      return { error: 'Tentativa não encontrada' }
    }

    const { data: option } = await supabase
      .from('english_test_options')
      .select('is_correct')
      .eq('id', selectedOptionId)
      .single()

    if (!option) return { error: 'Opção inválida' }

    const { error } = await supabase
      .from('english_test_answers')
      .upsert({
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
        is_correct: option.is_correct,
      }, { onConflict: 'attempt_id, question_id' })

    if (error) return { error: error.message }

    return { success: true, isCorrect: option.is_correct }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function completeAssessmentAction(attemptId: string) {
  try {
    const supabase = await createClient()

    const attemptIdFromCookie = await getAttemptFromCookie()
    if (!attemptIdFromCookie || attemptIdFromCookie !== attemptId) {
      return { error: 'Tentativa não encontrada' }
    }

    const { data: answers } = await supabase
      .from('english_test_answers')
      .select('is_correct')
      .eq('attempt_id', attemptId)

    if (!answers) return { error: 'Nenhuma resposta encontrada' }

    const total = answers.length
    const correct = answers.filter(a => a.is_correct).length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    const { data: attempt } = await supabase
      .from('english_test_attempts')
      .select('test_id')
      .eq('id', attemptId)
      .single()

    let cefrLevel: string | null = null

    if (attempt) {
      const { data: result } = await supabase
        .from('english_test_results')
        .select('cefr_level')
        .eq('test_id', attempt.test_id)
        .lte('min_score', percentage)
        .gte('max_score', percentage)
        .single()

      if (result) cefrLevel = result.cefr_level
    }

    const { error } = await supabase
      .from('english_test_attempts')
      .update({
        total_questions: total,
        correct_answers: correct,
        score_percent: percentage,
        cefr_level: cefrLevel,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', attemptId)

    if (error) return { error: error.message }

    return {
      success: true,
      result: {
        total,
        correct,
        percentage,
        cefrLevel,
      },
    }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getAssessmentQuestionsAction(testId: string) {
  try {
    const supabase = await createClient()

    const { data: questions } = await supabase
      .from('english_test_questions')
      .select('id, question, explanation, cefr_level, category, difficulty, position')
      .eq('test_id', testId)
      .eq('is_active', true)
      .order('position')

    if (!questions) return { error: 'Nenhuma questão encontrada' }

    const questionIds = questions.map(q => q.id)

    const { data: options } = await supabase
      .from('english_test_options')
      .select('id, question_id, option_text, position')
      .in('question_id', questionIds)
      .order('position')

    const optionsByQuestion: Record<string, typeof options> = {}
    if (options) {
      for (const opt of options) {
        const bucket = optionsByQuestion[opt.question_id]
        if (bucket) bucket.push(opt)
        else optionsByQuestion[opt.question_id] = [opt]
      }
    }

    const shuffled = shuffle(questions).map(q => ({
      id: q.id,
      question: q.question,
      explanation: q.explanation,
      cefrLevel: q.cefr_level,
      category: q.category,
      difficulty: q.difficulty,
      options: shuffle(optionsByQuestion[q.id] || []).map(o => ({
        id: o.id,
        optionText: o.option_text,
      })),
    }))

    return { success: true, questions: shuffled, total: shuffled.length }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getTestAction() {
  try {
    console.log('[DEBUG getTestAction] Starting...')
    const supabase = await createClient()

    console.log('[DEBUG getTestAction] Querying english_tests with anon key...')
    let { data, error } = await supabase
      .from('english_tests')
      .select('id, title, description, question_count, time_estimate_minutes')
      .eq('is_active', true)
      .single()

    console.log('[DEBUG getTestAction] Anon query result:', { data, error })

    if (error || !data) {
      console.log('[DEBUG getTestAction] Anon query failed, trying admin client...')
      const admin = await createAdminClient()
      const { data: newTest, error: insertError } = await admin.from('english_tests').insert({
        title: 'Teste de Nível de Inglês',
        description: 'Avaliação completa de proficiência em inglês.',
        is_active: true,
        question_count: 40,
        time_estimate_minutes: 25,
      }).select('id, title, description, question_count, time_estimate_minutes').single()
      console.log('[DEBUG getTestAction] Admin insert result:', { newTest, insertError })
      if (!newTest) return { error: 'Nenhum teste ativo encontrado' }
      data = newTest
    }

    console.log('[DEBUG getTestAction] Success:', data.id)
    return {
      success: true,
      id: data.id,
      title: data.title,
      description: data.description,
      questionCount: data.question_count,
      timeEstimateMinutes: data.time_estimate_minutes,
    }
  } catch (e: any) {
    console.error('[DEBUG getTestAction] Exception:', e.message)
    return { error: e.message }
  }
}
