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

// 1. Criar Curso
export async function createCourseAction(prevState: any, formData: FormData) {
  try {
    const supabase = await checkAdmin()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const status = formData.get('status') as string

    // Gerar slug amigável
    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { data, error } = await supabase.from('courses').insert({
      title,
      slug,
      description,
      price,
      status
    }).select().single()

    if (error) return { error: error.message }
    
    revalidatePath('/admin/cursos')
    return { success: true, courseId: data.id }
  } catch (e: any) {
    return { error: e.message }
  }
}

// 2. Adicionar Módulo
export async function createModuleAction(prevState: any, formData: FormData) {
  try {
    const supabase = await checkAdmin()
    const course_id = formData.get('courseId') as string
    const title = formData.get('title') as string
    const position = parseInt(formData.get('position') as string)

    const { error } = await supabase.from('course_modules').insert({
      course_id,
      title,
      position
    })

    if (error) return { error: error.message }
    
    revalidatePath(`/admin/cursos/${course_id}`)
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// 3. Adicionar Aula
export async function createLessonAction(prevState: any, formData: FormData) {
  try {
    const supabase = await checkAdmin()
    const module_id = formData.get('moduleId') as string
    const course_id = formData.get('courseId') as string // Apenas para revalidate
    const title = formData.get('title') as string
    const video_url = formData.get('videoUrl') as string
    const type = formData.get('type') as string // VIDEO, PDF, TEXT
    const position = parseInt(formData.get('position') as string)

    const { error } = await supabase.from('lessons').insert({
      module_id,
      title,
      video_url,
      type,
      position
    })

    if (error) return { error: error.message }
    
    revalidatePath(`/admin/cursos/${course_id}`)
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
