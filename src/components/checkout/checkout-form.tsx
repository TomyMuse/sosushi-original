'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  Check,
  Copy,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { buildWhatsAppUrl } from '@/data/storefront'
import {
  buildOrderWhatsAppMessage,
  createOrderReference,
  formatPrice,
  type CheckoutCustomerData,
} from '@/lib/storefront'
import {
  useCartDiscount,
  useCartDiscountAmount,
  useCartItems,
  useCartStore,
  useCartSubtotal,
  useCartTotal,
} from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface CheckoutFormProps {
  onBack: () => void
  onSuccess: (orderId: string) => void
}

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const items = useCartItems()
  const discount = useCartDiscount()
  const subtotal = useCartSubtotal()
  const discountAmount = useCartDiscountAmount()
  const total = useCartTotal()
  const clearCart = useCartStore((state) => state.clearCart)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [formData, setFormData] = useState<CheckoutCustomerData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    observations: '',
    paymentMethod: 'mercadopago',
  })

  const bankDetails = {
    cbu: '0123456789012345678901',
    alias: 'SOSUSHI.CBU.ALIAS',
    holder: 'SOSUSHI S.A.',
    cuit: '20-12345678-9',
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success('Copiado al portapapeles.')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getItemSummary = (summary?: string, sizeLabel?: string, pieces?: number) =>
    summary ?? `${sizeLabel} - ${pieces} piezas`

  const validateCustomerData = () => {
    if (!formData.customerName.trim()) {
      toast.error('Ingresa tu nombre.')
      return false
    }
    if (!formData.customerPhone.trim()) {
      toast.error('Ingresa tu telefono.')
      return false
    }
    if (!formData.customerAddress.trim()) {
      toast.error('Ingresa tu direccion.')
      return false
    }

    return true
  }

  const handleTransferSubmit = async () => {
    const orderId = createOrderReference()
    const message = buildOrderWhatsAppMessage(formData, {
      orderId,
      items,
      subtotal,
      discountAmount,
      total,
      discount,
    })
    const url = buildWhatsAppUrl(message)
    const popup = window.open(url, '_blank', 'noopener,noreferrer')

    if (!popup) {
      window.location.href = url
    }

    clearCart()
    onSuccess(orderId)
    toast.success('Tu pedido se abrio en WhatsApp para que puedas confirmarlo.')
  }

  const handleMercadoPagoSubmit = async () => {
    const orderId = createOrderReference()

    const response = await fetch('/api/payments/preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerAddress: formData.customerAddress.trim(),
        observations: formData.observations.trim(),
        items,
        subtotal,
        discountAmount,
        total,
        discount,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.details ?? data.error ?? 'No se pudo iniciar Mercado Pago.')
    }

    if (!data.initPoint) {
      throw new Error('Mercado Pago no devolvio una URL de checkout.')
    }

    window.location.href = data.initPoint
  }

  const handleSubmit = async () => {
    if (!validateCustomerData()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (formData.paymentMethod === 'mercadopago') {
        await handleMercadoPagoSubmit()
      } else {
        await handleTransferSubmit()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo continuar con el pago.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Finalizar pedido</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-gold-500" />
                    Datos de contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      placeholder="Juan Perez"
                      value={formData.customerName}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          customerName: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      value={formData.customerPhone}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          customerPhone: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Direccion de entrega</Label>
                    <div className="relative">
                      <Input
                        id="address"
                        placeholder="Av. Principal 1234"
                        value={formData.customerAddress}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            customerAddress: event.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      placeholder="Timbre, piso, referencias o pedidos especiales."
                      value={formData.observations}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          observations: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4 text-gold-500" />
                    Metodo de pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value: 'mercadopago' | 'transfer') =>
                      setFormData((current) => ({ ...current, paymentMethod: value }))
                    }
                    className="space-y-3"
                  >
                    <Label
                      htmlFor="mercadopago"
                      className="has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/5 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                    >
                      <RadioGroupItem value="mercadopago" id="mercadopago" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <CreditCard className="h-4 w-4" />
                          Mercado Pago
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Seras redirigido al checkout seguro de Mercado Pago.
                        </p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="transfer"
                      className="has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/5 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                    >
                      <RadioGroupItem value="transfer" id="transfer" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <Building2 className="h-4 w-4" />
                          Transferencia bancaria
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Copia los datos y luego envia el comprobante por WhatsApp.
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>

                  <AnimatePresence>
                    {formData.paymentMethod === 'transfer' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 border-t border-border pt-4"
                      >
                        <p className="mb-3 text-sm text-muted-foreground">
                          Transfiere el monto total a la siguiente cuenta:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                            <div>
                              <p className="text-xs text-muted-foreground">CBU</p>
                              <p className="font-mono text-sm">{bankDetails.cbu}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.cbu, 'cbu')}
                            >
                              {copiedField === 'cbu' ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Alias</p>
                              <p className="font-mono text-sm">{bankDetails.alias}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.alias, 'alias')}
                            >
                              {copiedField === 'alias' ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="rounded-lg bg-gold-500/10 p-3">
                            <p className="text-xs text-muted-foreground">Titular</p>
                            <p className="text-sm font-medium">{bankDetails.holder}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              CUIT: {bankDetails.cuit}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="sticky top-24"
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-gold-500" />
                    Resumen del pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="custom-scrollbar max-h-60 space-y-3 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.productName}</span>
                          <span className="text-muted-foreground"> x{item.quantity}</span>
                          <p className="text-xs text-muted-foreground">
                            {getItemSummary(item.summary, item.sizeLabel, item.pieces)}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && discount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gold-500">Descuento {discount.code}</span>
                        <span className="text-gold-500">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-gold-500">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {formData.paymentMethod === 'mercadopago'
                      ? 'Al continuar se abrira Mercado Pago para completar el pago.'
                      : 'Al continuar se abrira WhatsApp con tu pedido completo listo para confirmar.'}
                  </p>

                  <Button
                    className="btn-gold h-12 w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {formData.paymentMethod === 'mercadopago'
                      ? 'Pagar con Mercado Pago'
                      : 'Enviar pedido por WhatsApp'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
