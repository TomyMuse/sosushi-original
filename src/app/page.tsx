'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { CategorySection, type Category } from '@/components/menu/category-section'
import { ProductCard } from '@/components/product/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CosmicBackground } from '@/components/ui/cosmic-background'
import { storefrontCategories } from '@/data/storefront'
import { useCartItemCount, useCartTotal } from '@/store/cart-store'

type View = 'menu' | 'checkout' | 'success'

export default function Home() {
  const [view, setView] = useState<View>('menu')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false)
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(false)
  const categoryNavRef = useRef<HTMLDivElement>(null)
  const autoScrollFrameRef = useRef<number | null>(null)
  const autoScrollDirectionRef = useRef(1)
  const edgeScrollDirectionRef = useRef(0)
  const isPointerOverNavRef = useRef(false)
  const resumeAutoScrollTimeoutRef = useRef<number | null>(null)

  const itemCount = useCartItemCount()
  const total = useCartTotal()
  const featuredProducts = categories
    .flatMap((category) => category.products)
    .filter((product) => product.isPopular)
    .slice(0, 4)

  useEffect(() => {
    try {
      const data = storefrontCategories as Category[]
      setCategories(data)
      setActiveCategory(data[0]?.slug ?? null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (categories.length === 0) return

    const sections = categories
      .map((category) => document.getElementById(category.slug))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]?.target.id) {
          setActiveCategory(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [categories])

  useEffect(() => {
    const nav = categoryNavRef.current
    if (!nav) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const tick = () => {
      const maxScroll = nav.scrollWidth - nav.clientWidth

      if (maxScroll <= 0) {
        autoScrollFrameRef.current = window.requestAnimationFrame(tick)
        return
      }

      if (edgeScrollDirectionRef.current !== 0) {
        nav.scrollLeft += edgeScrollDirectionRef.current * 8
      } else if (!isPointerOverNavRef.current) {
        nav.scrollLeft += autoScrollDirectionRef.current * 0.6

        if (nav.scrollLeft >= maxScroll - 4) {
          autoScrollDirectionRef.current = -1
        } else if (nav.scrollLeft <= 4) {
          autoScrollDirectionRef.current = 1
        }
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(tick)
    }

    autoScrollFrameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (autoScrollFrameRef.current) {
        window.cancelAnimationFrame(autoScrollFrameRef.current)
      }
      if (resumeAutoScrollTimeoutRef.current) {
        window.clearTimeout(resumeAutoScrollTimeoutRef.current)
      }
    }
  }, [categories.length])

  useEffect(() => {
    const nav = categoryNavRef.current
    if (!nav) return

    const updateScrollState = () => {
      const maxScroll = nav.scrollWidth - nav.clientWidth
      setCanScrollCategoriesLeft(nav.scrollLeft > 8)
      setCanScrollCategoriesRight(nav.scrollLeft < maxScroll - 8)
    }

    const frame = window.requestAnimationFrame(updateScrollState)
    nav.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      window.cancelAnimationFrame(frame)
      nav.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [categories.length])

  const scrollCategoriesBy = (direction: -1 | 1) => {
    const nav = categoryNavRef.current
    if (!nav) return

    const amount = Math.min(420, Math.max(260, nav.clientWidth * 0.72))
    const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth)
    const targetLeft = Math.max(0, Math.min(maxScroll, nav.scrollLeft + amount * direction))

    isPointerOverNavRef.current = true
    edgeScrollDirectionRef.current = 0

    nav.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    })

    if (resumeAutoScrollTimeoutRef.current) {
      window.clearTimeout(resumeAutoScrollTimeoutRef.current)
    }

    resumeAutoScrollTimeoutRef.current = window.setTimeout(() => {
      isPointerOverNavRef.current = false
    }, 900)
  }

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setView('checkout')
  }

  const handleCheckoutSuccess = (id: string) => {
    setOrderId(id)
    setView('success')
  }

  const handleBackToMenu = () => {
    setView('menu')
    setOrderId(null)
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  if (view === 'success') {
    return (
      <div className="relative flex min-h-screen flex-col">
        <CosmicBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header onCartClick={handleCartClick} />
          <main className="flex flex-1 items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass max-w-md rounded-2xl p-10 text-center"
            >
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">Pedido listo para confirmar</h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Abrimos tu pedido en WhatsApp para que puedas terminarlo y coordinar la entrega.
              </p>
              {orderId && (
                <p className="mb-8 text-lg text-muted-foreground">
                  Numero de pedido:{' '}
                  <span className="font-mono font-semibold text-gold-400">{orderId}</span>
                </p>
              )}
              <Button onClick={handleBackToMenu} size="lg" className="btn-gold h-14 px-8 text-xl">
                Volver al menu
              </Button>
            </motion.div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (view === 'checkout') {
    return (
      <div className="relative min-h-screen">
        <CosmicBackground />
        <div className="relative z-10">
          <CheckoutForm onBack={handleBackToMenu} onSuccess={handleCheckoutSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <CosmicBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header onCartClick={handleCartClick} />

        <main className="flex-1">
          <section className="relative overflow-hidden py-20 md:py-28">
            <div className="container relative z-10 mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-8"
                >
                  <Image
                    src="/logo.png"
                    alt="SOSUSHI"
                    width={360}
                    height={98}
                    className="mx-auto h-28 w-auto md:h-36 lg:h-44"
                    style={{ filter: 'drop-shadow(0 0 40px rgba(201, 162, 77, 0.5))' }}
                    priority
                  />
                </motion.div>

                <p className="mx-auto mb-5 max-w-2xl text-2xl text-white md:text-3xl">
                  Sushi premium, directo a tu pedido.
                </p>
                <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-2xl">
                  Elegi los roll y la cantidad que quieras.
                </p>

                <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm uppercase tracking-[0.16em] text-white/70">
                  <span className="rounded-full border border-gold-500/20 bg-black/25 px-4 py-2">
                    Hecho en el momento
                  </span>
                  <span className="rounded-full border border-gold-500/20 bg-black/25 px-4 py-2">
                    Delivery en San Clemente
                  </span>
                  <span className="rounded-full border border-gold-500/20 bg-black/25 px-4 py-2">
                    Confirmacion por WhatsApp
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button
                    size="lg"
                    className="btn-gold h-16 px-12 text-xl"
                    onClick={() => {
                      const menuSection = document.getElementById('menu')
                      menuSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Pedir ahora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 border-gold-500/40 bg-black/20 px-10 text-xl text-white hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      const menuSection = document.getElementById('menu')
                      menuSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Ver menu
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {!isLoading && !error && featuredProducts.length > 0 && (
            <section className="pb-8 md:pb-12">
              <div className="container mx-auto px-4">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-gold-400/80">
                      Favoritos
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                      Los rolls que mas salen
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {!isLoading && !error && categories.length > 0 && (
            <div className="sticky top-20 z-40 border-b border-gold-500/10 bg-[linear-gradient(180deg,rgba(7,5,10,0.92),rgba(10,8,12,0.74))] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="container mx-auto px-4">
                <div className="flex flex-col gap-3 pt-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.34em] text-gold-400/90">
                      Categorias
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                      Elegi rapido por tipo de sushi
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                    Toca una categoria y baja directo a sus rolls, nigiris, hot rolls o entradas.
                  </p>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute bottom-5 left-0 top-0 z-10 w-10 bg-gradient-to-r from-[#09070c] to-transparent md:w-16" />
                  <div className="pointer-events-none absolute bottom-5 right-0 top-0 z-10 w-10 bg-gradient-to-l from-[#09070c] to-transparent md:w-16" />
                  <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2 md:left-3">
                    <button
                      type="button"
                      aria-label="Ver categorias anteriores"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        scrollCategoriesBy(-1)
                      }}
                      className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border bg-[rgba(10,8,12,0.82)] shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all ${
                        canScrollCategoriesLeft
                          ? 'border-gold-500/20 text-white/80 hover:border-gold-400/60 hover:bg-[rgba(26,18,10,0.94)] hover:text-gold-200'
                          : 'border-white/10 text-white/35'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 md:right-3">
                    <button
                      type="button"
                      aria-label="Ver mas categorias"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        scrollCategoriesBy(1)
                      }}
                      className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border bg-[rgba(10,8,12,0.82)] shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all ${
                        canScrollCategoriesRight
                          ? 'border-gold-500/20 text-white/80 hover:border-gold-400/60 hover:bg-[rgba(26,18,10,0.94)] hover:text-gold-200'
                          : 'border-white/10 text-white/35'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <nav
                    ref={categoryNavRef}
                    className="no-scrollbar flex gap-4 overflow-x-auto px-14 py-5 pr-14 touch-pan-x md:px-16"
                    onMouseEnter={() => {
                      isPointerOverNavRef.current = true
                    }}
                    onMouseLeave={() => {
                      isPointerOverNavRef.current = false
                      edgeScrollDirectionRef.current = 0
                    }}
                    onMouseMove={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect()
                      const offsetX = event.clientX - rect.left
                      const edgeThreshold = Math.min(140, rect.width * 0.18)

                      if (offsetX < edgeThreshold) {
                        edgeScrollDirectionRef.current = -1
                        return
                      }

                      if (offsetX > rect.width - edgeThreshold) {
                        edgeScrollDirectionRef.current = 1
                        return
                      }

                      edgeScrollDirectionRef.current = 0
                    }}
                  >
                  {categories.map((category, index) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.slug ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => {
                        setActiveCategory(category.slug)
                        document
                          .getElementById(category.slug)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={
                        activeCategory === category.slug
                          ? 'group relative min-h-[6.5rem] min-w-[16rem] overflow-hidden rounded-2xl border border-gold-200/80 bg-[linear-gradient(135deg,#f0ca72,#c89f43)] px-5 py-4 text-left text-black shadow-[0_14px_34px_rgba(201,162,77,0.35)] hover:bg-[linear-gradient(135deg,#f3d582,#d0a74f)]'
                          : 'group relative min-h-[6.5rem] min-w-[16rem] overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-4 text-left text-white/88 hover:border-gold-500/35 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] hover:text-white'
                      }
                    >
                      <div
                        className={
                          activeCategory === category.slug
                            ? 'absolute inset-x-0 top-0 h-1 bg-black/20'
                            : 'absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent'
                        }
                      />
                      <div className="flex w-full items-start justify-between gap-4">
                        <span
                          className={
                            activeCategory === category.slug
                              ? 'text-xs font-semibold uppercase tracking-[0.28em] text-black/55'
                              : 'text-xs font-semibold uppercase tracking-[0.28em] text-gold-300/70'
                          }
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="mt-4 flex w-full flex-col items-start gap-2 text-left">
                        <span className="text-base font-semibold uppercase tracking-[0.12em]">
                          {category.name}
                        </span>
                        {category.description && (
                          <span
                          className={
                            activeCategory === category.slug
                              ? 'line-clamp-2 text-sm leading-relaxed text-black/72'
                              : 'line-clamp-2 text-sm leading-relaxed text-white/52'
                          }
                        >
                            {category.description}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          <section id="menu" className="py-14 md:py-20">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
                </div>
              ) : error ? (
                <div className="glass rounded-2xl p-10 py-20 text-center">
                  <p className="mb-6 text-xl text-destructive">{error}</p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg"
                    onClick={() => window.location.reload()}
                  >
                    Reintentar
                  </Button>
                </div>
              ) : categories.length === 0 ? (
                <div className="glass rounded-2xl p-10 py-20 text-center">
                  <p className="text-xl text-muted-foreground">No hay productos disponibles</p>
                </div>
              ) : (
                <div className="space-y-20">
                  {categories.map((category) => (
                    <CategorySection key={category.id} category={category} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />

        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-50 lg:hidden"
            >
              <Button onClick={handleCartClick} className="btn-gold h-16 px-8 text-xl shadow-lg">
                <ShoppingCart className="mr-3 h-6 w-6" />
                <span className="font-semibold">{formatPrice(total)}</span>
                <Badge className="ml-3 bg-black/30 px-3 text-lg text-white hover:bg-black/30">
                  {itemCount}
                </Badge>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} onCheckout={handleCheckout} />
      </div>
    </div>
  )
}
