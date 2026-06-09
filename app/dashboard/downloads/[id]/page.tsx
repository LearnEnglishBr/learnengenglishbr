import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Download, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function DownloadProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: product } = await supabase
    .from('digital_products')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('is_active', true)
    .single()

  if (!product) return notFound()

  const { data: purchaseItem } = await supabase
    .from('purchase_items')
    .select('id, purchase_id, created_at, purchase:purchases!inner(user_id, status)')
    .eq('product_id', resolvedParams.id)
    .eq('product_type', 'digital_product')
    .eq('purchase.user_id', user.id)
    .eq('purchase.status', 'COMPLETED')
    .single()

  if (!purchaseItem) return notFound()

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/downloads" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
        &larr; Voltar para Downloads
      </Link>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="aspect-[3/1] bg-muted/50 w-full relative">
          {product.cover_image ? (
            <img src={product.cover_image} alt={product.title} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
              <FileText className="w-12 h-12" />
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          {product.description && (
            <p className="text-muted-foreground mb-6">{product.description}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
            {product.file_type && (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {product.file_type.toUpperCase()}
              </span>
            )}
            {product.file_size_bytes && (
              <span>{formatFileSize(product.file_size_bytes)}</span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Adquirido em {new Date(purchaseItem.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <a
            href={product.file_url}
            download
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Download className="w-5 h-5" />
            Baixar {product.title}
          </a>
        </div>
      </div>
    </div>
  )
}
