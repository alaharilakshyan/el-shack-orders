import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAddedAt: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedAt: 0,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          const items = existing
            ? s.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
            : [...s.items, { ...item, quantity: 1 }];
          return { items, lastAddedAt: Date.now() };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.quantity * i.price, 0),
    }),
    { name: "escobars-cart" }
  )
);
