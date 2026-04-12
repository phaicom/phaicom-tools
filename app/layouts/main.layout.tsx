import { useLocale } from "react-aria-components";
import { Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { ConsoleEasterEgg } from "@/shared/components/misc/ConsoleEasterEgg";
import {
  getThemeCriticalStyles,
  getThemeScript,
  resolveThemeFromDocument,
  type Theme,
} from "@/shared/components/theme/theme";
import { ThemeProvider } from "@/shared/components/theme/ThemeProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale, direction } = useLocale();
  const rootData = useRouteLoaderData<{ theme: Theme | null }>("root");
  const initialTheme = rootData?.theme ?? null;
  const documentTheme =
    typeof document === "undefined"
      ? initialTheme
      : resolveThemeFromDocument(document.documentElement);
  const htmlClassName = documentTheme === "dark" ? "dark" : undefined;
  const htmlStyle = documentTheme ? { colorScheme: documentTheme } : undefined;

  return (
    <html
      lang={locale}
      dir={direction}
      className={htmlClassName}
      suppressHydrationWarning
      style={htmlStyle}
    >
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <style dangerouslySetInnerHTML={{ __html: getThemeCriticalStyles() }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-svh flex-col">
        <ThemeProvider initialTheme={initialTheme}>
          <ConsoleEasterEgg />
          <Header />
          {children}
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
