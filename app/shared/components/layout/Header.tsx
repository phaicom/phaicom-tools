import { lazy, Suspense, useEffect, useState } from "react";
import { LuGithub, LuMoon, LuStar, LuSun, LuSunMoon } from "react-icons/lu";
import { Link, useLocation, useRouteLoaderData } from "react-router";

import type { Theme } from "@/shared/components/theme/theme";

import { HeaderActionLink, HeaderActionToggle } from "@/shared/components/layout/HeaderAction";
import { useTheme } from "@/shared/components/theme/ThemeProvider";
import { HoverLabel } from "@/shared/components/ui/HoverLabel";

const GITHUB_REPO_URL = "https://github.com/phaicom/phaicom-tools";
const GITHUB_API_URL = "https://api.github.com/repos/phaicom/phaicom-tools";
const DocsNavTrigger = lazy(async () => {
  const module = await import("@/features/docs/components/DocsNavTrigger");
  return { default: module.DocsNavTrigger };
});

function formatStarCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: count >= 1000 ? 1 : 0,
  }).format(count);
}

export const Header = () => {
  const location = useLocation();
  const { isDark, isReady, theme, toggleTheme } = useTheme();
  useRouteLoaderData<{ theme: Theme | null }>("root");
  const [starCount, setStarCount] = useState<number | null>(null);
  const isExactHome = location.pathname === "/";
  const isDocsRoute = location.pathname.startsWith("/docs");

  useEffect(() => {
    const controller = new AbortController();

    const loadStarCount = async () => {
      try {
        const response = await fetch(GITHUB_API_URL, {
          headers: {
            Accept: "application/vnd.github+json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data: { stargazers_count?: number } = await response.json();

        if (typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      } catch {
        // Ignore non-critical GitHub metadata failures.
      }
    };

    const idleCallback =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(
            () => {
              void loadStarCount();
            },
            { timeout: 1500 },
          )
        : window.setTimeout(() => {
            void loadStarCount();
          }, 600);

    return () => {
      controller.abort();

      if (typeof idleCallback === "number") {
        window.clearTimeout(idleCallback);
      } else if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleCallback);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary-foreground">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-2 px-4 md:px-6 xl:px-8">
        {isDocsRoute ? (
          <Suspense fallback={null}>
            <DocsNavTrigger pathname={location.pathname} />
          </Suspense>
        ) : null}

        <Link
          to="/"
          onClick={isExactHome ? (e) => e.preventDefault() : undefined}
          className="flex min-w-0 items-center gap-2 text-secondary-foreground no-underline"
        >
          <img src="/logo.svg" alt="Phaicom's Tools Logo" className="h-8 w-8 rounded-sm" />
          <h4 className="font-semibold">
            <span className="hidden md:inline">Phaicom's Tools</span>
            <span className="md:hidden">PCTs</span>
          </h4>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <HoverLabel label="View on GitHub" side="bottom">
            <HeaderActionLink
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                starCount === null
                  ? "View the project on GitHub"
                  : `View the project on GitHub. ${starCount} stars`
              }
              className="min-w-0 gap-1.5 px-2.5 sm:px-3"
            >
              <LuGithub aria-hidden="true" />
              <span className="inline-flex items-center gap-1">
                <LuStar aria-hidden="true" className="size-3.5" />
                {starCount === null ? null : <span>{formatStarCount(starCount)}</span>}
              </span>
            </HeaderActionLink>
          </HoverLabel>

          <HeaderActionToggle
            isSelected={isDark}
            onChange={toggleTheme}
            aria-label={isReady ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
            className="min-w-0 gap-1.5 px-2.5 sm:px-3"
          >
            <span aria-hidden="true" className="dark:hidden">
              <LuSun aria-hidden="true" />
            </span>
            <span aria-hidden="true" className="hidden dark:inline">
              <LuMoon aria-hidden="true" />
            </span>
            <span className="inline-block min-w-[3rem]">
              <span className="dark:hidden">Light</span>
              <span className="hidden dark:inline">Dark</span>
            </span>
          </HeaderActionToggle>
        </div>
      </div>
    </header>
  );
};
