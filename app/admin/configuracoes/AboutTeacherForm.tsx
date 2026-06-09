'use client'

import { updateSiteContentAction } from '@/actions/site-content'

export function AboutTeacherForm({ content }: { content: Record<string, any> }) {
  const textFields = [
    { key: 'title', label: 'Título da Seção' },
    { key: 'name', label: 'Nome do Professor' },
    { key: 'bio_paragraph_1', label: 'Biografia - Parágrafo 1' },
    { key: 'bio_paragraph_2', label: 'Biografia - Parágrafo 2' },
    { key: 'bio_paragraph_3', label: 'Biografia - Parágrafo 3' },
    { key: 'info_box_1_title', label: 'Info Box 1 - Título' },
    { key: 'info_box_1_text', label: 'Info Box 1 - Texto' },
    { key: 'info_box_2_title', label: 'Info Box 2 - Título' },
    { key: 'info_box_2_text', label: 'Info Box 2 - Texto' },
    { key: 'info_box_3_title', label: 'Info Box 3 - Título' },
    { key: 'info_box_3_text', label: 'Info Box 3 - Texto' },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Seção "Sobre o Professor"</h3>
      {textFields.map(f => (
        <form key={f.key} action={updateSiteContentAction} className="space-y-2 border-b border-border pb-4 last:border-0">
          <input type="hidden" name="section" value="about_teacher" />
          <input type="hidden" name="key" value={f.key} />
          <label className="text-sm font-medium">{f.label}</label>
          <textarea name="value" defaultValue={content[f.key] || ''} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
        </form>
      ))}
      <p className="text-xs text-muted-foreground">As fotos da galeria são gerenciadas na aba "Galeria Fotos".</p>
    </div>
  )
}
