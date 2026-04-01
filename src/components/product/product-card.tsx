'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, Sparkles } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/storefront'
import { useCartStore, type CartItem } from '@/store/cart-store'

export interface ProductSize {
  id: string
  label: string
  pieces: number
  price: number
}

export interface Product {
  id: string
  name: string
  description?: string | null
  image?: string | null
  sizes: ProductSize[]
  isPopular?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>(product.sizes[0]?.id || '')
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const selectedSize = product.sizes.find((size) => size.id === selectedSizeId)

  const handleAddToCart = () => {
    if (!selectedSize) return

    setIsAdding(true)

    const cartItem: CartItem = {
      id: uuidv4(),
      itemType: 'product',
      productId: product.id,
      productName: product.name,
      sizeId: selectedSize.id,
      sizeLabel: selectedSize.label,
      pieces: selectedSize.pieces,
      unitPrice: selectedSize.price,
      quantity: 1,
      summary: `${selectedSize.label} - ${selectedSize.pieces} piezas`,
    }

    addItem(cartItem)

    window.setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)
      window.setTimeout(() => setShowSuccess(false), 1500)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="product-card group relative flex h-full flex-col"
    >
      {product.isPopular && (
        <div className="absolute -right-2 -top-2 z-10">
          <Badge className="gap-1 bg-gold-500 px-3 py-1 text-sm text-black hover:bg-gold-400">
            <Sparkles className="h-4 w-4" />
            Popular
          </Badge>
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1a1612] to-[#0b0907]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-50">&#127843;</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-transparent opacity-70" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="line-clamp-1 text-2xl font-semibold text-foreground">{product.name}</h3>

        {product.description && (
          <p className="line-clamp-2 flex-1 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="space-y-4 pt-2">
          {product.sizes.length > 1 && (
            <Select value={selectedSizeId} onValueChange={setSelectedSizeId}>
              <SelectTrigger className="h-12 w-full text-lg">
                <SelectValue placeholder="Seleccionar tamano" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size.id} value={size.id} className="text-lg">
                    <div className="flex w-full items-center justify-between gap-4">
                      <span>{size.label}</span>
                      <span className="text-muted-foreground">{size.pieces} piezas</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedSize && (
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gold-500">
                  {formatPrice(selectedSize.price)}
                </span>
                <span className="text-base text-muted-foreground">
                  ({selectedSize.pieces} pcs)
                </span>
              </div>
            </div>
          )}

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || !selectedSize}
              className="btn-gold relative h-14 w-full overflow-hidden text-xl"
            >
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    Agregado
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Agregar
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
