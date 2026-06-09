'use client'

import { useState } from 'react'
import { saveNavigationLinksAction, saveSocialLinksAction } from '@/actions/site-content'
import { UploadButton } from './UploadButton'

export function HeaderForm({ navLinks, socialLinks }: { navLinks: Array<{ id: string; label: string; href: string }>; socialLinks: Array<{ id: string; platform: string; url: string }> }) {
  const [navs, setNavs] = useState(navLinks.map(n => ({ label: n.label, href: n.href })))
  const [socials, setSocials] = useState(socialLinks.map(s => ({ platform: s.platform, url: s.url })))

  const addNav = () => setNavs([...navs, { label: '', href: '' }])
  const removeNav = (i: number) => setNavs(navs.filter((_, idx) => idx !== i))
  const updateNav = (i: number, field: string, value: string) => {
    const copy = [...navs]; (copy[i] as any)[field] = value; setNavs(copy)
  }

  const addSocial = () => setSocials([...socials, { platform: '', url: '' }])
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i))
  const updateSocial = (i: number, field: string, value: string) => {
    const copy = [...socials]; (copy[i] as any)[field] = value; setSocials(copy)
  }

  return (
    <div className="space-y-6">
      <form action={saveNavigationLinksAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Links de Navegação (Header)</h3>
        {navs.map((n, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={n.label} onChange={e => updateNav(i, 'label', e.target.value)} placeholder="Label" className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input type="text" value={n.href} onChange={e => updateNav(i, 'href', e.target.value)} placeholder="#secao" className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <button type="button" onClick={() => removeNav(i)} className="text-destructive text-sm hover:underline">Remover</button>
          </div>
        ))}
        <button type="button" onClick={addNav} className="text-sm text-primary hover:underline">+ Adicionar link</button>
        <input type="hidden" name="links" value={JSON.stringify(navs)} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Navegação</button>
        </div>
      </form>

      <form action={saveSocialLinksAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Redes Sociais (Header + Footer)</h3>
        <p className="text-xs text-muted-foreground">Plataformas suportadas: instagram, youtube, tiktok, twitter, facebook, linkedin</p>
        {socials.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={s.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} placeholder="instagram" className="w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input type="text" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} placeholder="URL completa" className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <button type="button" onClick={() => removeSocial(i)} className="text-destructive text-sm hover:underline">Remover</button>
          </div>
        ))}
        <button type="button" onClick={addSocial} className="text-sm text-primary hover:underline">+ Adicionar rede</button>
        <input type="hidden" name="links" value={JSON.stringify(socials)} />
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Redes Sociais</button>
        </div>
      </form>
    </div>
  )
}
