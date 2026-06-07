'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Menu, X } from 'lucide-react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const navLinks = [
    { href: '#inicio', label: 'Início' },
    { href: '#cursos', label: 'Cursos' },
    { href: '#metodologia', label: 'Metodologia' },
    { href: '#resultados', label: 'Resultados' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#blog', label: 'Blog' },
  ]

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? 'py-3 bg-background/70 backdrop-blur-md border-b border-white/10 shadow-sm' 
            : 'py-4 sm:py-6 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image 
              src="/images/logo.png" 
              alt="LearningEnglishBR Logo" 
              width={36} 
              height={36} 
              className="w-9 h-9 object-contain"
              priority
            />
            <span className="font-bold text-lg sm:text-xl tracking-tight">
              <span className="text-red-600">Learneng</span>
              <span className="text-[#0d1e3e]">English</span>
              <span className="text-red-600">BR</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="w-4 h-4" /> PT
            </button>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/register" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
              Criar Conta
            </Link>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-6 px-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-card border border-border px-8 text-base font-semibold text-foreground transition-all hover:bg-accent active:scale-95 w-full"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-xl shadow-primary/25 w-full"
                >
                  Criar Conta
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
