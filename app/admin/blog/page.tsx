"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Plus, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, created_at, published, seo_score, focus_keyword, categories")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error loading posts:", error);
        setPosts([]);
      } else {
        setPosts(data ?? []);
      }
    }
    fetchPosts();
  }, [supabase]);

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel do Blog</h1>
          <p className="text-muted-foreground">Gerencie seus artigos e acompanhe a otimização SEO.</p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Novo Artigo (IA/Manual)
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Artigo</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Palavra-chave Foco</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categorias</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground"><div className="flex items-center justify-center gap-1"><BarChart2 className="w-4 h-4"/> SEO Score</div></th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                      <p>Nenhum artigo encontrado.</p>
                      <Link href="/admin/blog/novo" className="text-primary hover:underline mt-2">Crie seu primeiro artigo</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <p className="font-medium max-w-[250px] truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[250px]">/{post.slug}</p>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {post.focus_keyword ? (
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                          {post.focus_keyword}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">Não definida</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground text-xs">
                      {post.categories && post.categories.length > 0 ? post.categories.join(', ') : '-'}
                    </td>
                    <td className="p-4 align-middle text-center">
                      {post.seo_score != null ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          post.seo_score >= 80 ? 'bg-green-100 text-green-800' :
                          post.seo_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}> {post.seo_score} </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.published ? 'bg-green-100 text-green-800' : 'bg-secondary text-secondary-foreground'}`}> 
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <Link href={`/admin/blog/editar/${post.id}`} className="text-primary hover:underline text-sm font-medium">Editar</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
