'use client'

import { updateSiteContentBilingualAction } from '@/actions/site-content'
import { pt, en } from '@/lib/site-content'

export function SocialProofForm({ content }: { content: Record<string, any> }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Seção Social Proof <span className="text-xs text-muted-foreground font-normal">(PT | EN)</span></h3>
      {[1, 2].map(i => (
        <form key={i} action={updateSiteContentBilingualAction} className="space-y-2 border-b border-border pb-4 last:border-0">
          <input type="hidden" name="section" value="social_proof" />
          <input type="hidden" name="key" value={`paragraph_${i}`} />
          <label className="text-sm font-medium">Parágrafo {i}</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block mb-1">PT</span>
              <textarea name="pt" defaultValue={pt(content[`paragraph_${i}`])} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground block mb-1">EN</span>
              <textarea name="en" defaultValue={en(content[`paragraph_${i}`])} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
            </div>
          </div>
          <button type="submit" className="text-xs text-primary hover:underline">Salvar</button>
        </form>
      ))}
    </div>
  )
}
