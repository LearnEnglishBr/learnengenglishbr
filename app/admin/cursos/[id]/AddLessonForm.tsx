'use client'

import { createLessonAction } from '@/actions/courses'
import { Plus } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

export function AddLessonForm({ moduleId, courseId, nextPosition }: { moduleId: string, courseId: string, nextPosition: number }) {
  const [state, action, isPending] = useActionState(createLessonAction, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {state?.error && <p className="text-sm text-destructive w-full absolute -top-6">{state.error}</p>}
      
      <input type="hidden" name="moduleId" value={moduleId} />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="position" value={nextPosition} />
      <input type="hidden" name="type" value="VIDEO" />
      
      <div className="flex-1 w-full">
        <input 
          type="text" 
          name="title" 
          required
          placeholder="Nome da Aula" 
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex-1 w-full">
        <input 
          type="url" 
          name="videoUrl" 
          required
          placeholder="URL do YouTube (Não Listado)" 
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50 whitespace-nowrap"
      >
        {isPending ? '...' : <><Plus className="w-4 h-4 mr-1" /> Adicionar</>}
      </button>
    </form>
  )
}
