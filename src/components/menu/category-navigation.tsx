'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Category } from '@/components/menu/category-section'

interface CategoryNavigationProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryClick: (slug: string) => void
}

export function CategoryNavigation({
  categories,
  activeCategory,
  onCategoryClick,
}: CategoryNavigationProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      {
        threshold: [1],
        rootMargin: '-80px 0px 0px 0px',
      }
    )

    observer.observe(nav)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return
      setIsStuck(navRef.current.getBoundingClientRect().top <= 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={navRef}
      className={`category-nav sticky top-20 z-40 border-y border-gold-500/10 bg-black/60 backdrop-blur-xl transition-all duration-300 ${isStuck ? 'is-stuck' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <nav className="category-nav-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onCategoryClick(category.slug)}
              className={
                activeCategory === category.slug
                  ? 'bg-gold-500 text-sm uppercase tracking-[0.18em] text-black hover:bg-gold-400'
                  : 'text-sm uppercase tracking-[0.18em] text-white/68 hover:bg-white/10 hover:text-white'
              }
            >
              {category.name}
            </Button>
          ))}
        </nav>

        <nav className="category-nav-scroll no-scrollbar flex gap-3 overflow-x-auto py-1 snap-x snap-mandatory">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onCategoryClick(category.slug)}
              className={
                activeCategory === category.slug
                  ? 'flex-shrink-0 snap-start bg-gold-500 text-sm uppercase tracking-[0.18em] text-black hover:bg-gold-400'
                  : 'flex-shrink-0 snap-start text-sm uppercase tracking-[0.18em] text-white/68 hover:bg-white/10 hover:text-white'
              }
            >
              {category.name}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
