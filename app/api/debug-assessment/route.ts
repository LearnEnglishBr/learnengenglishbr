import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const results: Record<string, any> = {}

  // 1. Test anon key client
  try {
    const supabase = await createClient()
    const { data: tests, error: testsError } = await supabase
      .from('english_tests')
      .select('id, title, is_active')
      .eq('is_active', true)
    results['anon_list_tests'] = { ok: !testsError, data: tests, error: testsError }
  } catch (e: any) {
    results['anon_list_tests'] = { ok: false, error: e.message }
  }

  // 2. Test anon single()
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('english_tests')
      .select('id')
      .eq('is_active', true)
      .single()
    results['anon_single_test'] = { ok: !error, data, error }
  } catch (e: any) {
    results['anon_single_test'] = { ok: false, error: e.message }
  }

  // 3. Test admin client (service role)
  try {
    const admin = await createAdminClient()
    const { data, error } = await admin
      .from('english_tests')
      .select('id, title, is_active')
    results['admin_list_tests'] = { ok: !error, data, error }
  } catch (e: any) {
    results['admin_list_tests'] = { ok: false, error: e.message }
  }

  // 4. Test anon insert attempt
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('english_test_attempts')
      .insert({ test_id: '00000000-0000-0000-0000-000000000001', lead_name: 'Debug', lead_email: 'debug@test.com' })
      .select()
    results['anon_insert_attempt'] = { ok: !error, data, error }
    if (data?.[0]?.id) {
      await supabase.from('english_test_attempts').delete().eq('id', data[0].id)
    }
  } catch (e: any) {
    results['anon_insert_attempt'] = { ok: false, error: e.message }
  }

  // 5. Check env vars
  results['env'] = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
    anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `present (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...)` : 'missing',
    service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? `present (${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 20)}...)` : 'missing',
  }

  return NextResponse.json(results)
}
