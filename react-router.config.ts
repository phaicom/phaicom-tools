import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    const staticPaths = getStaticPaths();
    const docsPaths = staticPaths.filter((path) => path === "/docs" || path.startsWith("/docs/"));

    return ["/", ...docsPaths];
  },
} satisfies Config;
