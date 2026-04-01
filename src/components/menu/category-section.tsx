'use client'

import { motion } from 'framer-motion'
import { ProductCard, type Product } from '@/components/product/product-card'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  products: Product[]
}

interface CategorySectionProps {
  category: Category
}

export function CategorySection({ category }: CategorySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      id={category.slug}
      className="scroll-mt-32"
    >
      <div className="mb-8 rounded-[1.75rem] border border-gold-500/14 bg-[linear-gradient(135deg,rgba(18,14,20,0.92),rgba(9,8,12,0.82))] px-6 py-6 shadow-[0_18px_48px_rgba(0,0,0,0.24)] md:px-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-12 bg-gold-400/80" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400/90">
            Categoria
          </span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{category.name}</h2>
          <span className="inline-flex w-fit rounded-full border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-sm uppercase tracking-[0.18em] text-gold-300">
            {category.products.length} productos
          </span>
        </div>
        {category.description && (
          <p className="mt-4 max-w-2xl text-lg text-white/60">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-7">
        {category.products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
