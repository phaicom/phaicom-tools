export const THEME_STORAGE_KEY = "phaicom-tools-theme";

export type Theme = "light" | "dark";

export function resolveThemeFromDocument(documentElement: HTMLElement): Theme {
  return documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getThemeScript() {
  return `
    (() => {
      const storageKey = "${THEME_STORAGE_KEY}";
      const root = document.documentElement;

      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = storedTheme === "light" || storedTheme === "dark"
          ? storedTheme
          : prefersDark
            ? "dark"
            : "light";

        root.classList.toggle("dark", theme === "dark");
      } catch {
        root.classList.toggle(
          "dark",
          window.matchMedia("(prefers-color-scheme: dark)").matches,
        );
      }
    })();
  `;
}
