'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Percent,
  DollarSign,
  Copy,
  Check,
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

interface Discount {
  id: string
  code: string
  type: string
  value: number
  minOrder: number | null
  maxUses: number | null
  currentUses: number
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export function DiscountsManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    minOrder: 0,
    maxUses: 0,
    expiresAt: '',
    isActive: true
  })

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/admin/discounts')
      const data = await response.json()
      setDiscounts(data)
    } catch (error) {
      console.error('Error fetching discounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      minOrder: 0,
      maxUses: 0,
      expiresAt: '',
      isActive: true
    })
    setSelectedDiscount(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (discount: Discount) => {
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minOrder: discount.minOrder || 0,
      maxUses: discount.maxUses || 0,
      expiresAt: discount.expiresAt ? discount.expiresAt.split('T')[0] : '',
      isActive: discount.isActive
    })
    setSelectedDiscount(discount)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.code) {
      toast.error('El código es requerido')
      return
    }

    if (formData.value <= 0) {
      toast.error('El valor debe ser mayor a 0')
      return
    }

    try {
      const url = selectedDiscount
        ? `/api/admin/discounts/${selectedDiscount.id}`
        : '/api/admin/discounts'
      
      const method = selectedDiscount ? 'PUT' : 'POST'

      const body = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        minOrder: formData.minOrder || null,
        maxUses: formData.maxUses || null,
        expiresAt: formData.expiresAt || null,
        isActive: formData.isActive
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(selectedDiscount ? 'Descuento actualizado' : 'Descuento creado')
        setIsDialogOpen(false)
        fetchDiscounts()
      } else {
        toast.error(data.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar descuento')
    }
  }

  const handleToggleActive = async (discount: Discount) => {
    try {
      await fetch(`/api/admin/discounts/${discount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !discount.isActive })
      })
      fetchDiscounts()
    } catch (error) {
      toast.error('Error al actualizar')
    }
  }

  const handleDelete = async (discountId: string) => {
    if (!confirm('¿Estás seguro de eliminar este descuento?')) return

    try {
      await fetch(`/api/admin/discounts/${discountId}`, {
        method: 'DELETE'
      })
      toast.success('Descuento eliminado')
      fetchDiscounts()
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Descuentos & Ofertas</h2>
        <Button onClick={handleOpenCreate} className="btn-gold">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Código
        </Button>
      </div>

      {/* Discounts Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="glass rounded-xl border border-gold-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-500/10 bg-black/20">
                  <th className="text-left p-4 font-semibold">Código</th>
                  <th className="text-left p-4 font-semibold">Tipo</th>
                  <th className="text-left p-4 font-semibold">Valor</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Mín. Pedido</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Usos</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Expira</th>
                  <th className="text-left p-4 font-semibold">Estado</th>
                  <th className="text-center p-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {discounts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">
                        No hay códigos de descuento
                      </td>
                    </tr>
                  ) : (
                    discounts.map((discount) => (
                      <motion.tr
                        key={discount.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gold-500/5 hover:bg-gold-500/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gold-500 text-lg">
                              {discount.code}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(discount.code)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedCode === discount.code ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {discount.type === 'percentage' ? (
                              <Percent className="h-4 w-4 text-blue-400" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-green-400" />
                            )}
                            <span className="capitalize">
                              {discount.type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-lg">
                            {discount.type === 'percentage'
                              ? `${discount.value}%`
                              : `$${discount.value.toLocaleString()}`}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {discount.minOrder
                            ? `$${discount.minOrder.toLocaleString()}`
                            : 'Sin mínimo'}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span>
                            {discount.currentUses}
                            {discount.maxUses ? ` / ${discount.maxUses}` : ''}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {discount.expiresAt
                            ? formatDate(discount.expiresAt)
                            : 'Sin expiración'}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              discount.isActive
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                            }
                          >
                            {discount.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(discount)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(discount)}
                            >
                              {discount.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(discount.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discount Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg glass" style={{ background: 'rgba(10, 10, 20, 0.98)' }}>
          <DialogHeader>
            <DialogTitle>
              {selectedDiscount ? 'Editar Descuento' : 'Nuevo Código de Descuento'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Código *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="BIENVENIDO10"
                className="font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Porcentaje
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Monto fijo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Valor {formData.type === 'percentage' ? '(%)' : '($)'}
                </label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  placeholder={formData.type === 'percentage' ? '10' : '1000'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Pedido mínimo ($)</label>
                <Input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))}
                  placeholder="0 = sin mínimo"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Usos máximos</label>
                <Input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 0 }))}
                  placeholder="0 = ilimitado"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fecha de expiración</label>
              <Input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 accent-gold-500"
              />
              <span>Código activo</span>
            </label>

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
