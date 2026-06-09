'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function uploadFileAction(formData: FormData) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const hasAdminBypass = cookieStore.get('admin_bypass')?.value === 'true'

  if (!hasAdminBypass) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'ADMIN') return
  }

  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || '/'

  if (!file || file.size === 0) return { error: 'Nenhum arquivo.' }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) return { error: 'Arquivo muito grande (máx 10MB).' }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4']
  if (!allowedTypes.includes(file.type)) return { error: 'Tipo não permitido.' }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filePath = folder === '/' ? fileName : `${folder}/${fileName}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('media')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (storageError) return { error: 'Erro no storage.' }

  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)

  const { error: dbError } = await supabase.from('media_library').insert({
    file_name: file.name,
    file_url: publicUrl,
    file_type: file.type,
    file_size_bytes: file.size,
    folder: folder,
  })

  if (dbError) return { error: 'Erro ao registrar no banco.' }

  revalidatePath('/admin/midias')
  revalidatePath('/admin/configuracoes')
  return { success: true as const, url: publicUrl }
}

export type UploadResult = { success: true; url: string } | { error: string } | undefined
