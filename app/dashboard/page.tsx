'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('purchases')
        .select(`
          id,
          course:courses (
            id,
            title,
            description,
            thumbnail,
            slug
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'COMPLETED')
      setPurchases(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Meus Cursos</h1>
      <p className="text-muted-foreground mb-8">Continue seu aprendizado de onde parou.</p>

      {(!purchases || purchases.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-xl border-border">
          <p className="text-muted-foreground mb-4">Você ainda não possui cursos matriculados.</p>
          <Link href="/cursos" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase: any) => (
            <div key={purchase.id} className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-video bg-muted/50 w-full relative">
                {purchase.course.thumbnail ? (
                   <img src={purchase.course.thumbnail} alt={purchase.course.title} className="object-cover w-full h-full" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">Sem Imagem</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                  {purchase.course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {purchase.course.description}
                </p>
                <Link href={`/dashboard/cursos/${purchase.course.slug}`} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80">
                  Acessar Curso
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
