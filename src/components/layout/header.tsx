'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, ShoppingCart, Search, X } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartItemCount, useCartStore } from '@/store/cart-store'
import { type Category } from '@/components/menu/category-section'
import { formatPrice } from '@/lib/storefront'
import { AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface SearchResult {
  productId: string
  productName: string
  categoryName: string
  categorySlug: string
  price: number
  isPopular: boolean
}

interface HeaderProps {
  onCartClick: () => void
  categories?: Category[]
  onProductSelect?: (categorySlug: string, productId: string) => void
}

export function Header({ onCartClick, categories = [], onProductSelect }: HeaderProps) {
  const itemCount = useCartItemCount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results: SearchResult[] = searchQuery.length >= 2 && categories.length > 0
    ? (() => {
        const lowerQuery = searchQuery.toLowerCase()
        const searchResults: SearchResult[] = []
        
        categories.forEach((category) => {
          category.products.forEach((product) => {
            const nameMatch = product.name.toLowerCase().includes(lowerQuery)
            const descMatch = product.description?.toLowerCase().includes(lowerQuery)
            
            if (nameMatch || descMatch) {
              const minPrice = Math.min(...product.sizes.map((s) => s.price))
              searchResults.push({
                productId: product.id,
                productName: product.name,
                categoryName: category.name,
                categorySlug: category.slug,
                price: minPrice,
                isPopular: product.isPopular || false,
              })
            }
          })
        })
        
        return searchResults.slice(0, 8)
      })()
    : []

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('')
    setIsSearchOpen(false)
    if (onProductSelect) {
      onProductSelect(result.categorySlug, result.productId)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSearchSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsSearchOpen(false)
        inputRef.current?.blur()
        break
    }
  }

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

          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Buscar rolls, nigiris..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedIndex(0)
                  }}
                  onKeyDown={handleSearchKeyDown}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  autoFocus
                  className="h-10 w-48 rounded-lg border border-gold-500/30 bg-white/10 pl-9 pr-8 text-sm text-white placeholder:text-white/40 md:w-64"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchOpen(false)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-gold-500/20 bg-[#0d0a0f]/98 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      <div className="max-h-80 overflow-y-auto p-2">
                        {results.map((result, index) => (
                          <button
                            key={result.productId}
                            onClick={() => handleSearchSelect(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                              index === selectedIndex
                                ? 'bg-gold-500/15'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium text-white text-sm">
                                  {result.productName}
                                </span>
                                {result.isPopular && (
                                  <Sparkles className="h-3 w-3 text-gold-400 flex-shrink-0" />
                                )}
                              </div>
                              <span className="text-xs text-white/50">
                                {result.categoryName}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gold-400">
                              {formatPrice(result.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-11 w-11 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar productos</span>
              </Button>
            )}

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
                <ShoppingCart className="h-5 w-5" />
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
