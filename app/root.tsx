import interLatinWoff2 from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2";
import sourceCodeProLatinWoff2 from "@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2";
import { Outlet, type LoaderFunctionArgs } from "react-router";

import { parseThemeCookie } from "@/shared/components/theme/theme";

import "./app.css";

export { Layout } from "@/layouts/main.layout";
export { ErrorBoundary } from "./error";

const GITHUB_API_URL = "https://api.github.com/repos/phaicom/phaicom-tools";

async function getGithubStarCount() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: { stargazers_count?: number } = await response.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    theme: parseThemeCookie(request.headers.get("cookie")),
    githubStarCount: await getGithubStarCount(),
  };
}

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
