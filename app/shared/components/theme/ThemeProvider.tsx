"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

import {
  applyThemeToDocument,
  persistTheme,
  type Theme,
  resolveThemeFromDocument,
} from "@/shared/components/theme/theme";

type ThemeContextValue = {
  isDark: boolean;
  isReady: boolean;
  setTheme: (theme: Theme) => void;
  theme: Theme | null;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  initialTheme?: Theme | null;
};

export function ThemeProvider({ children, initialTheme = null }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | null>(() =>
    typeof document === "undefined"
      ? initialTheme
      : resolveThemeFromDocument(document.documentElement),
  );

  const setTheme = (nextTheme: Theme) => {
    applyThemeToDocument(nextTheme, document.documentElement);
    persistTheme(nextTheme);
    setThemeState(nextTheme);
  };

  useLayoutEffect(() => {
    setThemeState(resolveThemeFromDocument(document.documentElement));
  }, []);

  useLayoutEffect(() => {
    if (!theme) {
      return;
    }

    applyThemeToDocument(theme, document.documentElement);
    persistTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        isDark: theme === "dark",
        isReady: theme !== null,
        setTheme,
        theme,
        toggleTheme: () => {
          const nextTheme =
            (theme ?? resolveThemeFromDocument(document.documentElement)) === "dark"
              ? "light"
              : "dark";

          setTheme(nextTheme);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
