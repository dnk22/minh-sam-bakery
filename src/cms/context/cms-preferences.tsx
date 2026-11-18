"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CmsTheme = "light" | "dark" | "system";
export type CmsSidebarVariant = "inset" | "floating" | "sidebar";
export type CmsSidebarLayout = "default" | "icon" | "offcanvas";
export type CmsDirection = "ltr" | "rtl";

const STORAGE_KEYS = {
  theme: "minhsam-cms-theme",
  variant: "minhsam-cms-sidebar-variant",
  layout: "minhsam-cms-sidebar-collapsible",
  direction: "minhsam-cms-direction",
} as const;

const defaults = {
  theme: "system" as CmsTheme,
  variant: "inset" as CmsSidebarVariant,
  layout: "default" as CmsSidebarLayout,
  direction: "ltr" as CmsDirection,
};

type CmsPreferencesContextValue = {
  theme: CmsTheme;
  setTheme: (value: CmsTheme) => void;
  sidebarVariant: CmsSidebarVariant;
  setSidebarVariant: (value: CmsSidebarVariant) => void;
  sidebarLayout: CmsSidebarLayout;
  setSidebarLayout: (value: CmsSidebarLayout) => void;
  direction: CmsDirection;
  setDirection: (value: CmsDirection) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  offcanvasSidebarOpen: boolean;
  setOffcanvasSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  resetTheme: () => void;
  resetSidebarVariant: () => void;
  resetSidebarLayout: () => void;
  resetDirection: () => void;
  resetAll: () => void;
};

const CmsPreferencesContext = createContext<CmsPreferencesContextValue | null>(null);

function isOneOf<T extends string>(value: string | null, allowed: readonly T[]): value is T {
  return value !== null && allowed.includes(value as T);
}

export function CmsPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<CmsTheme>(defaults.theme);
  const [sidebarVariant, setSidebarVariantState] = useState<CmsSidebarVariant>(defaults.variant);
  const [sidebarLayout, setSidebarLayoutState] = useState<CmsSidebarLayout>(defaults.layout);
  const [direction, setDirectionState] = useState<CmsDirection>(defaults.direction);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [offcanvasSidebarOpen, setOffcanvasSidebarOpen] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- Preferences are intentionally hydrated from browser storage after the SSR-safe default render. */
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const storedVariant = localStorage.getItem(STORAGE_KEYS.variant);
    const storedLayout = localStorage.getItem(STORAGE_KEYS.layout);
    const storedDirection = localStorage.getItem(STORAGE_KEYS.direction);

    if (isOneOf(storedTheme, ["light", "dark", "system"])) setThemeState(storedTheme);
    if (isOneOf(storedVariant, ["inset", "floating", "sidebar"])) setSidebarVariantState(storedVariant);
    if (isOneOf(storedLayout, ["default", "icon", "offcanvas"])) setSidebarLayoutState(storedLayout);
    if (isOneOf(storedDirection, ["ltr", "rtl"])) setDirectionState(storedDirection);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setTheme = (value: CmsTheme) => {
    setThemeState(value);
    localStorage.setItem(STORAGE_KEYS.theme, value);
  };
  const setSidebarVariant = (value: CmsSidebarVariant) => {
    setSidebarVariantState(value);
    localStorage.setItem(STORAGE_KEYS.variant, value);
  };
  const setSidebarLayout = (value: CmsSidebarLayout) => {
    setSidebarLayoutState(value);
    setOffcanvasSidebarOpen(false);
    localStorage.setItem(STORAGE_KEYS.layout, value);
  };
  const setDirection = (value: CmsDirection) => {
    setDirectionState(value);
    localStorage.setItem(STORAGE_KEYS.direction, value);
  };
  const resetPreference = <T,>(key: keyof typeof STORAGE_KEYS, value: T, setter: (next: T) => void) => {
    localStorage.removeItem(STORAGE_KEYS[key]);
    setter(value);
  };

  const value: CmsPreferencesContextValue = {
    theme,
    setTheme,
    sidebarVariant,
    setSidebarVariant,
    sidebarLayout,
    setSidebarLayout,
    direction,
    setDirection,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    offcanvasSidebarOpen,
    setOffcanvasSidebarOpen,
    toggleSidebar: () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setMobileSidebarOpen((open) => !open);
      } else if (sidebarLayout === "offcanvas") {
        setOffcanvasSidebarOpen((open) => !open);
      } else {
        setSidebarLayout(sidebarLayout === "default" ? "icon" : "default");
      }
    },
    resetTheme: () => resetPreference("theme", defaults.theme, setThemeState),
    resetSidebarVariant: () => resetPreference("variant", defaults.variant, setSidebarVariantState),
    resetSidebarLayout: () => resetPreference("layout", defaults.layout, setSidebarLayoutState),
    resetDirection: () => resetPreference("direction", defaults.direction, setDirectionState),
    resetAll: () => {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      setThemeState(defaults.theme);
      setSidebarVariantState(defaults.variant);
      setSidebarLayoutState(defaults.layout);
      setDirectionState(defaults.direction);
      setOffcanvasSidebarOpen(false);
    },
  };

  return (
    <CmsPreferencesContext value={value}>
      <div
        className="cms-root"
        data-cms-theme={theme}
        data-sidebar-layout={sidebarLayout}
        data-sidebar-offcanvas-open={offcanvasSidebarOpen || undefined}
        data-sidebar-variant={sidebarVariant}
        dir={direction}
      >
        {children}
      </div>
    </CmsPreferencesContext>
  );
}

export function useCmsPreferences() {
  const context = useContext(CmsPreferencesContext);
  if (!context) throw new Error("useCmsPreferences must be used inside CmsPreferencesProvider");
  return context;
}
