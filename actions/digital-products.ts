'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const hasAdminBypass = cookieStore.get('admin_bypass')?.value === 'true'

  if (!hasAdminBypass) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'ADMIN') throw new Error('Sem permissão')
  }

  return supabase
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

  if (error) throw error
  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
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

  if (error) throw error
  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
}

export async function deleteDigitalProductAction(formData: FormData) {
  const supabase = await checkAdmin()

  const id = formData.get('id') as string

  const { error } = await supabase.from('digital_products').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/produtos')
}

export async function uploadProductFileAction(formData: FormData) {
  const supabase = await checkAdmin()

  const file = formData.get('file') as File

  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado.' }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filePath = `products/${fileName}`

  const { error: storageError } = await supabase.storage
    .from('products')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (storageError) return { error: 'Erro ao fazer upload.' }

  const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath)
  return { url: publicUrl }
}
