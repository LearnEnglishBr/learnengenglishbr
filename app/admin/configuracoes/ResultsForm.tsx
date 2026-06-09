'use client'

import { useState } from 'react'
import { saveSiteStatsAction } from '@/actions/site-content'

export function ResultsForm({ stats }: { stats: Array<{ id: string; label: string; value_prefix: string; value_suffix: string; value_type: string }> }) {
  const [statList, setStatList] = useState(stats.map(s => ({ label: s.label, prefix: s.value_prefix, suffix: s.value_suffix, value_type: s.value_type })))

  const addStat = () => setStatList([...statList, { label: '', prefix: '', suffix: '', value_type: 'number' }])
  const removeStat = (i: number) => setStatList(statList.filter((_, idx) => idx !== i))
  const updateStat = (i: number, field: string, value: string) => {
    const copy = [...statList]; (copy[i] as any)[field] = value; setStatList(copy)
  }

  return (
    <form action={saveSiteStatsAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Estatísticas (Seção Resultados)</h3>
      {statList.map((s, i) => (
        <div key={i} className="p-4 border border-border rounded-lg grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Label</label>
            <input type="text" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Prefixo</label>
            <input type="text" value={s.prefix} onChange={e => updateStat(i, 'prefix', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="+"/>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Sufixo</label>
            <input type="text" value={s.suffix} onChange={e => updateStat(i, 'suffix', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="%"/>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Tipo</label>
            <select value={s.value_type} onChange={e => updateStat(i, 'value_type', e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="number">Número inteiro</option>
              <option value="decimal">Decimal (4.9)</option>
            </select>
            <button type="button" onClick={() => removeStat(i)} className="text-destructive text-xs hover:underline mt-1">Remover</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addStat} className="text-sm text-primary hover:underline">+ Adicionar estatística</button>
      <input type="hidden" name="stats" value={JSON.stringify(statList)} />
      <div className="flex justify-end pt-2">
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Estatísticas</button>
      </div>
    </form>
  )
}
