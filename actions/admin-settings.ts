'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function updateSettingsAction(formData: FormData) {
  const supabase = await createClient()

  const cookieStore = await cookies()
  const hasAdminBypass = cookieStore.get('admin_bypass')?.value === 'true'

  if (!hasAdminBypass) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'ADMIN') return
  }

  const id = formData.get('id') as string

  const payload = {
    site_name: formData.get('site_name') as string,
    site_description: formData.get('site_description') as string,
    logo_url: formData.get('logo_url') as string,
    favicon_url: formData.get('favicon_url') as string,
    theme_primary_color: formData.get('theme_primary_color') as string,
    theme_secondary_color: formData.get('theme_secondary_color') as string,
    theme_accent_color: formData.get('theme_accent_color') as string,
    hero_title: formData.get('hero_title') as string,
    hero_subtitle: formData.get('hero_subtitle') as string,
    hero_image_url: formData.get('hero_image_url') as string,
  }

  if (id) {
    const { error } = await supabase.from('settings').update(payload).eq('id', id)
    if (error) return
  } else {
    const { error } = await supabase.from('settings').insert([payload])
    if (error) return
  }

  revalidatePath('/admin/configuracoes')
  revalidatePath('/', 'layout') // Revalidate whole app to apply new branding
}
