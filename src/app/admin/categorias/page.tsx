'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  GripVertical,
  FolderTree
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  emoji?: string | null
  order: number
  _count?: {
    products: number
  }
}

const EMOJI_OPTIONS = ['🍣', '🥗', '🍤', '🍙', '🥘', '🥤', '🌿', '🍱']

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    emoji: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data.sort((a: Category, b: Category) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      emoji: '🍣'
    })
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      emoji: category.emoji || '🍣'
    })
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: selectedCategory ? prev.slug : generateSlug(name)
    }))
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('El nombre es requerido')
      return
    }

    setIsSaving(true)
    try {
      const url = selectedCategory
        ? `/api/admin/categories/${selectedCategory.id}`
        : '/api/admin/categories'
      
      const method = selectedCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(selectedCategory ? 'Categoría actualizada' : 'Categoría creada')
        setIsDialogOpen(false)
        fetchCategories()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })
      toast.success('Categoría eliminada')
      fetchCategories()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newCategories = [...categories]
    const [moved] = newCategories.splice(fromIndex, 1)
    newCategories.splice(toIndex, 0, moved)
    setCategories(newCategories)

    try {
      await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: newCategories.map(c => c.id)
        })
      })
    } catch (error) {
      toast.error('Error al reordenar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Categorías</h2>
          <Badge variant="outline" className="text-sm">
            {categories.length} categorías
          </Badge>
        </div>
        <Button onClick={handleOpenCreate} className="btn-gold">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-xl border border-gold-500/10 p-4 flex items-center gap-4"
              >
                <div className="flex flex-col gap-1 text-white/30">
                  <button
                    onClick={() => index > 0 && handleReorder(index, index - 1)}
                    disabled={index === 0}
                    className="hover:text-gold-400 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => index < categories.length - 1 && handleReorder(index, index + 1)}
                    disabled={index === categories.length - 1}
                    className="hover:text-gold-400 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>

                <div className="text-2xl">{category.emoji || '📁'}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-white/50">{category.description}</p>
                  )}
                  <p className="text-xs text-white/30 mt-1">/{category.slug}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {categories.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No hay categorías aún</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md glass" style={{ background: 'rgba(10, 10, 20, 0.98)' }}>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Rolls de Salmón"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="rolls-salmon"
                disabled={!!selectedCategory}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción opcional"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    className={`w-10 h-10 rounded-lg text-xl transition-all ${
                      formData.emoji === emoji
                        ? 'bg-gold-500/20 border-2 border-gold-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="btn-gold flex-1">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CategoriesAdminPage() {
  return <CategoriesManager />
}