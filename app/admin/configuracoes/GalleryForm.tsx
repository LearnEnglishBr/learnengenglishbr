'use client'

import { useState } from 'react'
import { saveGalleryImagesAction } from '@/actions/site-content'
import { UploadButton } from './UploadButton'

const DEFAULT_IMAGES = [
  '/images/1b633f1d-8a11-46fa-bb35-67a57ceb0820.jpg',
  '/images/1deed1b3-7c7f-412b-9b53-8c351abf6f78.jpg',
  '/images/70a978a5-8190-48a7-9e7f-01b66d726989.jpg',
  '/images/7580baee-1eae-4df3-a457-f6b4360ac460.jpg',
  '/images/77b455ab-4a7f-4cb7-b9aa-430ffd6fa1b2.jpg',
  '/images/997057a3-9025-4574-9fdc-ae64d89e0e2f.jpg',
  '/images/c2ad8f45-e651-40e8-aef8-b52cb6d9e9e8.jpg',
  '/images/d6ba8d73-2dc4-4466-96ee-711918c3695e.jpg',
  '/images/e9652d56-4de1-4684-b654-01a3cf8b3392.jpg',
  '/images/ed1f1591-ba81-4efb-bc0b-40d422a7d54a.jpg',
  '/images/f292fdac-d500-4e74-82ae-8f8229ba9238.jpg',
  '/images/f8b641e7-afaf-40d1-9543-80902e2fd3a8.jpg',
]

export function GalleryForm({ content }: { content: Record<string, any> }) {
  const [images, setImages] = useState<string[]>(content.gallery_images || DEFAULT_IMAGES)

  const addImage = () => setImages([...images, ''])
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))
  const updateImage = (i: number, url: string) => {
    const copy = [...images]; copy[i] = url; setImages(copy)
  }

  return (
    <form action={saveGalleryImagesAction} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold">Galeria de Fotos (Seção Sobre o Professor)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
              {url && <img src={url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex gap-1">
              <input type="text" value={url} onChange={e => updateImage(i, e.target.value)} className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-xs" />
              <UploadButton onUpload={(newUrl) => updateImage(i, newUrl)} />
            </div>
            <button type="button" onClick={() => removeImage(i)} className="text-destructive text-xs hover:underline">Remover</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addImage} className="text-sm text-primary hover:underline">+ Adicionar foto</button>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <div className="flex justify-end pt-2">
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md text-sm font-medium">Salvar Galeria</button>
      </div>
    </form>
  )
}
