'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ProductSize {
  id: string
  label: string
  pieces: number
  price: number
  order: number
}

interface Product {
  id: string
  name: string
  description?: string | null
  image?: string | null
  categoryId: string
  isActive: boolean
  isPopular: boolean
  order: number
  sizes: ProductSize[]
  category?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  emoji?: string | null
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    image: '',
    isActive: true,
    isPopular: false,
    sizes: [{ label: '', pieces: 0, price: 0 }]
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filter])

  const fetchProducts = async () => {
    try {
      const url = filter !== 'all' ? `/api/admin/products?categoryId=${filter}` : '/api/admin/products'
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      image: '',
      isActive: true,
      isPopular: false,
      sizes: [{ label: 'x5', pieces: 5, price: 0 }]
    })
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      image: product.image || '',
      isActive: product.isActive,
      isPopular: product.isPopular,
      sizes: product.sizes.map(s => ({
        label: s.label,
        pieces: s.pieces,
        price: s.price
      }))
    })
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }))
        toast.success('Imagen subida correctamente')
      }
    } catch (error) {
      toast.error('Error al subir imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { label: '', pieces: 0, price: 0 }]
    }))
  }

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const handleSizeChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size
      )
    }))
  }

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      toast.error('Nombre y categoría son requeridos')
      return
    }

    if (formData.sizes.length === 0 || !formData.sizes[0].label) {
      toast.error('Agrega al menos un tamaño con precio')
      return
    }

    try {
      const url = selectedProduct
        ? `/api/admin/products/${selectedProduct.id}`
        : '/api/admin/products'
      
      const method = selectedProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(selectedProduct ? 'Producto actualizado' : 'Producto creado')
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar producto')
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isActive: !product.isActive })
      })
      fetchProducts()
    } catch (error) {
      toast.error('Error al actualizar')
    }
  }

  const handleTogglePopular = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isPopular: !product.isPopular })
      })
      fetchProducts()
    } catch (error) {
      toast.error('Error al actualizar')
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      toast.success('Producto eliminado')
      fetchProducts()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Productos</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleOpenCreate} className="btn-gold">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-xl border border-gold-500/10 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video bg-secondary/30 relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {!product.isActive && (
                      <Badge className="bg-red-500/80 text-white">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Oculto
                      </Badge>
                    )}
                    {product.isPopular && (
                      <Badge className="bg-gold-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description || 'Sin descripción'}
                    </p>
                  </div>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <Badge key={size.id} variant="outline" className="text-sm">
                        {size.label}: {formatPrice(size.price)}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePopular(product)}
                    >
                      {product.isPopular ? (
                        <Star className="h-4 w-4 text-gold-500 fill-gold-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass" style={{ background: 'rgba(10, 10, 20, 0.98)' }}>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Descripción</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoría *</label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Imagen</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="URL de imagen o subir archivo"
                    />
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                    <Button variant="outline" asChild>
                      <span>
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-24 w-auto rounded-lg"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span>Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span>Popular</span>
                </label>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Tamaños y Precios</label>
                <Button variant="outline" size="sm" onClick={handleAddSize}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>

              <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-3 items-center flex-wrap">
                    <Input
                      value={size.label}
                      onChange={(e) => handleSizeChange(index, 'label', e.target.value)}
                      placeholder="x5"
                      className="w-24"
                    />
                    <Input
                      type="number"
                      value={size.pieces || ''}
                      onChange={(e) => handleSizeChange(index, 'pieces', parseInt(e.target.value) || 0)}
                      placeholder="5"
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">piezas</span>
                    <Input
                      type="number"
                      value={size.price || ''}
                      onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Precio"
                      className="flex-1 min-w-32"
                    />
                    {formData.sizes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSize(index)}
                        className="text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="btn-gold flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
