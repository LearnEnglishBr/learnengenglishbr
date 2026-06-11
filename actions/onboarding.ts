'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function completeOnboardingAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado' }

  const fields: Record<string, any> = {
    id: user.id,
    email: user.email,
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    cpf: formData.get('cpf'),
    zip_code: formData.get('zip_code'),
    street: formData.get('street'),
    number: formData.get('number'),
    complement: formData.get('complement') || null,
    neighborhood: formData.get('neighborhood'),
    city: formData.get('city'),
    state: formData.get('state'),
    country: formData.get('country') || 'Brasil',
    terms_accepted: formData.get('terms') === 'on',
    privacy_accepted: formData.get('terms') === 'on',
    accepted_at: new Date().toISOString(),
  }

  const { error } = await adminClient().from('profiles').upsert(fields, { onConflict: 'id' })
  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
