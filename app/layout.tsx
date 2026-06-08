import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CookieConsent } from "@/components/ui/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://learningenglishbr.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | LearningEnglishBR",
    default: "Aprenda Inglês com Metodologia Comprovada | LearningEnglishBR",
  },
  description:
    "Domine o inglês com aulas práticas, suporte personalizado e metodologia comprovada. Cursos completos do básico ao avançado com o professor Vitor Brandino.",
  keywords: [
    "curso de inglês",
    "aprender inglês",
    "aulas de inglês online",
    "fluência em inglês",
    "inglês para brasileiros",
    "professor de inglês",
    "TOEFL",
    "IELTS",
    "LearningEnglishBR",
    "Vitor Brandino",
  ],
  authors: [{ name: "Vitor Brandino", url: BASE_URL }],
  creator: "LearningEnglishBR",
  publisher: "LearningEnglishBR",
  openGraph: {
    title: "LearningEnglishBR — Aprenda Inglês de Verdade",
    description:
      "Domine o inglês com aulas práticas, suporte personalizado e metodologia comprovada pelo professor Vitor Brandino.",
    url: BASE_URL,
    siteName: "LearningEnglishBR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LearningEnglishBR — Plataforma de Ensino de Inglês",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearningEnglishBR — Aprenda Inglês de Verdade",
    description:
      "Domine o inglês com aulas práticas, suporte personalizado e metodologia comprovada.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="A19VMZYsKpEu7Vnvw_K2LE3qjn43DHqRzxPGvRaRkTg" />
        <meta name="msvalidate.01" content="9D3452AA350626EE2953B6A5C98064E7" />
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
