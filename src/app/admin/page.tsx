'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Tag, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  totalProducts: number
  activeProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const statCards = [
    {
      title: 'Productos',
      value: stats?.totalProducts ?? 0,
      subtitle: `${stats?.activeProducts ?? 0} activos`,
      icon: ShoppingBag,
      color: 'text-gold-500',
    },
    {
      title: 'Categorías',
      value: stats?.totalCategories ?? 0,
      subtitle: 'en el menú',
      icon: Tag,
      color: 'text-blue-400',
    },
    {
      title: 'Pedidos',
      value: stats?.totalOrders ?? 0,
      subtitle: 'total',
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      title: 'Ingresos',
      value: formatPrice(stats?.totalRevenue ?? 0),
      subtitle: 'total',
      icon: DollarSign,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-1">Resumen de tu negocio</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-gold-500/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-white/40 mt-1">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-gold-500/10">
          <CardHeader>
            <CardTitle className="text-white">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/productos"
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="font-medium text-white">Gestionar Productos</p>
              <p className="text-sm text-white/40">Agregar, editar o eliminar productos</p>
            </a>
            <a
              href="/admin/descuentos"
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="font-medium text-white">Crear Descuento</p>
              <p className="text-sm text-white/40">Generar códigos de descuento</p>
            </a>
            <a
              href="/"
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="font-medium text-white">Ver sitio público</p>
              <p className="text-sm text-white/40">Previsualizar el menu</p>
            </a>
          </CardContent>
        </Card>

        <Card className="glass border-gold-500/10">
          <CardHeader>
            <CardTitle className="text-white">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Estado del sistema</span>
              <span className="text-green-400">✓ Activo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Base de datos</span>
              <span className="text-green-400">✓ Conectada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Última actualización</span>
              <span className="text-white/40">
                {new Date().toLocaleDateString('es-AR')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}