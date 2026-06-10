'use client'

import Link from 'next/link'
import { LayoutDashboard, Users, BookOpen, PenTool, Settings, FileText, LogOut, Globe } from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { useLanguage } from '@/context/LanguageContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useLanguage()
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-black text-primary">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/cursos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> {t('Cursos')}
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <Users className="w-4 h-4" /> {t('Alunos')}
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <PenTool className="w-4 h-4" /> {t('Blog AI')}
          </Link>
          <Link href="/admin/produtos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" /> {t('Produtos Digitais')}
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> {t('Configurações')}
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
            <Globe className="w-4 h-4" /> {t('PT')}
          </button>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
              <LogOut className="w-4 h-4" /> {t('Sair')}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-6 md:hidden">
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
