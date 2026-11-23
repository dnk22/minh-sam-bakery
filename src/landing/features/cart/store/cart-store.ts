"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "../types";

type CartState = {
  items: CartLine[];
  addItem: (item: CartLine) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  toggleItem: (key: string) => void;
  selectAll: (selected: boolean) => void;
  clearPurchasedItems: (keys: string[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((entry) => entry.key === item.key);
        if (existing) {
          return {
            items: state.items.map((entry) => entry.key === item.key
              ? { ...entry, quantity: Math.min(20, entry.quantity + item.quantity), selected: true }
              : entry),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((entry) => entry.key !== key) })),
      updateQuantity: (key, quantity) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) return;
        set((state) => ({
          items: state.items.map((entry) => entry.key === key ? { ...entry, quantity } : entry),
        }));
      },
      toggleItem: (key) => set((state) => ({
        items: state.items.map((entry) => entry.key === key ? { ...entry, selected: !entry.selected } : entry),
      })),
      selectAll: (selected) => set((state) => ({
        items: state.items.map((entry) => ({ ...entry, selected })),
      })),
      clearPurchasedItems: (keys) => set((state) => {
        const purchased = new Set(keys);
        return { items: state.items.filter((entry) => !purchased.has(entry.key)) };
      }),
    }),
    {
      name: "minh-sam-cart-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items }) => ({ items }),
    },
  ),
);
