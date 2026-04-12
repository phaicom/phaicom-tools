import { useLocale } from "react-aria-components";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { ConsoleEasterEgg } from "@/shared/components/misc/ConsoleEasterEgg";
import { getThemeScript } from "@/shared/components/theme/theme";
import { ThemeProvider } from "@/shared/components/theme/ThemeProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale, direction } = useLocale();

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
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
