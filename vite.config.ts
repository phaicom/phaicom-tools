import localesPlugin from "@react-aria/optimize-locales-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(),
		// Don't include any locale strings in the client JS bundle.
		{ ...localesPlugin.vite({ locales: [] }), enforce: "pre" },
	],
	resolve: {
		tsconfigPaths: true,
	},
});
