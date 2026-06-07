import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CoursePlayerClient } from './CoursePlayerClient'

export default async function DashboardCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Checar Autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Carregar o Curso pelo Slug
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!course) return notFound()

  // 3. Verificação de DRM (Segurança de Compra)
  // O usuário precisa ter uma compra COMPLETED deste curso. Se não, não carrega as aulas.
  // IMPORTANTE: Como estamos testando, vamos permitir ADMIN passar direto.
  let hasAccess = false

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role === 'ADMIN') {
    hasAccess = true // Admins podem assistir tudo
  } else {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'COMPLETED')
      .single()

    if (purchase) {
      hasAccess = true
    }
  }

  // Se não tem acesso, bloqueia!
  if (!hasAccess) {
    redirect(`/cursos/${course.slug}`) // Manda para a página de vendas
  }

  // 4. Carregar Módulos e Aulas
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('position', { ascending: true })

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .in('module_id', modules?.map(m => m.id) || [])
    .order('position', { ascending: true })

  // 5. Renderiza a Interface do Cliente do Player
  return (
    <CoursePlayerClient 
      course={course} 
      modules={modules || []} 
      lessons={lessons || []} 
    />
  )
}
