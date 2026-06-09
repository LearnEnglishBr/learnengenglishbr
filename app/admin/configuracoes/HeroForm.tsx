'use client'

import { useState } from 'react'
import { updateSiteContentAction, saveHeroBenefitsAction } from '@/actions/site-content'
import { UploadButton } from './UploadButton'

export function HeroForm({ content, benefits }: { content: Record<string, any>; benefits: Array<{ id: string; text: string }> }) {
  const [benefitList, setBenefitList] = useState(benefits.map(b => ({ text: b.text })))

  const addBenefit = () => setBenefitList([...benefitList, { text: '' }])
  const removeBenefit = (i: number) => setBenefitList(benefitList.filter((_, idx) => idx !== i))
  const updateBenefit = (i: number, text: string) => {
    const copy = [...benefitList]
    copy[i] = { ...copy[i], text }
    setBenefitList(copy)
  }

  const fields = [
    { key: 'badge', label: 'Badge (Ex: Mais de 2.500 alunos)', type: 'text' as const },
    { key: 'title', label: 'Título Principal', type: 'text' as const },
    { key: 'subtitle', label: 'Subtítulo', type: 'textarea' as const },
    { key: 'cta_primary_text', label: 'Texto Botão Principal', type: 'text' as const },
    { key: 'cta_primary_href', label: 'Link Botão Principal', type: 'text' as const },
    { key: 'cta_secondary_text', label: 'Texto Botão Secundário', type: 'text' as const },
    { key: 'cta_secondary_href', label: 'Link Botão Secundário', type: 'text' as const },
    { key: 'social_proof_text', label: 'Texto Prova Social', type: 'text' as const },
  ]

  return (
    <div className="space-y-6">
      <form action={updateSiteContentAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <input type="hidden" name="section" value="hero" />
        {fields.map(f => (
          <div key={f.key}>
            <input type="hidden" name="key" value={f.key} />
            <div className="space-y-2">
              <label className="text-sm font-medium">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea name="value" defaultValue={content[f.key] || ''} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              ) : (
                <input type="text" name="value" defaultValue={content[f.key] || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              )}
            </div>
            <button type="submit" className="mt-2 text-xs text-primary hover:underline">Salvar campo</button>
          </div>
        ))}
      </form>

      {/* Main Image */}
      <form action={updateSiteContentAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <input type="hidden" name="section" value="hero" />
        <input type="hidden" name="key" value="main_image" />
        <h3 className="font-semibold">Imagem Principal da Hero</h3>
        <div className="flex gap-2">
          <input id="hero-main-image" type="text" name="value" defaultValue={content.main_image || '/images/principal.jpg'} className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          <UploadButton onUpload={(url) => {
            const input = document.getElementById('hero-main-image') as HTMLInputElement
            if (input) input.value = url
          }} />
        </div>
        <button type="submit" className="text-xs text-primary hover:underline">Salvar imagem</button>
      </form>

      {/* Benefits */}
      <form action={saveHeroBenefitsAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Benefícios (Grid de 4 itens)</h3>
        <div className="space-y-3">
          {benefitList.map((b, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={b.text} onChange={e => updateBenefit(i, e.target.value)} className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Ex: Aulas ao vivo" />
              <button type="button" onClick={() => removeBenefit(i)} className="text-destructive text-sm hover:underline">Remover</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addBenefit} className="text-sm text-primary hover:underline">+ Adicionar benefício</button>
        <input type="hidden" name="benefits" value={JSON.stringify(benefitList)} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Benefícios</button>
        </div>
      </form>
    </div>
  )
}
