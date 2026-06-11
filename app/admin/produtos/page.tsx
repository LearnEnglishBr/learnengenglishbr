import { createClient } from '@/lib/supabase/server'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteDigitalProductAction, updateDigitalProductAction } from '@/actions/digital-products'

export default async function AdminProdutosPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('digital_products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Produtos Digitais</h1>
          <p className="text-muted-foreground">Gerencie os produtos digitais da plataforma.</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Capa</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Título</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Preço</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Home</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground h-24">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                          Sem imagem
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">{product.title}</td>
                    <td className="p-4 align-middle">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </td>
                    <td className="p-4 align-middle">
                      <form action={updateDigitalProductAction as any}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="title" value={product.title} />
                        <input type="hidden" name="description" value={product.description || ''} />
                        <input type="hidden" name="file_url" value={product.file_url || ''} />
                        <input type="hidden" name="cover_image" value={product.cover_image || ''} />
                        <input type="hidden" name="price" value={product.price} />
                        <input type="hidden" name="show_on_homepage" value={product.show_on_homepage ? 'off' : 'on'} />
                        <button
                          type="submit"
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${
                            product.show_on_homepage
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {product.show_on_homepage ? 'Sim' : 'Não'}
                        </button>
                      </form>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produtos/novo?id=${product.id}`}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={deleteDigitalProductAction as any}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
