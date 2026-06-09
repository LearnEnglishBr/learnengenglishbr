'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const fields: Record<string, any> = {}
  const fieldNames = ['full_name', 'phone', 'birth_date', 'gender', 'street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zip_code', 'country']
  for (const name of fieldNames) {
    const val = formData.get(name)
    if (val) fields[name] = val
  }

  const { error } = await adminClient().from('profiles').update(fields).eq('id', user.id)
  if (error) throw error
  revalidatePath('/dashboard/profile')
}

export async function uploadAvatarAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { cacheControl: '3600', upsert: true })
  if (uploadError) return

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

  await adminClient().from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
  revalidatePath('/dashboard/profile')
}

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const password = formData.get('password') as string | null
  if (!password || password.length < 6) return

  await supabase.auth.updateUser({ password })
  revalidatePath('/dashboard/settings')
}

export async function updateSettingsAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const preferred_language = formData.get('preferred_language') as string
  const timezone = formData.get('timezone') as string
  const email_notifications = formData.get('email_notifications') === 'on'

  const { error } = await adminClient().from('profiles').update({
    preferred_language,
    timezone,
    email_notifications,
  }).eq('id', user.id)

  if (error) throw error
  revalidatePath('/dashboard/settings')
}
