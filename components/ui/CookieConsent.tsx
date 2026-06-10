"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function CookieConsent() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verifica se já aceitou ou recusou no localStorage
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      setIsVisible(true)
    } else {
      // Se já aceitou anteriormente, dispara as permissões de dataLayer
      pushConsentToDataLayer(consent === "accepted")
    }
  }, [])

  const pushConsentToDataLayer = (granted: boolean) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "cookie_consent_update",
        consent_status: granted ? "granted" : "denied",
      })
      
      // Função nativa do Google gtag para Consent Mode v2
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: granted ? "granted" : "denied",
          ad_user_data: granted ? "granted" : "denied",
          ad_personalization: granted ? "granted" : "denied",
          analytics_storage: granted ? "granted" : "denied",
        })
      }
    }
  }

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    pushConsentToDataLayer(true)
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined")
    pushConsentToDataLayer(false)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 md:p-6 md:pb-6 pointer-events-none">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between pointer-events-auto">
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-foreground text-lg">{t('Respeitamos a sua Privacidade')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
              {t('Utilizamos cookies essenciais para o funcionamento seguro da plataforma (como login via Google) e cookies de analytics/marketing para aprimorar sua experiência.')}
              {' '}{t('Ao continuar, você concorda com o uso de cookies em conformidade com o')}{' '}
              <Link href="/cookies" className="text-primary hover:underline font-medium">Google Consent Mode v2</Link>{' '}
              {t('e nossa')}{' '}
              <Link href="/privacidade" className="text-primary hover:underline font-medium">{t('Política de Privacidade')}</Link>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-w-[280px] justify-center md:justify-end mt-4 md:mt-0">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
            >
              {t('Recusar não essenciais')}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
            >
              {t('Aceitar e Continuar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
