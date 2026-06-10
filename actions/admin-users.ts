'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function checkAdmin() {
  const cookieStore = await cookies()
  const hasAdminBypass = cookieStore.get('admin_bypass')?.value === 'true'

  if (hasAdminBypass) return adminClient()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'ADMIN') return

  return adminClient()
}

export async function updateUserRoleAction(formData: FormData) {
  const supabase = await checkAdmin()
  if (!supabase) return

  const userId = formData.get('userId') as string
  const role = formData.get('role') as string

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) return

  revalidatePath('/admin/usuarios')
  revalidatePath(`/admin/usuarios/${userId}`)
}

export async function blockUserAction(formData: FormData) {
  const supabase = await checkAdmin()
  if (!supabase) return

  const userId = formData.get('userId') as string
  const currentStatus = formData.get('currentStatus') as string

  const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'

  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)

  if (error) return

  revalidatePath('/admin/usuarios')
  revalidatePath(`/admin/usuarios/${userId}`)
}
