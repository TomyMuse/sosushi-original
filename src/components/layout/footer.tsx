'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'
import { getDefaultWhatsAppUrl, siteConfig } from '@/data/storefront'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="mt-auto border-t border-gold-500/10 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <Image
              src="/logo.png"
              alt="SOSUSHI"
              width={160}
              height={44}
              className="h-11 w-auto"
            />
            <p className="mt-6 text-2xl font-semibold text-white">
              Sushi premium para noches que merecen una buena mesa.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/62">
              Explora el menu, elige tus piezas favoritas y termina tu pedido por WhatsApp.
            </p>
            <a
              href={getDefaultWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex"
            >
              <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gold-400 transition-colors hover:text-gold-300">
                Escribir por WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mb-5 text-sm uppercase tracking-[0.28em] text-gold-400/80">Contacto</p>
            <ul className="space-y-4 text-lg text-white/68">
              <li>
                <a
                  href={getDefaultWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone className="h-5 w-5 text-gold-400" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5 text-gold-400" />
                  <span>{siteConfig.instagramHandle}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-gold-400" />
                <span>{siteConfig.city}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400" />
                <span>{siteConfig.schedule}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-5 text-sm uppercase tracking-[0.28em] text-gold-400/80">Para pedir mejor</p>
            <div className="space-y-4 text-lg text-white/62">
              <p>Favoritos destacados al inicio.</p>
              <p>Menu completo por categorias.</p>
              <p>Confirmacion directa por WhatsApp.</p>
              <a
                href={getDefaultWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white transition-colors hover:text-gold-300"
              >
                <MessageCircle className="h-5 w-5 text-gold-400" />
                <span>Empezar pedido</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gold-500/10 pt-6 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} {siteConfig.brandName}. Todos los derechos reservados.</p>
          <p>San Clemente del Tuyu, Buenos Aires.</p>
        </div>
      </div>
    </footer>
  )
}
