"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const LandingPortalContext = createContext<HTMLElement | null>(null);

export function LandingPortalProvider({ children }: { children: ReactNode }) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  return (
    <LandingPortalContext value={portalContainer}>
      {children}
      <div data-landing-portal-root="" ref={setPortalContainer} />
    </LandingPortalContext>
  );
}

export function useLandingPortalContainer() {
  return useContext(LandingPortalContext);
}
