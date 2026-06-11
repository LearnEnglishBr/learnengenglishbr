'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'

export default function LocaleRefresh() {
  const { locale } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    // Refresh server components when locale changes
    router.refresh()
  }, [locale])

  return null
}
