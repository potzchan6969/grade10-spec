"use client";

import * as React from "react";

/* Color-theme dimension (e.g. default / grade10), orthogonal to light/dark.
 * next-themes owns light/dark (the `dark` class); this owns the `${prefix}${name}`
 * class. Both classes coexist on <html>, matching the CSS: `.theme-grade10.dark`.
 * Pair with the pre-paint script in index.html to avoid a flash on reload. */

type ColorThemeContextValue = {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  colorThemes: readonly string[];
};

const ColorThemeContext = React.createContext<ColorThemeContextValue | null>(
  null,
);

type ColorThemeProviderProps = {
  children: React.ReactNode;
  /** Available themes; the first is the default. Pass a stable reference. */
  themes: readonly string[];
  defaultTheme?: string;
  storageKey?: string;
  /** Class applied to <html> is `${classPrefix}${theme}`. */
  classPrefix?: string;
};

export function ColorThemeProvider({
  children,
  themes,
  defaultTheme = themes[0],
  storageKey = "color-theme",
  classPrefix = "theme-",
}: ColorThemeProviderProps) {
  const [colorTheme, setColorTheme] = React.useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = window.localStorage.getItem(storageKey);
    return stored && themes.includes(stored) ? stored : defaultTheme;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    for (const t of themes) {
      root.classList.remove(`${classPrefix}${t}`);
    }
    root.classList.add(`${classPrefix}${colorTheme}`);
    window.localStorage.setItem(storageKey, colorTheme);
  }, [colorTheme, themes, classPrefix, storageKey]);

  const value = React.useMemo(
    () => ({ colorTheme, setColorTheme, colorThemes: themes }),
    [colorTheme, themes],
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = React.useContext(ColorThemeContext);
  if (!ctx) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return ctx;
}
