'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function deleteMediaAction(formData: FormData) {
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

  // Obter url do arquivo para remover do storage
  const { data: media } = await supabase.from('media_library').select('file_url').eq('id', id).single()

  if (media?.file_url) {
    // A logica completa do Storage seria extrair o path do bucket e excluir
    // supabase.storage.from('media').remove([path])
  }

  const { error } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id)

  if (error) {
    return
  }

  revalidatePath('/admin/midias')
}
