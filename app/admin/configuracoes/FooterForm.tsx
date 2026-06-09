'use client'

import { useState } from 'react'
import { saveFooterColumnsAction } from '@/actions/site-content'

export function FooterForm({ footerColumns, socialLinks }: {
  footerColumns: Array<{ id: string; title: string; links: Array<{ label: string; href: string }> }>
  socialLinks: Array<{ id: string; platform: string; url: string }>
}) {
  const [cols, setCols] = useState(footerColumns.map(c => ({ title: c.title, links: c.links.map(l => ({ label: l.label, href: l.href })) })))

  const addColumn = () => setCols([...cols, { title: '', links: [] }])
  const removeColumn = (i: number) => setCols(cols.filter((_, idx) => idx !== i))
  const updateCol = (i: number, title: string) => {
    const copy = [...cols]; copy[i] = { ...copy[i], title }; setCols(copy)
  }

  const addLink = (colIdx: number) => {
    const copy = [...cols]; copy[colIdx] = { ...copy[colIdx], links: [...copy[colIdx].links, { label: '', href: '' }] }; setCols(copy)
  }
  const removeLink = (colIdx: number, linkIdx: number) => {
    const copy = [...cols]; copy[colIdx].links = copy[colIdx].links.filter((_, idx) => idx !== linkIdx); setCols(copy)
  }
  const updateLink = (colIdx: number, linkIdx: number, field: string, value: string) => {
    const copy = [...cols]; (copy[colIdx].links[linkIdx] as any)[field] = value; setCols(copy)
  }

  return (
    <form action={saveFooterColumnsAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Colunas do Footer</h3>
      {cols.map((col, ci) => (
        <div key={ci} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <input type="text" value={col.title} onChange={e => updateCol(ci, e.target.value)} placeholder="Título da coluna" className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium" />
            <button type="button" onClick={() => removeColumn(ci)} className="text-destructive text-xs hover:underline ml-2">Remover coluna</button>
          </div>
          {col.links.map((link, li) => (
            <div key={li} className="flex gap-2 items-center ml-4">
              <input type="text" value={link.label} onChange={e => updateLink(ci, li, 'label', e.target.value)} placeholder="Label" className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input type="text" value={link.href} onChange={e => updateLink(ci, li, 'href', e.target.value)} placeholder="/url" className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <button type="button" onClick={() => removeLink(ci, li)} className="text-destructive text-xs hover:underline">Remover</button>
            </div>
          ))}
          <button type="button" onClick={() => addLink(ci)} className="text-xs text-primary hover:underline">+ Adicionar link</button>
        </div>
      ))}
      <button type="button" onClick={addColumn} className="text-sm text-primary hover:underline">+ Adicionar coluna</button>
      <input type="hidden" name="data" value={JSON.stringify(cols)} />
      <div className="flex justify-end pt-2">
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Footer</button>
      </div>
    </form>
  )
}
