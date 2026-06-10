'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, BookOpen, PenTool, Settings, FileText, LogOut, Globe, Menu, X } from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { useLanguage } from '@/context/LanguageContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="p-6">
        <h2 className="text-xl font-black text-primary">Admin Panel</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/admin/cursos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <BookOpen className="w-4 h-4" /> {t('Cursos')}
        </Link>
        <Link href="/admin/usuarios" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <Users className="w-4 h-4" /> {t('Alunos')}
        </Link>
        <Link href="/admin/blog" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <PenTool className="w-4 h-4" /> {t('Blog AI')}
        </Link>
        <Link href="/admin/produtos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <FileText className="w-4 h-4" /> {t('Produtos Digitais')}
        </Link>
        <Link href="/admin/configuracoes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
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
    </>
  )

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-black text-primary">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/cursos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> {t('Cursos')}
          </Link>
          <Link href="/admin/usuarios" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <Users className="w-4 h-4" /> {t('Alunos')}
          </Link>
          <Link href="/admin/blog" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <PenTool className="w-4 h-4" /> {t('Blog AI')}
          </Link>
          <Link href="/admin/produtos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" /> {t('Produtos Digitais')}
          </Link>
          <Link href="/admin/configuracoes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
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

      {/* Desktop sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center gap-3 px-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-accent transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
