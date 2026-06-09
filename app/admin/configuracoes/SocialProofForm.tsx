'use client'

import { updateSiteContentAction } from '@/actions/site-content'

export function SocialProofForm({ content }: { content: Record<string, any> }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Seção Social Proof</h3>
      {[1, 2].map(i => (
        <form key={i} action={updateSiteContentAction} className="space-y-2 border-b border-border pb-4 last:border-0">
          <input type="hidden" name="section" value="social_proof" />
          <input type="hidden" name="key" value={`paragraph_${i}`} />
          <label className="text-sm font-medium">Parágrafo {i}</label>
          <textarea name="value" defaultValue={content[`paragraph_${i}`] || ''} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
        </form>
      ))}
    </div>
  )
}
