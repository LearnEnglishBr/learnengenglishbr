import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upiiphtxyybycibdnflv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwaWlwaHR4eXlieWNpYmRuZmx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg0MTQ2OSwiZXhwIjoyMDk2NDE3NDY5fQ.wPvGcoGXX9Aw0Y0cP99TQ5CoFLy4qczaxvExIG5B0m8'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function run() {
  try {
    console.log('Criando nova conta limpa com outro e-mail para evitar conflitos...')
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'diretor@escola.com',
      password: 'senha123',
      email_confirm: true,
      user_metadata: { full_name: 'Diretor Supremo' }
    })

    if (error) {
      console.error('Erro na criação:', error)
      return
    }
    
    console.log('Promovendo para ADMIN...')
    await supabase.from('profiles').update({ role: 'ADMIN' }).eq('id', data.user.id)
    console.log('✅ SUCESSO! Conta pronta. ID:', data.user.id)
  } catch(e) {
    console.error(e)
  }
}
run()
