'use client'

import { updateBrandingAction } from '@/actions/site-content'
import { UploadButton } from './UploadButton'

export function SettingsForm({ settings }: { settings: any }) {
  return (
    <form action={updateBrandingAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
      <input type="hidden" name="id" value={settings?.id || ''} />

      <div>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Identidade Visual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Site</label>
            <input type="text" name="site_name" defaultValue={settings?.site_name || 'LearningEnglishBR'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline</label>
            <input type="text" name="site_tagline" defaultValue={settings?.site_tagline || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição Global (SEO)</label>
            <textarea name="site_description" defaultValue={settings?.site_description || ''} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto do Logo (Header)</label>
            <input type="text" name="header_logo_text" defaultValue={settings?.header_logo_text || 'Learneng English BR'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <div className="flex gap-2">
              <input type="text" name="logo_url" defaultValue={settings?.logo_url || '/images/logo-learnenglish-br.png'} className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              <UploadButton onUpload={(url) => {
                const input = document.querySelector('input[name="logo_url"]') as HTMLInputElement
                if (input) input.value = url
              }} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Favicon URL</label>
            <input type="text" name="favicon_url" defaultValue={settings?.favicon_url || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">OG Image URL (Compartilhamento)</label>
            <div className="flex gap-2">
              <input type="text" name="og_image_url" defaultValue={settings?.og_image_url || '/og-image.jpg'} className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
              <UploadButton onUpload={(url) => {
                const input = document.querySelector('input[name="og_image_url"]') as HTMLInputElement
                if (input) input.value = url
              }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Cores do Tema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: 'theme_primary_color', label: 'Cor Primária', default: '#B62C27' },
            { name: 'theme_secondary_color', label: 'Cor Secundária', default: '#FDB62F' },
            { name: 'theme_accent_color', label: 'Cor de Destaque', default: '#FDB62F' },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <label className="text-sm font-medium">{color.label}</label>
              <div className="flex gap-2">
                <input type="color" name={color.name} defaultValue={settings?.[color.name] || color.default} className="h-10 w-10 p-0 border-0 rounded-md cursor-pointer" />
                <input type="text" defaultValue={settings?.[color.name] || color.default} className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" readOnly />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Footer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição do Footer</label>
            <textarea name="footer_description" defaultValue={settings?.footer_description || ''} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto de Copyright</label>
            <input type="text" name="copyright_text" defaultValue={settings?.copyright_text || 'Learneng English BR. Todos os direitos reservados.'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 rounded-md text-sm font-medium transition-colors">
          Salvar Configurações
        </button>
      </div>
    </form>
  )
}
