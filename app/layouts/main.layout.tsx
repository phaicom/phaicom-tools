import { useLocale } from "react-aria-components";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { ConsoleEasterEgg } from "@/shared/components/misc/ConsoleEasterEgg";

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale, direction } = useLocale();

  return (
    <html lang={locale} dir={direction}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-svh flex-col">
        <ConsoleEasterEgg />
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
