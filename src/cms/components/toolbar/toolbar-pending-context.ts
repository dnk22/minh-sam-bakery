"use client";

import { createContext, useContext } from "react";

export const ToolbarPendingContext = createContext({
  pending: false,
  run: (action: () => void) => action(),
});

export function useToolbarPending() {
  return useContext(ToolbarPendingContext);
}
