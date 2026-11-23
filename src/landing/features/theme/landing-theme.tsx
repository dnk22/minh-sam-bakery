import type { CSSProperties, ReactNode } from "react";

import type { ThemeResolutionResult } from "@/theme/contracts/theme.types";

import { LandingPortalProvider } from "./landing-portal-provider";

type CssVariableStyle = CSSProperties & Record<`--${string}`, string>;

export function LandingThemeRoot({
  children,
  theme,
}: {
  children: ReactNode;
  theme: ThemeResolutionResult;
}) {
  return (
    <div
      className="min-h-screen bg-surface text-on-surface"
      data-landing-theme-root=""
      style={theme.cssVariables as CssVariableStyle}
    >
      <LandingPortalProvider>{children}</LandingPortalProvider>
    </div>
  );
}
