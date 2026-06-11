'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export const DesistirButton = () => {
  const router = useRouter()
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={() => router.replace('/')}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" /> {t('Desistir')}
    </button>
  )
}
