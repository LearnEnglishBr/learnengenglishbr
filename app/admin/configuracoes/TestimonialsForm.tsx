'use client'

import { useActionState } from 'react'
import { saveTestimonialAction, deleteTestimonialAction } from '@/actions/site-content'
import { useState } from 'react'

export function TestimonialsForm({ testimonials }: { testimonials: Array<{ id: string; name: string; role: string; content: string; image_url: string | null; rating: number }> }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Depoimentos</h3>
          <button onClick={() => { setEditingId(null); setIsAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">
            + Novo Depoimento
          </button>
        </div>

        {testimonials.map(t => (
          <div key={t.id} className="border border-border rounded-lg p-4 mb-4">
            {editingId === t.id ? (
              <TestimonialForm testimonial={t} onClose={() => setEditingId(null)} />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {t.image_url && <img src={t.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">"{t.content}"</p>
                  <p className="text-yellow-500 text-xs mt-1">{'★'.repeat(t.rating)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(t.id); setIsAdding(false) }} className="text-xs text-primary hover:underline">Editar</button>
                  <form action={deleteTestimonialAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-xs text-destructive hover:underline">Excluir</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-muted-foreground text-sm">Nenhum depoimento cadastrado.</p>}
      </div>

      {isAdding && !editingId && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <TestimonialForm testimonial={null} onClose={() => setIsAdding(false)} />
        </div>
      )}
    </div>
  )
}

function TestimonialForm({ testimonial, onClose }: { testimonial: { id?: string; name?: string; role?: string; content?: string; image_url?: string | null; rating?: number } | null; onClose: () => void }) {
  const [state, action, isPending] = useActionState(saveTestimonialAction, undefined)

  return (
    <form action={action} className="space-y-4">
      {testimonial?.id && <input type="hidden" name="id" value={testimonial.id} />}
      {state?.error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{state.error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nome</label>
          <input type="text" name="name" defaultValue={testimonial?.name || ''} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Cargo</label>
          <input type="text" name="role" defaultValue={testimonial?.role || ''} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Depoimento</label>
        <textarea name="content" defaultValue={testimonial?.content || ''} required className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">URL da Foto</label>
          <input type="text" name="image_url" defaultValue={testimonial?.image_url || ''} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Avaliação (1-5)</label>
          <input type="number" name="rating" min={1} max={5} defaultValue={testimonial?.rating || 5} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="h-9 px-4 rounded-md border border-input text-sm font-medium hover:bg-muted">Cancelar</button>
        <button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium disabled:opacity-50">
          {isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
