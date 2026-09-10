import type { Config } from "@react-router/dev/config";

import { vercelPreset } from "@vercel/react-router/vite";

export default {
  ssr: true,
  presets: [vercelPreset()],
  async prerender({ getStaticPaths }) {
    const staticPaths = getStaticPaths();
    const docsPaths = staticPaths.filter((path) => path === "/docs" || path.startsWith("/docs/"));

    return [
      "/",
      "/tools",
      "/tools/compress-image-to-size",
      "/tools/html-playground",
      "/tools/html-minifier",
      ...docsPaths,
    ];
  },
} satisfies Config;
