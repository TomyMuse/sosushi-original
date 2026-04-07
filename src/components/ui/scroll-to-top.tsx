'use client'

import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-8 left-8 z-40 md:hidden"
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-14 w-14 rounded-full border border-gold-500/30 bg-[rgba(10,8,12,0.9)] text-gold-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:bg-gold-500/10 hover:text-gold-300"
      >
        <ChevronUp className="h-6 w-6" />
        <span className="sr-only">Volver arriba</span>
      </Button>
    </motion.div>
  )
}

export function ScrollToTopDesktop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 800)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-6 left-6 z-40 hidden md:block lg:bottom-8"
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-12 w-12 rounded-full border border-gold-500/30 bg-[rgba(10,8,12,0.9)] text-gold-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:bg-gold-500/10 hover:text-gold-300"
      >
        <ChevronUp className="h-5 w-5" />
        <span className="sr-only">Volver arriba</span>
      </Button>
    </motion.div>
  )
}