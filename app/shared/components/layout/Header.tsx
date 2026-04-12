import { TooltipTrigger } from "react-aria-components";
import { LuGithub, LuMoon, LuStar, LuSun, LuSunMoon } from "react-icons/lu";
import { Link, useLocation, useRouteLoaderData } from "react-router";

import type { Theme } from "@/shared/components/theme/theme";

import { DocsNavTrigger } from "@/features/docs";
import { HeaderActionLink, HeaderActionToggle } from "@/shared/components/layout/HeaderAction";
import { useTheme } from "@/shared/components/theme/ThemeProvider";
import { Tooltip } from "@/shared/components/ui/Tooltip";

const GITHUB_REPO_URL = "https://github.com/phaicom/phaicom-tools";

function formatStarCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: count >= 1000 ? 1 : 0,
  }).format(count);
}

export const Header = () => {
  const location = useLocation();
  const { isDark, isReady, theme, toggleTheme } = useTheme();
  const rootData = useRouteLoaderData<{ theme: Theme | null; githubStarCount: number | null }>(
    "root",
  );
  const starCount = rootData?.githubStarCount ?? null;
  const isExactHome = location.pathname === "/";
  const isDocsRoute = location.pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary-foreground">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-2 px-4 md:px-6 xl:px-8 2xl:px-10">
        {isDocsRoute ? <DocsNavTrigger pathname={location.pathname} /> : null}

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
          <TooltipTrigger delay={150}>
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
            <Tooltip>View on GitHub</Tooltip>
          </TooltipTrigger>

          <HeaderActionToggle
            isSelected={isDark}
            onChange={toggleTheme}
            aria-label={isReady ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
            className="min-w-0 gap-1.5 px-2.5 sm:px-3"
          >
            {!isReady ? (
              <LuSunMoon aria-hidden="true" />
            ) : isDark ? (
              <LuMoon aria-hidden="true" />
            ) : (
              <LuSun aria-hidden="true" />
            )}
            <span>{!isReady ? "Theme" : theme === "dark" ? "Dark" : "Light"}</span>
          </HeaderActionToggle>
        </div>
      </div>
    </header>
  );
};
