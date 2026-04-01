'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Minus, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  useCartDiscount,
  useCartDiscountAmount,
  useCartItems,
  useCartStore,
  useCartSubtotal,
  useCartTotal,
} from '@/store/cart-store'
import { formatPrice, validateDiscountCode } from '@/lib/storefront'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout: () => void
}

export function CartDrawer({ open, onOpenChange, onCheckout }: CartDrawerProps) {
  const items = useCartItems()
  const discount = useCartDiscount()
  const subtotal = useCartSubtotal()
  const discountAmount = useCartDiscountAmount()
  const total = useCartTotal()
  const { removeItem, updateQuantity, applyDiscount } = useCartStore()

  const getItemSummary = (summary?: string, sizeLabel?: string, pieces?: number) =>
    summary ?? `${sizeLabel} - ${pieces} piezas`

  const [discountCode, setDiscountCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) return
    if (discount) {
      toast.error('Ya tienes un descuento aplicado.')
      return
    }

    setIsValidating(true)
    const result = validateDiscountCode(discountCode, subtotal)

    if (!result.discount) {
      toast.error(result.error ?? 'No se pudo validar el codigo.')
      setIsValidating(false)
      return
    }

    applyDiscount(result.discount)
    setDiscountCode('')
    setIsValidating(false)
    toast.success('Descuento aplicado.')
  }

  const handleRemoveDiscount = () => {
    applyDiscount(null)
    toast.success('Descuento eliminado.')
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('El carrito esta vacio.')
      return
    }

    onCheckout()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex h-full min-h-0 w-full flex-col overflow-hidden p-0 sm:max-w-lg"
        style={{ background: 'rgba(10, 10, 20, 0.95)' }}
      >
        <SheetHeader className="shrink-0 border-b border-gold-500/10 p-5">
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <ShoppingCart className="h-6 w-6 text-gold-500" />
            Tu pedido
          </SheetTitle>
          <SheetDescription className="text-lg">
            {items.length === 0
              ? 'Tu carrito esta vacio.'
              : `${items.length} ${items.length === 1 ? 'producto' : 'productos'}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Carrito vacio</h3>
            <p className="mb-6 text-lg text-muted-foreground">
              Agrega productos del menu para comenzar tu pedido.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-lg"
              onClick={() => onOpenChange(false)}
            >
              Ver menu
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-5 p-5">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="rounded-xl bg-secondary/50 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium">{item.productName}</h4>
                          <p className="text-base text-muted-foreground">
                            {getItemSummary(item.summary, item.sizeLabel, item.pieces)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center text-lg font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-xl font-bold text-gold-500">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="shrink-0 space-y-4 border-t border-gold-500/10 p-5">
              {discount ? (
                <div className="flex items-center justify-between rounded-xl bg-gold-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-gold-500" />
                    <span className="text-lg font-medium">{discount.code}</span>
                    <Badge variant="secondary" className="text-base">
                      {discount.type === 'percentage'
                        ? `-${discount.value}%`
                        : `-${formatPrice(discount.value)}`}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveDiscount}
                    className="text-base text-muted-foreground hover:text-destructive"
                  >
                    Quitar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Input
                    placeholder="Codigo de descuento"
                    value={discountCode}
                    onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                    className="h-12 flex-1 text-lg"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleValidateDiscount()
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleValidateDiscount}
                    disabled={isValidating || !discountCode.trim()}
                    className="text-lg"
                  >
                    {isValidating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Aplicar'}
                  </Button>
                </div>
              )}
            </div>

            <div className="shrink-0 space-y-3 border-t border-gold-500/10 p-5">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="text-gold-500">Descuento</span>
                  <span className="text-gold-500">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <Separator className="my-3" />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-gold-500">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="shrink-0 border-t border-gold-500/10 p-5">
              <Button className="h-14 w-full text-xl btn-gold" onClick={handleCheckout}>
                Continuar
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
