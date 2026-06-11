'use client'

import { useState } from 'react'
import { saveGalleryImagesAction } from '@/actions/site-content'
import { UploadButton } from './UploadButton'

const DEFAULT_IMAGES = [
  '/images/professor-vitor-brandino-aula-ingles-01.jpg',
  '/images/professor-vitor-brandino-aula-ingles-02.jpg',
  '/images/professor-vitor-brandino-aula-ingles-03.jpg',
  '/images/professor-vitor-brandino-aula-ingles-04.jpg',
  '/images/professor-vitor-brandino-aula-ingles-05.jpg',
  '/images/professor-vitor-brandino-aula-ingles-06.jpg',
  '/images/professor-vitor-brandino-aula-ingles-07.jpg',
  '/images/professor-vitor-brandino-aula-ingles-08.jpg',
  '/images/professor-vitor-brandino-aula-ingles-09.jpg',
  '/images/professor-vitor-brandino-aula-ingles-10.jpg',
  '/images/professor-vitor-brandino-aula-ingles-11.jpg',
  '/images/professor-vitor-brandino-aula-ingles-12.jpg',
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
