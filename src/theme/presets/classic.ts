import type { ThemeConfigV1 } from "../contracts/theme.types.ts";

const classicTheme = {
  schemaVersion: 1,
  colors: {
    primary: "#2E0208",
    primaryContainer: "#4A151B",
    onPrimary: "#FFFFFF",
    secondary: "#775A19",
    secondaryLight: "#E9C176",
    onSecondary: "#FFFFFF",
    background: "#FFF8F7",
    surface: "#FFF8F7",
    surfaceMuted: "#FFF0EE",
    surfaceElevated: "#FDE2DE",
    textPrimary: "#261816",
    textSecondary: "#534343",
    border: "#D8C1C1",
    accent: "#FFDEA5",
  },
  typography: {
    heading: "noto-serif",
    body: "be-vietnam-pro",
  },
} as const satisfies ThemeConfigV1;

export const CLASSIC_THEME = Object.freeze({
  ...classicTheme,
  colors: Object.freeze({ ...classicTheme.colors }),
  typography: Object.freeze({ ...classicTheme.typography }),
});

/** Returns editable form/runtime state without exposing the frozen preset. */
export function createClassicThemeConfig(): ThemeConfigV1 {
  return {
    schemaVersion: 1,
    colors: { ...CLASSIC_THEME.colors },
    typography: { ...CLASSIC_THEME.typography },
  };
}
