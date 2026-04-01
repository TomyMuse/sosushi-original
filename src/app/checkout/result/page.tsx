'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, Clock3, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CosmicBackground } from '@/components/ui/cosmic-background'
import { siteConfig } from '@/data/storefront'
import { useCartStore } from '@/store/cart-store'

const statusCopy = {
  success: {
    title: 'Pago aprobado',
    description: 'Tu pago fue aprobado. Si quieres, ahora puedes escribirnos para coordinar entrega.',
    icon: CheckCircle2,
    iconClass: 'text-green-400',
  },
  pending: {
    title: 'Pago pendiente',
    description: 'Mercado Pago todavia esta procesando el pago. Puedes volver mas tarde o escribirnos.',
    icon: Clock3,
    iconClass: 'text-amber-300',
  },
  failure: {
    title: 'Pago no completado',
    description: 'El pago no se pudo completar. Puedes volver a intentarlo o cerrar el pedido por WhatsApp.',
    icon: AlertCircle,
    iconClass: 'text-rose-400',
  },
} as const

export default function CheckoutResultPage() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)

  const status =
    (searchParams.get('status') as keyof typeof statusCopy | null) && statusCopy[searchParams.get('status') as keyof typeof statusCopy]
      ? (searchParams.get('status') as keyof typeof statusCopy)
      : 'pending'

  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    if (status === 'success') {
      clearCart()
    }
  }, [clearCart, status])

  const current = statusCopy[status]
  const Icon = current.icon

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="glass w-full max-w-2xl border-gold-500/15">
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/20 bg-black/20">
                <Icon className={`h-10 w-10 ${current.iconClass}`} />
              </div>
            </div>
            <CardTitle className="text-3xl text-white">{current.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/70">
              {current.description}
            </p>

            <div className="space-y-2 rounded-2xl border border-gold-500/12 bg-black/20 p-5 text-left">
              {externalReference ? (
                <p className="text-sm text-white/65">
                  Pedido: <span className="font-medium text-white">{externalReference}</span>
                </p>
              ) : null}
              {paymentId ? (
                <p className="text-sm text-white/65">
                  Pago: <span className="font-medium text-white">{paymentId}</span>
                </p>
              ) : null}
              <p className="text-sm text-white/65">
                Local: <span className="font-medium text-white">{siteConfig.brandName}</span>
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="btn-gold">
                <Link href="/">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Volver al menu
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gold-500/30 bg-black/20 text-white hover:bg-white/10 hover:text-white">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                    externalReference
                      ? `Hola ${siteConfig.brandName}, quiero consultar por mi pedido ${externalReference}.`
                      : `Hola ${siteConfig.brandName}, quiero consultar por mi pago.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
