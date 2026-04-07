'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Category } from '@/components/menu/category-section'
import { formatPrice } from '@/lib/storefront'

interface SearchBarProps {
  categories: Category[]
  onProductSelect: (categorySlug: string, productId: string) => void
}

interface SearchResult {
  productId: string
  productName: string
  categoryName: string
  categorySlug: string
  price: number
  isPopular: boolean
}

export function SearchBar({ categories, onProductSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (query.length < 2) return []
    
    const lowerQuery = query.toLowerCase()
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
  }, [query, categories])

  const handleSelect = (result: SearchResult) => {
    onProductSelect(result.categorySlug, result.productId)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <Input
          ref={inputRef}
          placeholder="Buscar rolls, nigiris..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-10 text-white placeholder:text-white/40 focus:border-gold-500/50 focus:ring-gold-500/20"
        />
        {query.length > 0 && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-2 z-50 overflow-hidden rounded-xl border border-gold-500/20 bg-[#0d0a0f]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.map((result, index) => (
                <button
                  key={result.productId}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                    index === selectedIndex
                      ? 'bg-gold-500/15'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-white">
                        {result.productName}
                      </span>
                      {result.isPopular && (
                        <Sparkles className="h-3.5 w-3.5 text-gold-400 flex-shrink-0" />
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
            <div className="border-t border-white/5 px-3 py-2">
              <p className="text-xs text-white/30">
                ↑↓ para navegar • Enter para seleccionar • Esc para cerrar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-2 z-50 overflow-hidden rounded-xl border border-white/10 bg-[#0d0a0f]/95 p-6 text-center shadow-xl"
          >
            <p className="text-white/60">No encontramos "{query}"</p>
            <p className="mt-1 text-sm text-white/40">Probá con otro nombre</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="h-11 w-11 text-white/70 hover:text-white hover:bg-white/10"
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">Buscar productos</span>
    </Button>
  )
}