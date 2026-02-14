/**
 * Theme System - Production Example
 *
 * Two-layer theme architecture: base palette → semantic tokens
 * Enables runtime theme switching with automatic remapping.
 */

// Step 1: Define color palette shape
export interface ColorPalette {
  bg: string
  surface: string
  border: string
  borderFocus: string
  text: string
  textDim: string
  green: string
  yellow: string
  red: string
  purple: string
  cyan: string
}

// Step 2: Create theme variants
export const darkTheme: ColorPalette = {
  bg: "#0f0f0f",
  surface: "#1a1a2e",
  border: "#2a2a4a",
  borderFocus: "#7c3aed",
  text: "#e2e8f0",
  textDim: "#64748b",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  purple: "#7c3aed",
  cyan: "#06b6d4",
}

export const nordTheme: ColorPalette = {
  bg: "#2e3440",
  surface: "#3b4252",
  border: "#4c566a",
  borderFocus: "#88c0d0",
  text: "#eceff4",
  textDim: "#4c566a",
  green: "#a3be8c",
  yellow: "#ebcb8b",
  red: "#bf616a",
  purple: "#b48ead",
  cyan: "#88c0d0",
}

// Step 3: Theme registry
export const themes = {
  dark: darkTheme,
  nord: nordTheme,
} as const

export type ThemeName = keyof typeof themes

// Step 4: Semantic token layer
export function createTheme(colors: ColorPalette) {
  return {
    colors,

    status: {
      completed: colors.green,
      running: colors.yellow,
      failed: colors.red,
      pending: colors.textDim,
    },

    surface: {
      background: colors.bg,
      elevated: colors.surface,
      border: colors.border,
      borderActive: colors.borderFocus,
    },

    text: {
      primary: colors.text,
      secondary: colors.textDim,
    },

    tool: {
      default: colors.cyan,
      success: colors.green,
      error: colors.red,
      system: colors.yellow,
    },

    interactive: {
      selection: colors.surface,
      highlight: colors.yellow,
      accent: colors.cyan,
      accentAlt: colors.purple,
    },
  }
}

// Step 5: Active theme (mutable for runtime switching)
let activeTheme = createTheme(darkTheme)

export function getTheme() {
  return activeTheme
}

export function switchTheme(name: ThemeName) {
  const palette = themes[name]
  activeTheme = createTheme(palette)
  // Note: Caller must trigger re-render
}

// Usage in components:
// import { getTheme } from "./theme"
// const theme = getTheme()
// backgroundColor: theme.surface.elevated
// fg: theme.text.primary
