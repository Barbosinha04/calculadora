import { create } from 'zustand'
import type { OrdemServico, ItemOS } from '../types/schema'

interface OSState {
  orders: OrdemServico[]
  currentOrder: OrdemServico | null
  items: ItemOS[]
  isLoading: boolean
  error: string | null
  
  setOrders: (orders: OrdemServico[]) => void
  setCurrentOrder: (order: OrdemServico | null) => void
  setItems: (items: ItemOS[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  addOrder: (order: OrdemServico) => void
  updateOrder: (id: string, updates: Partial<OrdemServico>) => void
  deleteOrder: (id: string) => void
}

export const useOSStore = create<OSState>((set) => ({
  orders: [],
  currentOrder: null,
  items: [],
  isLoading: false,
  error: null,
  
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o))
  })),
  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter((o) => o.id !== id)
  })),
}))
