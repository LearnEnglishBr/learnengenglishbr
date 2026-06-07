import { createClient } from '@/lib/supabase/server'
import { generateBlogPostAction } from '@/actions/ai'
import { Sparkles, FileText } from 'lucide-react'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  // Buscar posts gerados
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, created_at, published')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog AI Engine (AEO)</h1>
        <p className="text-muted-foreground">Gere artigos otimizados para SEO usando o GPT-4o em segundos.</p>
      </div>

      {/* Painel Gerador */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-8">
        <form action={generateBlogPostAction} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="keyword" className="block text-sm font-medium mb-2">Tópico ou Palavra-Chave</label>
            <input 
              type="text" 
              name="keyword" 
              id="keyword" 
              placeholder="Ex: Como pensar em inglês sem traduzir..." 
              required
              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-w-[180px]">
            <Sparkles className="w-4 h-4" /> Gerar Artigo
          </button>
        </form>
      </div>

      {/* Lista de Artigos */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5"/> Artigos Publicados</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Título</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug (URL)</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground h-24">Nenhum artigo gerado ainda.</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium max-w-[300px] truncate">{post.title}</td>
                    <td className="p-4 align-middle text-muted-foreground">/blog/{post.slug}</td>
                    <td className="p-4 align-middle">{new Date(post.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
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
