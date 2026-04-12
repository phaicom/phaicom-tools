export const THEME_STORAGE_KEY = "phaicom-tools-theme";
export const THEME_COOKIE_KEY = "phaicom-tools-theme";
export const THEME_LIGHT_BACKGROUND = "oklch(0.985 0.01 300)";
export const THEME_LIGHT_FOREGROUND = "oklch(0.23 0.03 285)";
export const THEME_DARK_BACKGROUND = "oklch(0.14 0.03 285)";
export const THEME_DARK_FOREGROUND = "oklch(0.94 0.02 300)";

export type Theme = "light" | "dark";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function parseThemeCookie(cookieHeader: string | null): Theme | null {
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");

    if (rawKey !== THEME_COOKIE_KEY) {
      continue;
    }

    const value = decodeURIComponent(rawValue.join("="));
    return isTheme(value) ? value : null;
  }

  return null;
}

export function createThemeCookie(theme: Theme) {
  return `${THEME_COOKIE_KEY}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function resolveThemeFromDocument(documentElement: HTMLElement): Theme {
  return documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyThemeToDocument(theme: Theme, documentElement: HTMLElement) {
  const isDark = theme === "dark";

  documentElement.classList.toggle("dark", isDark);
  documentElement.style.colorScheme = theme;
  documentElement.style.backgroundColor = isDark ? THEME_DARK_BACKGROUND : THEME_LIGHT_BACKGROUND;
  documentElement.style.color = isDark ? THEME_DARK_FOREGROUND : THEME_LIGHT_FOREGROUND;
}

export function persistTheme(theme: Theme, documentObject: Document = document) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  documentObject.cookie = createThemeCookie(theme);
}

export function getThemeScript() {
  return `
    (() => {
      const storageKey = "${THEME_STORAGE_KEY}";
      const cookieKey = "${THEME_COOKIE_KEY}";
      const root = document.documentElement;
      const lightBackground = "${THEME_LIGHT_BACKGROUND}";
      const lightForeground = "${THEME_LIGHT_FOREGROUND}";
      const darkBackground = "${THEME_DARK_BACKGROUND}";
      const darkForeground = "${THEME_DARK_FOREGROUND}";

      const applyTheme = (theme) => {
        const isDark = theme === "dark";
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;
        root.style.backgroundColor = isDark ? darkBackground : lightBackground;
        root.style.color = isDark ? darkForeground : lightForeground;
        document.cookie = cookieKey + "=" + encodeURIComponent(theme) + "; Path=/; Max-Age=31536000; SameSite=Lax";
      };

      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = storedTheme === "light" || storedTheme === "dark"
          ? storedTheme
          : prefersDark
            ? "dark"
            : "light";

        applyTheme(theme);
      } catch {
        const fallbackTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

        applyTheme(fallbackTheme);
      }
    })();
  `;
}

export function getThemeCriticalStyles() {
  return `
    html {
      background-color: ${THEME_LIGHT_BACKGROUND};
      color: ${THEME_LIGHT_FOREGROUND};
      color-scheme: light;
    }

    html.dark {
      background-color: ${THEME_DARK_BACKGROUND};
      color: ${THEME_DARK_FOREGROUND};
      color-scheme: dark;
    }

    body {
      background-color: transparent;
      color: inherit;
    }
  `;
}
