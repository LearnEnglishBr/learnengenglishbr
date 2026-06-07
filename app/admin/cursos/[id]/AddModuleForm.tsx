'use client'

import { createModuleAction } from '@/actions/courses'
import { Plus } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

export function AddModuleForm({ courseId, nextPosition }: { courseId: string, nextPosition: number }) {
  const [state, action, isPending] = useActionState(createModuleAction, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="position" value={nextPosition} />
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Nome do Módulo</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required
          placeholder="Ex: Módulo 1 - O Básico" 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? 'Salvando...' : <><Plus className="w-4 h-4" /> Criar Módulo</>}
      </button>
    </form>
  )
}
