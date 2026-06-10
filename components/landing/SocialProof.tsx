'use client'

import { useLanguage } from '@/context/LanguageContext'

interface SocialProofProps {
  paragraph_1: string
  paragraph_2: string
}

export function SocialProof({ paragraph_1, paragraph_2 }: SocialProofProps) {
  const { t } = useLanguage()
  return (
    <section className="py-10 border-y border-border bg-muted/20">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl text-center">
        {paragraph_1 && <p className="text-lg text-muted-foreground leading-relaxed mb-4">{t(paragraph_1)}</p>}
        {paragraph_2 && <p className="text-lg text-muted-foreground leading-relaxed">{t(paragraph_2)}</p>}
      </div>
    </section>
  )
}
