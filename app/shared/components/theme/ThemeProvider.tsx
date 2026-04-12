"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

import {
  createThemeCookie,
  THEME_STORAGE_KEY,
  type Theme,
  resolveThemeFromDocument,
  THEME_DARK_BACKGROUND,
  THEME_DARK_FOREGROUND,
  THEME_LIGHT_BACKGROUND,
  THEME_LIGHT_FOREGROUND,
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
  const [theme, setTheme] = useState<Theme | null>(initialTheme);

  useLayoutEffect(() => {
    setTheme(resolveThemeFromDocument(document.documentElement));
  }, []);

  useLayoutEffect(() => {
    if (!theme) {
      return;
    }

    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = theme;
    root.style.backgroundColor = isDark ? THEME_DARK_BACKGROUND : THEME_LIGHT_BACKGROUND;
    root.style.color = isDark ? THEME_DARK_FOREGROUND : THEME_LIGHT_FOREGROUND;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.cookie = createThemeCookie(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        isDark: theme === "dark",
        isReady: theme !== null,
        setTheme,
        theme,
        toggleTheme: () =>
          setTheme((currentTheme) =>
            (currentTheme ?? resolveThemeFromDocument(document.documentElement)) === "dark"
              ? "light"
              : "dark",
          ),
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
