import type * as React from "react";
import type { useTheme } from "storybook/theming";

// The panel renders in the Storybook manager, where the design-system theme CSS
// is not loaded, so it borrows the manager theme through scoped variables.
export function themeVariables(theme: ReturnType<typeof useTheme>) {
  const dark = theme.base === "dark";
  return {
    "--vp-fg": theme.color.defaultText,
    "--vp-muted": theme.color.mediumdark,
    "--vp-bg": theme.background.content,
    "--vp-surface": theme.background.app,
    "--vp-border": theme.appBorderColor,
    "--vp-accent": theme.color.secondary,
    "--vp-on-accent": dark ? "#08141e" : "#ffffff",
    "--vp-font": theme.typography.fonts.base,
    "--vp-mono": theme.typography.fonts.mono,
    "--vp-ok-bg": dark ? "#17331f" : "#e5f5ea",
    "--vp-ok-border": dark ? "#2f6b42" : "#a9d8b8",
    "--vp-ok-fg": dark ? "#8fe0a8" : "#14602e",
    "--vp-warn-bg": dark ? "#3a2f10" : "#fff9e8",
    "--vp-warn-border": dark ? "#7a6320" : "#d8c691",
    "--vp-warn-fg": dark ? "#f2dfa2" : "#523f12",
    "--vp-error-bg": dark ? "#3d1717" : "#fff0f0",
    "--vp-error-border": dark ? "#9b3b3b" : "#d65a5a",
    "--vp-error-fg": dark ? "#ffc9c9" : "#7d1818",
    "--vp-diff": dark ? "#ff6b6b" : "#d92d2d",
    "--vp-score-ok": dark ? "#a9ccff" : "#1f5fbf",
    "--vp-score-warn": dark ? "#f6c78e" : "#8a5300",
    "--vp-score-high": dark ? "#ff9b9b" : "#b42318",
  } as React.CSSProperties;
}
