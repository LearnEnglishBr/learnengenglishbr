'use client'

import { useState } from 'react'
import { YouTubePlayer } from '@/components/player/YouTubePlayer'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, PlayCircle, Menu, X } from 'lucide-react'
import Link from 'next/link'

type Course = any
type Module = any
type Lesson = any

export function CoursePlayerClient({ course, modules, lessons }: { course: Course, modules: Module[], lessons: Lesson[] }) {
  // Estado da aula ativa
  const firstLesson = lessons.length > 0 ? lessons[0] : null
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(firstLesson)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>(modules.length > 0 ? [modules[0].id] : [])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-background overflow-hidden">
      
      {/* Botão Mobile Sidebar */}
      <div className="md:hidden p-4 border-b border-border bg-card flex items-center justify-between">
        <h1 className="font-bold truncate pr-4">{course.title}</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-muted rounded-md">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Área Principal (Vídeo e Descrição) */}
      <div className={`flex-1 overflow-y-auto ${sidebarOpen ? 'hidden md:block' : 'block'} relative`}>
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          
          {/* Breadcrumb Opcional */}
          <div className="text-sm text-muted-foreground mb-4 hidden md:block">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link> 
            <span className="mx-2">/</span> 
            <span>{course.title}</span>
          </div>

          {activeLesson ? (
            <div className="space-y-6">
              <YouTubePlayer url={activeLesson.video_url} />
              
              <div className="bg-card p-6 border border-border rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold">{activeLesson.position}. {activeLesson.title}</h2>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors rounded-full font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Marcar como Concluída
                  </button>
                </div>
                
                {activeLesson.content ? (
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
                    {activeLesson.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum material complementar adicionado para esta aula.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-card border border-border rounded-xl text-muted-foreground">
              <p>Nenhuma aula disponível neste curso ainda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Lista de Módulos e Aulas) */}
      <div className={`w-full md:w-80 lg:w-96 bg-card border-l border-border flex flex-col ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-lg hidden md:block">{course.title}</h2>
          <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">0% concluído</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {modules.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Nenhum conteúdo adicionado.</p>
          ) : (
            <div className="divide-y divide-border">
              {modules.map(mod => {
                const isExpanded = expandedModules.includes(mod.id)
                const modLessons = lessons.filter(l => l.module_id === mod.id)

                return (
                  <div key={mod.id} className="bg-card">
                    <button 
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="font-semibold text-sm">Módulo {mod.position}: {mod.title}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    {isExpanded && (
                      <div className="bg-background/50 divide-y divide-border/50">
                        {modLessons.length === 0 ? (
                          <div className="px-4 py-3 text-xs text-muted-foreground">Em breve...</div>
                        ) : (
                          modLessons.map(lesson => {
                            const isActive = activeLesson?.id === lesson.id
                            return (
                              <button 
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLesson(lesson)
                                  setSidebarOpen(false) // Fecha no mobile ao clicar
                                }}
                                className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors ${isActive ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted pl-[18px]'}`}
                              >
                                <div className="mt-0.5">
                                  {/* Aqui checaria se está concluído */}
                                  <Circle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm ${isActive ? 'font-semibold text-primary' : 'text-foreground'}`}>
                                    {lesson.position}. {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <PlayCircle className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Vídeo</span>
                                  </div>
                                </div>
                              </button>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
