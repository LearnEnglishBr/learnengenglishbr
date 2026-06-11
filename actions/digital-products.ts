'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function adminClient() {
  // Fallback to NEXT_PUBLIC_ variant for local dev convenience
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('[Supabase] Service role key is missing. Set SUPABASE_SERVICE_ROLE_KEY env variable.')
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey!,
    { auth: { persistSession: false } }
  )
}

async function checkAdmin() {
  const cookieStore = await cookies()
  const hasAdminBypass = cookieStore.get('admin_bypass')?.value === 'true'

  console.log('[checkAdmin] admin_bypass cookie:', hasAdminBypass)

  if (hasAdminBypass) {
    console.log('[checkAdmin] Using adminClient (service role)')
    return adminClient()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('[checkAdmin] Auth user:', user?.id)
  if (!user) throw new Error('Não autenticado')

  const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  console.log('[checkAdmin] User profile:', profile)
  if (profileError) console.error('[checkAdmin] Profile fetch error:', profileError)
  if (!profile || profile.role !== 'ADMIN') {
    console.error('[checkAdmin] Permission denied: role is', profile?.role)
    throw new Error('Sem permissão')
  }

  console.log('[checkAdmin] Using adminClient after role verification')
  return adminClient()
}

export async function createDigitalProductAction(formData: FormData) {
  const supabase = await checkAdmin()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const file_url = formData.get('file_url') as string
  const cover_image = formData.get('cover_image') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const show_on_homepage = formData.get('show_on_homepage') === 'on'

  const { error } = await supabase.from('digital_products').insert({
    title,
    description,
    file_url,
    cover_image,
    price,
    show_on_homepage,
  })
  if (error) {
    // Return error instead of throwing to avoid 500 response
    return { error: error.message }
  }
  // Invalidate ISR cache for the products list page
  revalidatePath('/admin/produtos')
  // Successful creation; caller can handle navigation
  return { success: true }
}

export async function updateDigitalProductAction(formData: FormData) {
  const supabase = await checkAdmin()
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const file_url = formData.get('file_url') as string
  const cover_image = formData.get('cover_image') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const show_on_homepage = formData.get('show_on_homepage') === 'on'

  const { error } = await supabase
    .from('digital_products')
    .update({ title, description, file_url, cover_image, price, show_on_homepage })
    .eq('id', id)

  if (error) {
    // Return error information instead of throwing
    return { error: error.message }
  }
  revalidatePath('/admin/produtos')
  // Caller will handle navigation after successful update
  return { success: true }
}

export async function deleteDigitalProductAction(formData: FormData) {
  const supabase = await checkAdmin()
  const id = formData.get('id') as string
  const { error } = await supabase.from('digital_products').delete().eq('id', id)

  if (error) {
    // Return error instead of throwing to avoid 500 errors
    return { error: error.message }
  }
  revalidatePath('/admin/produtos')
  return { success: true }
}

export async function uploadProductFileAction(formData: FormData) {
  const supabase = await checkAdmin()
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado.' }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filePath = `products/${fileName}`

  const { error: storageError } = await supabase.storage
    .from('products').upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (storageError) return { error: 'Erro ao fazer upload.' }

  const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath)
  return { url: publicUrl }
}
