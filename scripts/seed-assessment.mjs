import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://upiiphtxyybycibdnflv.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwaWlwaHR4eXlieWNpYmRuZmx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg0MTQ2OSwiZXhwIjoyMDk2NDE3NDY5fQ.wPvGcoGXX9Aw0Y0cP99TQ5CoFLy4qczaxvExIG5B0m8'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const TEST_ID = '00000000-0000-0000-0000-000000000001'

async function seed() {
  console.log('Iniciando seed do Teste de Nível de Inglês...\n')

  const { count } = await supabase.from('english_tests').select('*', { count: 'exact', head: true })
  if (count && count > 0) {
    console.log('Teste já existe. Pulando seed.')
    return
  }

  console.log('Criando teste...')
  await supabase.from('english_tests').insert({
    id: TEST_ID,
    title: 'Teste de Nível de Inglês',
    description: 'Avaliação completa de proficiência em inglês seguindo o padrão CEFR.',
    is_active: true,
    question_count: 40,
    time_estimate_minutes: 25,
  })

  console.log('Criando faixas de resultado...')
  await supabase.from('english_test_results').insert([
    { test_id: TEST_ID, cefr_level: 'A1', min_score: 0, max_score: 20, title: 'Beginner', description: 'Você está começando sua jornada no inglês.', recommendation: 'Recomendamos nosso Curso Iniciante para construir uma base sólida.', badge_text: 'Iniciante' },
    { test_id: TEST_ID, cefr_level: 'A2', min_score: 21, max_score: 40, title: 'Elementary', description: 'Você já consegue se comunicar em situações simples.', recommendation: 'Nosso Curso Básico vai te ajudar a ganhar mais confiança.', badge_text: 'Básico' },
    { test_id: TEST_ID, cefr_level: 'B1', min_score: 41, max_score: 60, title: 'Intermediate', description: 'Você consegue lidar com a maioria das situações de viagem.', recommendation: 'O Curso Intermediário é ideal para você.', badge_text: 'Intermediário' },
    { test_id: TEST_ID, cefr_level: 'B2', min_score: 61, max_score: 75, title: 'Upper Intermediate', description: 'Você se comunica com fluência natural.', recommendation: 'Avançe ainda mais com nosso Curso Intermediário Avançado.', badge_text: 'Intermediário Avançado' },
    { test_id: TEST_ID, cefr_level: 'C1', min_score: 76, max_score: 90, title: 'Advanced', description: 'Você domina o inglês com excelência.', recommendation: 'Nosso Curso Avançado vai polir ainda mais seu inglês.', badge_text: 'Avançado' },
    { test_id: TEST_ID, cefr_level: 'C2', min_score: 91, max_score: 100, title: 'Proficient', description: 'Você tem domínio completo do inglês.', recommendation: 'O Programa de Fluência vai te desafiar ainda mais.', badge_text: 'Fluência' },
  ])

  const questions = [
    { id: '00000000-0000-0000-0000-000000000101', question: 'Choose the correct option: "She ___ a student."', explanation: 'O verbo "to be" no presente para he/she/it é "is".', cefr_level: 'A1', category: 'GRAMMAR', difficulty: 1, position: 1 },
    { id: '00000000-0000-0000-0000-000000000102', question: 'What is the correct word? "I ___ coffee every morning."', explanation: '"Drink" é o verbo correto para consumir líquidos.', cefr_level: 'A1', category: 'VOCABULARY', difficulty: 1, position: 2 },
    { id: '00000000-0000-0000-0000-000000000103', question: 'Complete: "They ___ to the park yesterday."', explanation: 'Passado simples do verbo "to go" é "went".', cefr_level: 'A1', category: 'GRAMMAR', difficulty: 1, position: 3 },
    { id: '00000000-0000-0000-0000-000000000104', question: 'Read: "John is 25 years old. He lives in London." How old is John?', explanation: 'O texto diz claramente que John tem 25 anos.', cefr_level: 'A1', category: 'READING', difficulty: 1, position: 4 },
    { id: '00000000-0000-0000-0000-000000000105', question: 'What is the opposite of "hot"?', explanation: 'O oposto de "hot" (quente) é "cold" (frio).', cefr_level: 'A1', category: 'VOCABULARY', difficulty: 1, position: 5 },
    { id: '00000000-0000-0000-0000-000000000106', question: 'Choose: "There ___ a book on the table."', explanation: '"There is" é usado para singular.', cefr_level: 'A1', category: 'GRAMMAR', difficulty: 1, position: 6 },
    { id: '00000000-0000-0000-0000-000000000201', question: 'Complete: "She ___ to music right now."', explanation: 'Present continuous (now) = is + verb-ing.', cefr_level: 'A2', category: 'GRAMMAR', difficulty: 2, position: 7 },
    { id: '00000000-0000-0000-0000-000000000202', question: 'Choose the correct word: "I need to ___ my homework before Friday."', explanation: '"Finish" significa terminar/completar.', cefr_level: 'A2', category: 'VOCABULARY', difficulty: 2, position: 8 },
    { id: '00000000-0000-0000-0000-000000000203', question: 'Choose: "I have ___ been to France."', explanation: '"Never" expressa que nunca fez algo.', cefr_level: 'A2', category: 'GRAMMAR', difficulty: 2, position: 9 },
    { id: '00000000-0000-0000-0000-000000000204', question: 'Read: "Sarah usually wakes up at 7 AM. She takes a shower and then has breakfast. She leaves home at 8 AM." What does Sarah do first?', explanation: 'O texto diz que ela acorda primeiro.', cefr_level: 'A2', category: 'READING', difficulty: 2, position: 10 },
    { id: '00000000-0000-0000-0000-000000000205', question: 'What does "expensive" mean?', explanation: '"Expensive" significa caro.', cefr_level: 'A2', category: 'VOCABULARY', difficulty: 2, position: 11 },
    { id: '00000000-0000-0000-0000-000000000206', question: 'Complete: "I ___ like pizza when I was a child."', explanation: '"Used to" expressa hábitos passados.', cefr_level: 'A2', category: 'GRAMMAR', difficulty: 2, position: 12 },
    { id: '00000000-0000-0000-0000-000000000207', question: 'Read: "The restaurant opens at 6 PM and closes at 11 PM. It is closed on Mondays." When is the restaurant closed?', explanation: 'O texto diz explicitamente que fecha às segundas.', cefr_level: 'A2', category: 'READING', difficulty: 2, position: 13 },
    { id: '00000000-0000-0000-0000-000000000301', question: 'Complete: "If it rains, I ___ stay home."', explanation: 'First conditional: if + present, will + infinitive.', cefr_level: 'B1', category: 'GRAMMAR', difficulty: 3, position: 14 },
    { id: '00000000-0000-0000-0000-000000000302', question: 'Choose the best word: "She ___ to her boss about the project."', explanation: '"Explain" é o verbo correto para quando se explica algo.', cefr_level: 'B1', category: 'VOCABULARY', difficulty: 3, position: 15 },
    { id: '00000000-0000-0000-0000-000000000303', question: 'Choose: "The book ___ by Mark Twain."', explanation: 'Voz passiva no passado: was/were + past participle.', cefr_level: 'B1', category: 'GRAMMAR', difficulty: 3, position: 16 },
    { id: '00000000-0000-0000-0000-000000000304', question: 'Read: "Despite the heavy rain, the event was a success." What does "despite" mean?', explanation: '"Despite" significa "apesar de".', cefr_level: 'B1', category: 'READING', difficulty: 3, position: 17 },
    { id: '00000000-0000-0000-0000-000000000305', question: 'What is a synonym for "difficult"?', explanation: '"Hard" é sinônimo de "difficult" (difícil).', cefr_level: 'B1', category: 'VOCABULARY', difficulty: 3, position: 18 },
    { id: '00000000-0000-0000-0000-000000000306', question: 'Complete: "She has been working here ___ 2018."', explanation: 'Present perfect continuous com "since" para ponto no tempo.', cefr_level: 'B1', category: 'GRAMMAR', difficulty: 3, position: 19 },
    { id: '00000000-0000-0000-0000-000000000307', question: 'Read: "The company announced that they are expanding their operations to three new countries. This will create approximately 200 new jobs." How many jobs will be created?', explanation: 'O texto diz aproximadamente 200 novos empregos.', cefr_level: 'B1', category: 'READING', difficulty: 3, position: 20 },
    { id: '00000000-0000-0000-0000-000000000401', question: 'Complete: "I wish I ___ more time to study."', explanation: 'Wish + past perfect para expressar arrependimento.', cefr_level: 'B2', category: 'GRAMMAR', difficulty: 4, position: 21 },
    { id: '00000000-0000-0000-0000-000000000402', question: 'Choose the correct word: "The findings of the research were ___ by the scientific community."', explanation: '"Acknowledged" significa reconhecido.', cefr_level: 'B2', category: 'VOCABULARY', difficulty: 4, position: 22 },
    { id: '00000000-0000-0000-0000-000000000403', question: 'Choose: "Had I known, I ___ come earlier."', explanation: 'Third conditional invertido.', cefr_level: 'B2', category: 'GRAMMAR', difficulty: 4, position: 23 },
    { id: '00000000-0000-0000-0000-000000000404', question: 'Read: "The novel, which was published in 1925, is widely regarded as a masterpiece of American literature." What themes are mentioned?', explanation: 'O texto menciona riqueza, amor e o Sonho Americano.', cefr_level: 'B2', category: 'READING', difficulty: 4, position: 24 },
    { id: '00000000-0000-0000-0000-000000000405', question: 'What does "nevertheless" mean?', explanation: '"Nevertheless" significa "no entanto".', cefr_level: 'B2', category: 'VOCABULARY', difficulty: 4, position: 25 },
    { id: '00000000-0000-0000-0000-000000000406', question: 'Complete: "It is essential that every student ___ the rules."', explanation: 'Subjuntivo: after "essential that" use o base form.', cefr_level: 'B2', category: 'GRAMMAR', difficulty: 4, position: 26 },
    { id: '00000000-0000-0000-0000-000000000407', question: 'Read: "The government implemented new policies aimed at reducing carbon emissions." What do critics say?', explanation: 'Os críticos argumentam que as medidas são insuficientes.', cefr_level: 'B2', category: 'READING', difficulty: 4, position: 27 },
    { id: '00000000-0000-0000-0000-000000000501', question: 'Complete: "Not until the following morning ___ the extent of the damage."', explanation: 'Inversão após "Not until".', cefr_level: 'C1', category: 'GRAMMAR', difficulty: 5, position: 28 },
    { id: '00000000-0000-0000-0000-000000000502', question: 'Choose the best word: "The professor ___ the student for his outstanding research."', explanation: '"Commended" significa elogiou formalmente.', cefr_level: 'C1', category: 'VOCABULARY', difficulty: 5, position: 29 },
    { id: '00000000-0000-0000-0000-000000000503', question: 'Complete: "Were it not for your help, I ___ the project."', explanation: 'Third conditional invertido sem "if".', cefr_level: 'C1', category: 'GRAMMAR', difficulty: 5, position: 30 },
    { id: '00000000-0000-0000-0000-000000000504', question: 'Read: "The implications of quantum computing for cryptography are profound." What does this imply about current encryption?', explanation: 'A criptografia atual pode se tornar obsoleta.', cefr_level: 'C1', category: 'READING', difficulty: 5, position: 31 },
    { id: '00000000-0000-0000-0000-000000000505', question: 'What does "ubiquitous" mean?', explanation: '"Ubiquitous" significa onipresente.', cefr_level: 'C1', category: 'VOCABULARY', difficulty: 5, position: 32 },
    { id: '00000000-0000-0000-0000-000000000506', question: 'Choose: "The CEO, along with the board members, ___ in favor of the merger."', explanation: 'Sujeito singular + "along with" = verbo no singular.', cefr_level: 'C1', category: 'GRAMMAR', difficulty: 5, position: 33 },
    { id: '00000000-0000-0000-0000-000000000507', question: 'Read: "The author\'s critique of neoliberalism is nuanced." How does the author\'s approach differ?', explanation: 'Abordagem dialética reconhece ambos os lados.', cefr_level: 'C1', category: 'READING', difficulty: 5, position: 34 },
    { id: '00000000-0000-0000-0000-000000000601', question: 'Complete: "Should you require further assistance, ___ hesitate to contact us."', explanation: 'Inversão em condicionais formais.', cefr_level: 'C2', category: 'GRAMMAR', difficulty: 5, position: 35 },
    { id: '00000000-0000-0000-0000-000000000602', question: 'Choose the best word: "Her ___ remarks during the debate showed her profound understanding."', explanation: '"Lucid" significa claro, lúcido.', cefr_level: 'C2', category: 'VOCABULARY', difficulty: 5, position: 36 },
    { id: '00000000-0000-0000-0000-000000000603', question: 'Complete: "It is imperative that the data ___ verified before publication."', explanation: 'Subjuntivo formal.', cefr_level: 'C2', category: 'GRAMMAR', difficulty: 5, position: 37 },
    { id: '00000000-0000-0000-0000-000000000604', question: 'Read: "The epistemological foundations of positivism have been subjected to sustained critique." What do post-structuralists argue?', explanation: 'Objetividade científica é uma construção discursiva.', cefr_level: 'C2', category: 'READING', difficulty: 5, position: 38 },
    { id: '00000000-0000-0000-0000-000000000605', question: 'What does "mellifluous" mean?', explanation: '"Mellifluous" significa suave e agradável ao ouvir.', cefr_level: 'C2', category: 'VOCABULARY', difficulty: 5, position: 39 },
    { id: '00000000-0000-0000-0000-000000000606', question: 'Choose: "Never before ___ such a compelling argument presented so eloquently."', explanation: 'Inversão com "Never before".', cefr_level: 'C2', category: 'GRAMMAR', difficulty: 5, position: 40 },
  ]

  console.log(`Criando ${questions.length} questões...`)
  for (const q of questions) {
    await supabase.from('english_test_questions').insert({
      id: q.id, test_id: TEST_ID, question: q.question, explanation: q.explanation,
      cefr_level: q.cefr_level, category: q.category, difficulty: q.difficulty, position: q.position,
      is_active: true,
    })
  }

  const options = [
    { q: '00000000-0000-0000-0000-000000000101', opts: [['is', true], ['are', false], ['am', false], ['be', false]] },
    { q: '00000000-0000-0000-0000-000000000102', opts: [['drink', true], ['eat', false], ['cook', false], ['make', false]] },
    { q: '00000000-0000-0000-0000-000000000103', opts: [['went', true], ['go', false], ['goes', false], ['going', false]] },
    { q: '00000000-0000-0000-0000-000000000104', opts: [['25', true], ['20', false], ['30', false], ['15', false]] },
    { q: '00000000-0000-0000-0000-000000000105', opts: [['cold', true], ['warm', false], ['cool', false], ['wet', false]] },
    { q: '00000000-0000-0000-0000-000000000106', opts: [['is', true], ['are', false], ['am', false], ['have', false]] },
    { q: '00000000-0000-0000-0000-000000000201', opts: [['is listening', true], ['listens', false], ['listened', false], ['will listen', false]] },
    { q: '00000000-0000-0000-0000-000000000202', opts: [['finish', true], ['start', false], ['open', false], ['lose', false]] },
    { q: '00000000-0000-0000-0000-000000000203', opts: [['never', true], ['ever', false], ['always', false], ['yet', false]] },
    { q: '00000000-0000-0000-0000-000000000204', opts: [['She wakes up', true], ['She takes a shower', false], ['She has breakfast', false], ['She leaves home', false]] },
    { q: '00000000-0000-0000-0000-000000000205', opts: [['costing a lot of money', true], ['very cheap', false], ['very fast', false], ['very small', false]] },
    { q: '00000000-0000-0000-0000-000000000206', opts: [['used to', true], ['use to', false], ['was used', false], ['did used', false]] },
    { q: '00000000-0000-0000-0000-000000000207', opts: [['On Mondays', true], ['At 6 PM', false], ['At 11 PM', false], ['On Sundays', false]] },
    { q: '00000000-0000-0000-0000-000000000301', opts: [['will', true], ['would', false], ['am', false], ['do', false]] },
    { q: '00000000-0000-0000-0000-000000000302', opts: [['explained', true], ['told', false], ['said', false], ['spoke', false]] },
    { q: '00000000-0000-0000-0000-000000000303', opts: [['was written', true], ['wrote', false], ['is written', false], ['has written', false]] },
    { q: '00000000-0000-0000-0000-000000000304', opts: [['in spite of', true], ['because of', false], ['due to', false], ['thanks to', false]] },
    { q: '00000000-0000-0000-0000-000000000305', opts: [['hard', true], ['easy', false], ['soft', false], ['simple', false]] },
    { q: '00000000-0000-0000-0000-000000000306', opts: [['since', true], ['for', false], ['from', false], ['in', false]] },
    { q: '00000000-0000-0000-0000-000000000307', opts: [['Approximately 200', true], ['Exactly 200', false], ['More than 500', false], ['100', false]] },
    { q: '00000000-0000-0000-0000-000000000401', opts: [['had', true], ['have', false], ['would have', false], ['will have', false]] },
    { q: '00000000-0000-0000-0000-000000000402', opts: [['acknowledged', true], ['denied', false], ['ignored', false], ['forgotten', false]] },
    { q: '00000000-0000-0000-0000-000000000403', opts: [['would have', true], ['will', false], ['would', false], ['have', false]] },
    { q: '00000000-0000-0000-0000-000000000404', opts: [['Themes of wealth, love, and the American Dream', true], ['A scientific discovery', false], ['A war story', false], ['A biography', false]] },
    { q: '00000000-0000-0000-0000-000000000405', opts: [['however', true], ['therefore', false], ['furthermore', false], ['meanwhile', false]] },
    { q: '00000000-0000-0000-0000-000000000406', opts: [['follow', true], ['follows', false], ['followed', false], ['will follow', false]] },
    { q: '00000000-0000-0000-0000-000000000407', opts: [['The measures are insufficient', true], ['The policies are excellent', false], ['The target is too high', false], ['The government should wait', false]] },
    { q: '00000000-0000-0000-0000-000000000501', opts: [['did they realize', true], ['they realized', false], ['they did realize', false], ['realized they', false]] },
    { q: '00000000-0000-0000-0000-000000000502', opts: [['commended', true], ['blamed', false], ['ignored', false], ['dismissed', false]] },
    { q: '00000000-0000-0000-0000-000000000503', opts: [['would not have finished', true], ['will not finish', false], ['did not finish', false], ['had not finished', false]] },
    { q: '00000000-0000-0000-0000-000000000504', opts: [['It could become obsolete', true], ['It will become stronger', false], ['It is already obsolete', false], ['It is unaffected', false]] },
    { q: '00000000-0000-0000-0000-000000000505', opts: [['present everywhere', true], ['extremely rare', false], ['very dangerous', false], ['completely invisible', false]] },
    { q: '00000000-0000-0000-0000-000000000506', opts: [['was', true], ['were', false], ['have been', false], ['are', false]] },
    { q: '00000000-0000-0000-0000-000000000507', opts: [['It is dialectical, acknowledging both sides', true], ['It is purely critical', false], ['It is entirely supportive', false], ['It is indifferent', false]] },
    { q: '00000000-0000-0000-0000-000000000601', opts: [['do not', true], ['you do not', false], ['you will not', false], ['not', false]] },
    { q: '00000000-0000-0000-0000-000000000602', opts: [['lucid', true], ['vague', false], ['ambiguous', false], ['obscure', false]] },
    { q: '00000000-0000-0000-0000-000000000603', opts: [['be', true], ['is', false], ['being', false], ['been', false]] },
    { q: '00000000-0000-0000-0000-000000000604', opts: [['Scientific objectivity is a discursive construct', true], ['Positivism is completely correct', false], ['Science has no value', false], ['Power relations are irrelevant', false]] },
    { q: '00000000-0000-0000-0000-000000000605', opts: [['sweet and smooth sounding', true], ['harsh and loud', false], ['fast and energetic', false], ['sad and melancholic', false]] },
    { q: '00000000-0000-0000-0000-000000000606', opts: [['have I heard', true], ['I have heard', false], ['I heard', false], ['did I heard', false]] },
  ]

  console.log(`Criando opções...`)
  for (const entry of options) {
    const questionId = entry.q
    for (let i = 0; i < entry.opts.length; i++) {
      const [text, isCorrect] = entry.opts[i]
      await supabase.from('english_test_options').insert({
        question_id: questionId,
        option_text: text,
        is_correct: isCorrect,
        position: i + 1,
      })
    }
  }

  console.log('\n✅ Seed concluído com sucesso!')
  console.log(`📝 40 questões criadas de A1 a C2`)
  console.log(`🎯 6 faixas de resultado configuradas`)
}

seed().catch(console.error)
