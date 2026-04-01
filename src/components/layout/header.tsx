'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartItemCount } from '@/store/cart-store'

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const itemCount = useCartItemCount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-gold-500/10 bg-black/40 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.a
            href="#top"
            className="flex items-center select-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="/logo.png"
              alt="SOSUSHI"
              width={148}
              height={40}
              className="h-10 w-auto md:h-11"
              priority
              draggable={false}
            />
          </motion.a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#menu"
              className="text-sm uppercase tracking-[0.24em] text-white/62 transition-colors hover:text-white"
            >
              Menu
            </a>
            <a
              href="#contact"
              className="text-sm uppercase tracking-[0.24em] text-white/62 transition-colors hover:text-white"
            >
              Contacto
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild className="btn-gold hidden h-11 px-5 text-sm uppercase tracking-[0.2em] md:inline-flex">
              <a href="#menu">
                Pedir ahora
              </a>
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 text-white"
                onClick={onCartClick}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center bg-gold-500 p-0 text-sm text-black hover:bg-gold-400"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
                <span className="sr-only">Ver carrito</span>
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white md:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gold-500/10 py-5 md:hidden"
          >
            <div className="flex flex-col gap-5">
              <a
                href="#menu"
                className="text-sm uppercase tracking-[0.24em] text-white/65 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </a>
              <a
                href="#contact"
                className="text-sm uppercase tracking-[0.24em] text-white/65 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
              <Button asChild className="btn-gold h-12 w-full text-sm uppercase tracking-[0.2em]">
                <a href="#menu" onClick={() => setIsMenuOpen(false)}>
                  Pedir ahora
                </a>
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
