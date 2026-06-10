'use client'

import { useState } from 'react'
import { updateSiteContentBilingualAction, saveMethodologyStepsAction } from '@/actions/site-content'
import { pt, en } from '@/lib/site-content'

export function MethodologyForm({ content, steps }: { content: Record<string, any>; steps: Array<{ id: string; step_number: string; title: string; description: string; icon_name: string; icon_color: string }> }) {
  const [stepList, setStepList] = useState(steps.map(s => ({ step_number: s.step_number, title: s.title, description: s.description, icon_name: s.icon_name, icon_color: s.icon_color })))

  const addStep = () => setStepList([...stepList, { step_number: String(stepList.length + 1).padStart(2, '0'), title: '', description: '', icon_name: 'BookOpen', icon_color: 'text-primary' }])
  const removeStep = (i: number) => setStepList(stepList.filter((_, idx) => idx !== i))
  const updateStep = (i: number, field: string, value: string) => {
    const copy = [...stepList]
    ;(copy[i] as any)[field] = value
    setStepList(copy)
  }

  const textFields = [
    { key: 'title', label: 'Título da Seção' },
    { key: 'paragraph_1', label: 'Parágrafo 1' },
    { key: 'paragraph_2', label: 'Parágrafo 2' },
    { key: 'paragraph_3', label: 'Parágrafo 3' },
    { key: 'section_subtitle', label: 'Subtítulo da Seção' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Textos da Seção <span className="text-xs text-muted-foreground font-normal">(PT | EN)</span></h3>
        {textFields.map(f => (
          <form key={f.key} action={updateSiteContentBilingualAction} className="space-y-2 border-b border-border pb-4 last:border-0">
            <input type="hidden" name="section" value="methodology" />
            <input type="hidden" name="key" value={f.key} />
            <label className="text-sm font-medium">{f.label}</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block mb-1">PT</span>
                <textarea name="pt" defaultValue={pt(content[f.key])} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block mb-1">EN</span>
                <textarea name="en" defaultValue={en(content[f.key])} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              </div>
            </div>
            <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
          </form>
        ))}
      </div>

      <form action={saveMethodologyStepsAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Passos da Metodologia (4 passos)</h3>
        {stepList.map((s, i) => (
          <div key={i} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-primary">Passo {s.step_number}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-destructive text-xs hover:underline">Remover</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Número</label>
                <input type="text" value={s.step_number} onChange={e => updateStep(i, 'step_number', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Título</label>
                <input type="text" value={s.title} onChange={e => updateStep(i, 'title', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground">Descrição</label>
                <textarea value={s.description} onChange={e => updateStep(i, 'description', e.target.value)} className="w-full min-h-[50px] rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Ícone (Lucide name)</label>
                <input type="text" value={s.icon_name} onChange={e => updateStep(i, 'icon_name', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Cor do Ícone (Tailwind)</label>
                <input type="text" value={s.icon_color} onChange={e => updateStep(i, 'icon_color', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addStep} className="text-sm text-primary hover:underline">+ Adicionar passo</button>
        <input type="hidden" name="steps" value={JSON.stringify(stepList)} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Passos</button>
        </div>
      </form>
    </div>
  )
}
