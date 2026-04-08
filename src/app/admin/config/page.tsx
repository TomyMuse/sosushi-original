'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Building2, MessageCircle, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface SiteConfig {
  brandName: string
  whatsappNumber: string
  whatsappGreeting: string
  instagramUrl: string
  instagramHandle: string
  phoneDisplay: string
  city: string
  schedule: string
}

export default function AdminConfigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<SiteConfig>({
    brandName: '',
    whatsappNumber: '',
    whatsappGreeting: '',
    instagramUrl: '',
    instagramHandle: '',
    phoneDisplay: '',
    city: '',
    schedule: ''
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Configuración guardada')
      } else {
        toast.error('Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-white/60 mt-1">Ajustes generales del sitio</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl border border-gold-500/10 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gold-500/10">
            <Building2 className="h-5 w-5 text-gold-500" />
            <h2 className="text-lg font-semibold">Información del negocio</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Nombre de la marca</label>
              <Input
                value={formData.brandName}
                onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                placeholder="SOSUSHI"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Ciudad</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="San Clemente del Tuyu, Buenos Aires"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Horario</label>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                placeholder="Mar a Dom de 19:00 a 00:00"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl border border-gold-500/10 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gold-500/10">
            <MessageCircle className="h-5 w-5 text-gold-500" />
            <h2 className="text-lg font-semibold">WhatsApp</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Número (con código de país)</label>
              <Input
                value={formData.whatsappNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="5491150948993"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Número para mostrar</label>
              <Input
                value={formData.phoneDisplay}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneDisplay: e.target.value }))}
                placeholder="+54 9 11 5094-8993"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Mensaje de greeting</label>
              <Textarea
                value={formData.whatsappGreeting}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappGreeting: e.target.value }))}
                placeholder="Hola! Quiero hacer un pedido."
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl border border-gold-500/10 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gold-500/10">
            <Instagram className="h-5 w-5 text-gold-500" />
            <h2 className="text-lg font-semibold">Redes sociales</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">URL de Instagram</label>
              <Input
                value={formData.instagramUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                placeholder="https://instagram.com/sosushiok"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Handle de Instagram</label>
              <Input
                value={formData.instagramHandle}
                onChange={(e) => setFormData(prev => ({ ...prev, instagramHandle: e.target.value }))}
                placeholder="@sosushiok"
              />
            </div>
          </div>
        </motion.div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-gold h-12 text-lg w-full"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Guardar configuración
            </>
          )}
        </Button>
      </div>
    </div>
  )
}