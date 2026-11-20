"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CmsProfileUser } from "@/cms/features/auth/types";

const CmsSessionUserContext = createContext<CmsProfileUser | null>(null);

export function CmsSessionUserProvider({ children, user }: { children: ReactNode; user: CmsProfileUser }) {
  return <CmsSessionUserContext value={user}>{children}</CmsSessionUserContext>;
}

export function useCmsSessionUser() {
  const user = useContext(CmsSessionUserContext);
  if (!user) throw new Error("CmsSessionUserProvider is missing.");
  return user;
}
