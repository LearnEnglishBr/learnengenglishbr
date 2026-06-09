'use client'

import { updateSiteContentAction } from '@/actions/site-content'

export function CoursesForm({ content }: { content: Record<string, any> }) {
  const fields = [
    { key: 'title', label: 'Título da Seção' },
    { key: 'subtitle', label: 'Subtítulo' },
    { key: 'badge_text', label: 'Texto do Badge (Ex: Premium)' },
    { key: 'feature_1', label: 'Característica 1 (Ex: Vitalício)' },
    { key: 'feature_2', label: 'Característica 2 (Ex: Certificado)' },
    { key: 'feature_3', label: 'Característica 3 (Ex: Suporte VIP)' },
    { key: 'button_text', label: 'Texto do Botão (Ex: Matricular)' },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Textos da Seção de Cursos</h3>
      {fields.map(f => (
        <form key={f.key} action={updateSiteContentAction} className="space-y-2 border-b border-border pb-4 last:border-0">
          <input type="hidden" name="section" value="courses" />
          <input type="hidden" name="key" value={f.key} />
          <label className="text-sm font-medium">{f.label}</label>
          <input type="text" name="value" defaultValue={content[f.key] || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
        </form>
      ))}
      <p className="text-xs text-muted-foreground mt-4">Os cursos em si são gerenciados na seção "Cursos" do admin.</p>
    </div>
  )
}
