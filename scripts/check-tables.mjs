import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://upiiphtxyybycibdnflv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwaWlwaHR4eXlieWNpYmRuZmx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg0MTQ2OSwiZXhwIjoyMDk2NDE3NDY5fQ.wPvGcoGXX9Aw0Y0cP99TQ5CoFLy4qczaxvExIG5B0m8',
  { auth: { persistSession: false } }
)

async function check() {
  const tables = [
    'english_tests',
    'english_test_questions',
    'english_test_options',
    'english_test_results',
    'english_test_attempts',
    'english_test_answers',
  ]

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(`${table}:`, error ? `ERRO: ${error.message}` : `OK (${data?.length || 0} registros)`)
  }
}

check()
