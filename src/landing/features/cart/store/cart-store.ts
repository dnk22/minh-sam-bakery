"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "../types";
import { switchCartVariant } from "../logic";

type CartState = {
  items: CartLine[];
  addItem: (item: CartLine) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  toggleItem: (key: string) => void;
  switchVariant: (key: string, variantId: string | null) => void;
  selectAll: (selected: boolean) => void;
  clearPurchasedItems: (keys: string[]) => void;
  consumePurchasedItems: (lines: Pick<CartLine, "key" | "quantity">[]) => void;
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
              ? { ...item, quantity: Math.min(20, entry.quantity + item.quantity), selected: true }
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
      switchVariant: (key, variantId) => set((state) => ({ items: switchCartVariant(state.items, key, variantId) })),
      toggleItem: (key) => set((state) => ({
        items: state.items.map((entry) => entry.key === key ? { ...entry, selected: !entry.selected } : entry),
      })),
      selectAll: (selected) => set((state) => ({
        items: state.items.map((entry) => ({ ...entry, selected })),
      })),
      consumePurchasedItems: (lines) => set((state) => {
        const purchased = new Map(lines.map(line => [line.key, line.quantity]));
        return { items: state.items.flatMap(entry => {
          const quantity = entry.quantity - (purchased.get(entry.key) ?? 0);
          return quantity > 0 ? [{ ...entry, quantity }] : [];
        }) };
      }),
      clearPurchasedItems: (keys) => set((state) => {
        const purchased = new Set(keys);
        return { items: state.items.filter((entry) => !purchased.has(entry.key)) };
      }),
    }),
    {
      name: "minh-sam-cart-v1",
      version: 2,
      skipHydration: true,
      migrate: (persisted: unknown) => {
        if (!persisted || typeof persisted !== "object" || !("items" in persisted) || !Array.isArray(persisted.items)) {
          return { items: [] };
        }
        return {
          items: persisted.items.flatMap((line: unknown) => {
            if (!line || typeof line !== "object") return [];
            const entry = line as Partial<CartLine>;
            if (
              typeof entry.productId !== "string" ||
              typeof entry.productName !== "string" ||
              typeof entry.variantLabel !== "string" ||
              !(entry.variantId === null || typeof entry.variantId === "string") ||
              typeof entry.originalPrice !== "number" || !Number.isFinite(entry.originalPrice) ||
              typeof entry.effectivePrice !== "number" || !Number.isFinite(entry.effectivePrice) ||
              typeof entry.quantity !== "number" || !Number.isSafeInteger(entry.quantity) ||
              entry.quantity < 1 || entry.quantity > 20
            ) return [];
            const fallback = [{
              id: entry.variantId, label: entry.variantLabel,
              originalPrice: entry.originalPrice, effectivePrice: entry.effectivePrice,
            }];
            const variants = Array.isArray(entry.availableVariants)
              ? entry.availableVariants.filter((option) =>
                  option && typeof option.label === "string" &&
                  (option.id === null || typeof option.id === "string") &&
                  typeof option.originalPrice === "number" && Number.isFinite(option.originalPrice) &&
                  typeof option.effectivePrice === "number" && Number.isFinite(option.effectivePrice))
              : fallback;
            return [{
              ...entry,
              key: JSON.stringify([entry.productId, entry.variantId]),
              availableVariants: variants,
              selected: entry.selected !== false,
            }];
          }),
        };
      },
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items }) => ({ items }),
    },
  ),
);
