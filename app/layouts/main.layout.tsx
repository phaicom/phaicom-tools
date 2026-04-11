import { useLocale } from "react-aria-components";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

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
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
