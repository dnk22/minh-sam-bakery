"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { useCartStore } from "../store/cart-store";

const CartHydratedContext = createContext(false);

export function CartHydration({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.resolve(useCartStore.persist.rehydrate()).finally(() => {
      if (active) setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  return <CartHydratedContext.Provider value={hydrated}>{children}</CartHydratedContext.Provider>;
}

export function useCartHydrated() {
  return useContext(CartHydratedContext);
}
