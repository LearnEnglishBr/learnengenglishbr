'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Download, History, User, Settings, LogOut, Globe, Menu, X, Loader2 } from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    async function checkProfile() {
      if (pathname === '/onboarding') {
        setCheckingProfile(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()
      if (!profile?.full_name || !profile?.phone) {
        router.replace('/onboarding')
        return
      }
      setCheckingProfile(false)
    }
    checkProfile()
  }, [router, pathname])

  if (checkingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  const { t, locale, setLocale } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="p-6">
        <h2 className="text-xl font-bold">{t('Portal do Aluno')}</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <BookOpen className="w-4 h-4" /> {t('Meus Cursos')}
        </Link>
        <Link href="/dashboard/history" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <History className="w-4 h-4" /> {t('Histórico')}
        </Link>
        <Link href="/dashboard/downloads" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> {t('Meus Downloads')}
        </Link>
        <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
          <User className="w-4 h-4" /> {t('Perfil')}
        </Link>
        <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
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
          <h2 className="text-lg font-bold">{t('Portal do Aluno')}</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> {t('Meus Cursos')}
          </Link>
          <Link href="/dashboard/history" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <History className="w-4 h-4" /> {t('Histórico')}
          </Link>
          <Link href="/dashboard/downloads" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> {t('Meus Downloads')}
          </Link>
          <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <User className="w-4 h-4" /> {t('Perfil')}
          </Link>
          <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
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
          <h2 className="text-lg font-bold">{t('Portal do Aluno')}</h2>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
