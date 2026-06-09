import { Suspense } from 'react'

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando...</div>}>{children}</Suspense>
}
