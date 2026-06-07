'use client'

import { createCourseAction } from '@/actions/courses'
import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovoCursoPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(createCourseAction, undefined)

  useEffect(() => {
    if (state?.success && state.courseId) {
      router.push(`/admin/cursos/${state.courseId}`)
    }
  }, [state, router])

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cursos" className="p-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
          <p className="text-muted-foreground">Preencha as informações básicas do curso.</p>
        </div>
      </div>

      <form action={action} className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm space-y-6">
        {state?.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Título do Curso</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required
            placeholder="Ex: Inglês para Viagens" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição Breve</label>
          <textarea 
            id="description" 
            name="description" 
            rows={3}
            placeholder="O que o aluno vai aprender neste curso?" 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">Preço (R$)</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              step="0.01"
              min="0"
              required
              placeholder="197.00" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select 
              id="status" 
              name="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="DRAFT">Rascunho (Oculto)</option>
              <option value="PUBLISHED">Publicado (Visível)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : <><Save className="w-4 h-4" /> Criar Curso</>}
          </button>
        </div>
      </form>
    </div>
  )
}
