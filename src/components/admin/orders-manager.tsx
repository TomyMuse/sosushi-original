'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Package, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  total: number
  status: string
  createdAt: string
  items: any[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  paid: 'bg-green-500/10 text-green-500',
  preparing: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-purple-500/10 text-purple-500',
  cancelled: 'bg-red-500/10 text-red-500',
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      toast.success('Estado actualizado')
      fetchOrders()
    } catch (error) {
      toast.error('Error al actualizar')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pedidos</h2>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="glass p-4 rounded-xl border border-gold-500/10 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">#{order.orderNumber} - {order.customerName}</p>
                <p className="text-sm text-white/50">{order.customerAddress} • {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gold-400 font-semibold mt-1">${order.total}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className={statusColors[order.status] || 'bg-gray-500'}>
                  {order.status}
                </Badge>
                <Select value={order.status} onValueChange={(s) => updateStatus(order.id, s)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="preparing">Preparando</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}