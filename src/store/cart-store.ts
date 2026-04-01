import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
}

export interface CartItem {
  id: string
  itemType?: 'product' | 'combo'
  productId: string
  productName: string
  sizeId: string
  sizeLabel: string
  pieces: number
  unitPrice: number
  quantity: number
  summary?: string
  observations?: string
}

interface CartState {
  items: CartItem[]
  discount: Discount | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateObservations: (id: string, observations: string) => void
  clearCart: () => void
  applyDiscount: (discount: Discount | null) => void
  subtotal: number
  discountAmount: number
  total: number
  itemCount: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: null,

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.sizeId === item.sizeId
        )

        if (existingIndex >= 0) {
          const updatedItems = [...items]
          updatedItems[existingIndex].quantity += item.quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      updateObservations: (id, observations) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, observations } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], discount: null })
      },

      applyDiscount: (discount) => {
        set({ discount })
      },

      get subtotal() {
        const state = get()
        return state.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        )
      },

      get discountAmount() {
        const state = get()
        if (!state.discount) return 0

        const subtotal = state.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        )

        if (state.discount.minOrder && subtotal < state.discount.minOrder) {
          return 0
        }

        if (state.discount.type === 'percentage') {
          return (subtotal * state.discount.value) / 100
        }
        return Math.min(state.discount.value, subtotal)
      },

      get total() {
        const state = get()
        const subtotal = state.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        )
        const discountAmount = state.discount
          ? state.discount.minOrder && subtotal < state.discount.minOrder
            ? 0
            : state.discount.type === 'percentage'
              ? (subtotal * state.discount.value) / 100
              : Math.min(state.discount.value, subtotal)
          : 0
        return Math.max(0, subtotal - discountAmount)
      },

      get itemCount() {
        const state = get()
        return state.items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'sosushi-cart',
    }
  )
)

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartDiscount = () => useCartStore((state) => state.discount)
export const useCartSubtotal = () => {
  const items = useCartStore((state) => state.items)
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}
export const useCartDiscountAmount = () => {
  const items = useCartStore((state) => state.items)
  const discount = useCartStore((state) => state.discount)
  
  if (!discount) return 0
  
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  
  if (discount.minOrder && subtotal < discount.minOrder) {
    return 0
  }
  
  if (discount.type === 'percentage') {
    return (subtotal * discount.value) / 100
  }
  return Math.min(discount.value, subtotal)
}
export const useCartTotal = () => {
  const items = useCartStore((state) => state.items)
  const discount = useCartStore((state) => state.discount)
  
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discountAmount = discount
    ? discount.minOrder && subtotal < discount.minOrder
      ? 0
      : discount.type === 'percentage'
        ? (subtotal * discount.value) / 100
        : Math.min(discount.value, subtotal)
    : 0
  return Math.max(0, subtotal - discountAmount)
}
export const useCartItemCount = () => {
  const items = useCartStore((state) => state.items)
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
