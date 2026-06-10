'use client'

import { useState } from 'react'
import { updateSiteContentBilingualAction, saveWhyChooseItemsAction } from '@/actions/site-content'
import { pt, en } from '@/lib/bilingual'

export function WhyChooseForm({ content, items }: { content: Record<string, any>; items: Array<{ id: string; icon_name: string; title: string; description: string }> }) {
  const [itemList, setItemList] = useState(items.map(s => ({ icon_name: s.icon_name, title: s.title, description: s.description })))

  const addItem = () => setItemList([...itemList, { icon_name: 'Brain', title: '', description: '' }])
  const removeItem = (i: number) => setItemList(itemList.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, value: string) => {
    const copy = [...itemList]
    ;(copy[i] as any)[field] = value
    setItemList(copy)
  }

  return (
    <div className="space-y-6">
      <form action={updateSiteContentBilingualAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <input type="hidden" name="section" value="why_choose" />
        <input type="hidden" name="key" value="title" />
        <div className="space-y-2">
          <label className="text-sm font-medium">Título da Seção <span className="text-xs text-muted-foreground">(PT | EN)</span></label>
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block mb-1">PT</span>
              <textarea name="pt" defaultValue={pt(content.title)} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block mb-1">EN</span>
              <textarea name="en" defaultValue={en(content.title)} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
            </div>
          </div>
        </div>
        <button type="submit" className="text-xs text-primary hover:underline">Salvar título</button>
      </form>

      <form action={saveWhyChooseItemsAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Itens (4 itens)</h3>
        {itemList.map((s, i) => (
          <div key={i} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-primary">Item {i + 1}</span>
              <button type="button" onClick={() => removeItem(i)} className="text-destructive text-xs hover:underline">Remover</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Título</label>
                <input type="text" value={s.title} onChange={e => updateItem(i, 'title', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Ícone (Lucide name)</label>
                <input type="text" value={s.icon_name} onChange={e => updateItem(i, 'icon_name', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground">Descrição</label>
                <textarea value={s.description} onChange={e => updateItem(i, 'description', e.target.value)} className="w-full min-h-[50px] rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-sm text-primary hover:underline">+ Adicionar item</button>
        <input type="hidden" name="items" value={JSON.stringify(itemList)} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Itens</button>
        </div>
      </form>
    </div>
  )
}