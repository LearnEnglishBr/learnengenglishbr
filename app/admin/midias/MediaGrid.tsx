'use client'

import { useState, useRef } from 'react'
import { Image, FileText, Video, UploadCloud, Trash2, Loader2 } from 'lucide-react'
import { deleteMediaAction } from '@/actions/media'
import { uploadFileAction } from '@/actions/upload'
import { useRouter } from 'next/navigation'

interface MediaItem {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size_bytes: number
}

export function MediaGrid({ medias: initialMedias }: { medias: MediaItem[] }) {
  const router = useRouter()
  const [medias, setMedias] = useState(initialMedias)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.set('file', file)
    formData.set('folder', '/uploads')

    const res = await uploadFileAction(formData)
    setUploading(false)

    if (res?.success) {
      router.refresh()
    } else {
      alert(res?.error || 'Erro ao fazer upload')
    }

    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*,video/mp4,application/pdf" onChange={handleUpload} className="hidden" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {medias.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground bg-muted/10">
            <UploadCloud className="w-10 h-10 mx-auto mb-4 opacity-50" />
            <p>Nenhuma mídia encontrada.</p>
            <p className="text-sm">Clique em "Upload" para começar.</p>
          </div>
        ) : (
          medias.map((media) => (
            <div key={media.id} className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {media.file_type.includes('image') ? (
                  <img src={media.file_url} alt={media.file_name} className="w-full h-full object-cover" />
                ) : media.file_type.includes('video') ? (
                  <Video className="w-10 h-10 text-muted-foreground" />
                ) : (
                  <FileText className="w-10 h-10 text-muted-foreground" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(media.file_url)
                    }}
                    className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors"
                    title="Copiar URL"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={media.id} />
                    <button type="submit" className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate" title={media.file_name}>{media.file_name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                  {media.file_type.split('/')[1] || media.file_type} • {(media.file_size_bytes / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {uploading && (
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Fazendo upload...</span>
        </div>
      )}
    </>
  )
}
