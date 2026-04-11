import interLatinWoff2 from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2";
import sourceCodeProLatinWoff2 from "@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2";
import { Outlet } from "react-router";

import "./app.css";

export { Layout } from "@/layouts/main.layout";
export { ErrorBoundary } from "./error";

export function links() {
  return [
    {
      rel: "preload",
      href: interLatinWoff2,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
    {
      rel: "preload",
      href: sourceCodeProLatinWoff2,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
  ];
}

export default function App() {
  return <Outlet />;
}
