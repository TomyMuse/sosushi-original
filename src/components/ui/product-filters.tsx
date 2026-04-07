'use client'

import { motion } from 'framer-motion'
import { Filter, Sparkles, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type FilterType = 'all' | 'popular' | 'price-low' | 'price-high'

interface ProductFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function ProductFilters({ activeFilter, onFilterChange }: ProductFiltersProps) {
  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: <Tag className="h-4 w-4" /> },
    { id: 'popular', label: 'Populares', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'price-low', label: 'Menor precio', icon: <span className="text-xs font-bold">↓</span> },
    { id: 'price-high', label: 'Mayor precio', icon: <span className="text-xs font-bold">↑</span> },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-1 text-white/50">
        <Filter className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wider">Filtrar:</span>
      </div>
      <div className="flex gap-1.5">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={`h-9 px-3 text-sm transition-all ${
              activeFilter === filter.id
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {filter.icon}
            <span className="ml-1.5">{filter.label}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  )
}