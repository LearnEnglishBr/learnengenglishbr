'use client'

import { updateSiteContentAction } from '@/actions/site-content'

export function CTASectionForm({ content }: { content: Record<string, any> }) {
  const fields = [
    { key: 'title', label: 'Título' },
    { key: 'subtitle', label: 'Subtítulo' },
    { key: 'button_text', label: 'Texto do Botão' },
    { key: 'button_href', label: 'Link do Botão' },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Seção CTA Final</h3>
      {fields.map(f => (
        <form key={f.key} action={updateSiteContentAction} className="space-y-2 border-b border-border pb-4 last:border-0">
          <input type="hidden" name="section" value="cta" />
          <input type="hidden" name="key" value={f.key} />
          <label className="text-sm font-medium">{f.label}</label>
          {f.key === 'subtitle' ? (
            <textarea name="value" defaultValue={content[f.key] || ''} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          ) : (
            <input type="text" name="value" defaultValue={content[f.key] || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          )}
          <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
        </form>
      ))}
    </div>
  )
}
