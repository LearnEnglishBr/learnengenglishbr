import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2.5 mb-6">
              <Image 
                src="/images/logo.png" 
                alt="LearningEnglishBR Logo" 
                width={36} 
                height={36} 
                className="w-9 h-9 object-contain"
              />
              <span className="font-bold text-xl tracking-tight whitespace-nowrap">
                <span className="text-red-600">Learneng</span>{' '}
                <span className="text-[#0d1e3e]">English</span>{' '}
                <span className="text-red-600">BR</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 mx-auto md:mx-0 max-w-sm">
              A plataforma definitiva para você dominar o inglês e transformar sua carreira com certificação internacional.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground">
              <a href="https://www.instagram.com/prof_vitor1?igsh=MTRoMXJtZWI5M3dpeA==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com/@teachervitor-learnenglishbr?si=jX5KVJYrYNeTokyJ" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.tiktok.com/@learnenglishbr?_r=1&_t=ZS-971Wu5qRKWl" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.43 5.92-1.53 1.47-3.66 2.21-5.74 2.15-2.58-.08-5.11-1.39-6.55-3.56-1.29-1.94-1.61-4.49-.91-6.72.63-2.02 2.1-3.72 3.99-4.57 2.14-.96 4.67-.93 6.77.13v4.13c-1.48-.48-3.19-.38-4.54.43-1.32.79-2.09 2.31-1.95 3.86.13 1.44 1.14 2.76 2.49 3.26 1.48.55 3.24.32 4.49-.66 1.14-.9 1.74-2.34 1.75-3.8.02-4.88-.02-9.76.02-14.65z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-foreground">Plataforma</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#cursos" className="hover:text-primary transition-colors">Cursos</Link></li>
              <li><Link href="#metodologia" className="hover:text-primary transition-colors">Metodologia</Link></li>
              <li><Link href="#resultados" className="hover:text-primary transition-colors">Resultados</Link></li>
              <li><Link href="#depoimentos" className="hover:text-primary transition-colors">Depoimentos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Suporte</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/ajuda" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Política de Cookies</Link></li>
              <li><Link href="/lgpd" className="hover:text-primary transition-colors">Conformidade LGPD</Link></li>
              <li><Link href="/reembolso" className="hover:text-primary transition-colors">Reembolso e Cancelamento</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Learneng English BR. Todos os direitos reservados.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span>Desenvolvido com padrão Enterprise</span>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <span>
              Orgulhosamente desenvolvido por{' '}
              <a 
                href="https://www.voltris.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                Voltris
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
