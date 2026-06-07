'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-background/70 backdrop-blur-md border-b border-white/10 shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            L
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">LearningEnglishBR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#inicio" className="hover:text-foreground transition-colors">Início</Link>
          <Link href="#cursos" className="hover:text-foreground transition-colors">Cursos</Link>
          <Link href="#metodologia" className="hover:text-foreground transition-colors">Metodologia</Link>
          <Link href="#resultados" className="hover:text-foreground transition-colors">Resultados</Link>
          <Link href="#depoimentos" className="hover:text-foreground transition-colors">Depoimentos</Link>
          <Link href="#blog" className="hover:text-foreground transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" /> PT
          </button>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
            Criar Conta
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
