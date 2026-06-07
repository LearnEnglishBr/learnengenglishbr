import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Plus, Video, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddModuleForm } from './AddModuleForm'
import { AddLessonForm } from './AddLessonForm'

export default async function ManageCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Carrega o curso
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!course) return notFound()

  // 2. Carrega os módulos
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('position', { ascending: true })

  // 3. Carrega as aulas
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .in('module_id', modules?.map(m => m.id) || [])
    .order('position', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cursos" className="p-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Gerencie o conteúdo estrutural deste curso.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Lista de Módulos e Aulas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Conteúdo Programático</h2>
          </div>

          {!modules || modules.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">Este curso ainda não tem nenhum módulo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((mod) => {
                const moduleLessons = lessons?.filter(l => l.module_id === mod.id) || []
                return (
                  <div key={mod.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {/* Cabeçalho do Módulo */}
                    <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-primary font-bold">{mod.position}.</span> {mod.title}
                      </h3>
                    </div>
                    
                    {/* Lista de Aulas */}
                    <div className="p-0">
                      {moduleLessons.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">Nenhuma aula neste módulo.</div>
                      ) : (
                        <ul className="divide-y divide-border">
                          {moduleLessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3">
                                {lesson.type === 'VIDEO' ? <PlayCircle className="w-4 h-4 text-primary" /> : <Video className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm font-medium">{lesson.position}. {lesson.title}</span>
                              </div>
                              {lesson.video_url && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md max-w-[200px] truncate">
                                  {lesson.video_url}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* Rodapé do Módulo (Adicionar Aula) */}
                    <div className="px-4 py-3 bg-muted/10 border-t border-border">
                      <AddLessonForm moduleId={mod.id} courseId={course.id} nextPosition={moduleLessons.length + 1} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Lado Direito: Formulário de Novo Módulo */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Novo Módulo
            </h2>
            <AddModuleForm courseId={course.id} nextPosition={(modules?.length || 0) + 1} />
          </div>
        </div>

      </div>
    </div>
  )
}
