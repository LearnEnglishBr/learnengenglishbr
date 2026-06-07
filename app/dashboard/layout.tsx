import Link from 'next/link'
import { BookOpen, History, User, Settings, LogOut } from 'lucide-react'
import { logoutAction } from '@/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold">Portal do Aluno</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <BookOpen className="w-4 h-4" /> Meus Cursos
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <History className="w-4 h-4" /> Histórico
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <User className="w-4 h-4" /> Perfil
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> Configurações
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center px-6 md:hidden">
          <h2 className="text-lg font-bold">Portal do Aluno</h2>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
