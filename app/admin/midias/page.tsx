import { createClient } from '@/lib/supabase/server'
import { MediaGrid } from './MediaGrid'
import { UploadButton } from '@/app/admin/configuracoes/UploadButton'

export default async function AdminMediaLibraryPage() {
  const supabase = await createClient()

  const { data: medias } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media Library</h1>
          <p className="text-muted-foreground">Gerencie imagens, vídeos e PDFs para seus cursos e blog.</p>
        </div>
        <div className="flex items-center gap-2">
          <UploadButton accept="image/*,video/mp4,application/pdf" onUpload={() => {}} />
        </div>
      </div>

      <MediaGrid medias={medias || []} />
    </div>
  )
}
