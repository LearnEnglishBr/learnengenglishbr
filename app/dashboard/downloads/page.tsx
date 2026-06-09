import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Download } from 'lucide-react'

export default async function DownloadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      id,
      created_at,
      purchase_items(
        id,
        product_id,
        product_type,
        digital_product:digital_products(
          id,
          title,
          description,
          file_url,
          file_type,
          file_size_bytes,
          cover_image
        )
      )
    `)
    .eq('user_id', user?.id)
    .eq('status', 'COMPLETED')
    .order('created_at', { ascending: false })

  const digitalPurchases = (purchases || [])
    .flatMap(p =>
      (p.purchase_items || [])
        .filter((item: any) => item.product_type === 'digital_product' && item.digital_product)
        .map((item: any) => ({
          purchaseId: p.id,
          purchasedAt: p.created_at,
          ...item.digital_product,
        }))
    )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Meus Downloads</h1>
      <p className="text-muted-foreground mb-8">Acesse seus eBooks, PDFs e materiais digitais.</p>

      {digitalPurchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-xl border-border">
          <Download className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Você ainda não possui produtos digitais.</p>
          <Link href="/produtos" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {digitalPurchases.map((product: any) => (
            <div key={product.id} className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-[3/4] bg-muted/50 w-full relative">
                {product.cover_image ? (
                  <img src={product.cover_image} alt={product.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                    <Download className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description}
                  </p>
                )}
                <Link
                  href={`/dashboard/downloads/${product.id}`}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
