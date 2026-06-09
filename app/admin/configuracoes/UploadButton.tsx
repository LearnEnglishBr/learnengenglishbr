'use client'

import { useRef, useState } from 'react'
import { uploadFileAction } from '@/actions/upload'
import { UploadCloud, Loader2 } from 'lucide-react'

export function UploadButton({ onUpload, accept = 'image/*' }: { onUpload: (url: string) => void; accept?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.set('file', file)
    formData.set('folder', '/uploads')

    const res = await uploadFileAction(formData)
    setLoading(false)

    if (res?.success && res.url) {
      onUpload(res.url)
    } else {
      alert(res?.error || 'Erro ao fazer upload')
    }

    if (ref.current) ref.current.value = ''
  }

  return (
    <>
      <input ref={ref} type="file" accept={accept} onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
        Upload
      </button>
    </>
  )
}
