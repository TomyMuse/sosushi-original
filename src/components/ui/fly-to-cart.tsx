'use client'

import { createContext, useCallback, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface FlyToCartItem {
  id: string
  productName: string
  startX: number
  startY: number
}

interface FlyToCartContextType {
  addFlyingItem: (productName: string, startX: number, startY: number) => void
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null)

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FlyToCartItem[]>([])
  const idCounter = useRef(0)

  const addFlyingItem = useCallback((productName: string, startX: number, startY: number) => {
    const id = `fly-${idCounter.current++}`
    setItems((prev) => [...prev, { id, productName, startX, startY }])
    
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 800)
  }, [])

  return (
    <FlyToCartContext.Provider value={{ addFlyingItem }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        items.map((item) => (
          <FlyingItem key={item.id} item={item} />
        )),
        document.body
      )}
    </FlyToCartContext.Provider>
  )
}

function FlyingItem({ item }: { item: FlyToCartItem }) {
  return (
    <div
      className="pointer-events-none fixed z-[9999] flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-black shadow-lg animate-fly"
      style={{
        left: item.startX,
        top: item.startY,
      }}
    >
      <span>{item.productName}</span>
    </div>
  )
}

export { FlyToCartContext }