'use client'

import { type ReactNode } from 'react'
import { FlyToCartProvider } from '@/components/ui/fly-to-cart'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <FlyToCartProvider>
      {children}
    </FlyToCartProvider>
  )
}