import { LuGithub, LuMoon, LuSun } from "react-icons/lu";
import { Link, useLocation } from "react-router";

import { DocsNavTrigger } from "@/features/docs";
import { HeaderActionLink, HeaderActionToggle } from "@/shared/components/layout/HeaderAction";
import { useTheme } from "@/shared/components/theme/ThemeProvider";

export const Header = () => {
  const location = useLocation();
  const { isDark, theme, toggleTheme } = useTheme();
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
          <HeaderActionLink
            href="https://github.com/phaicom/phaicom-tools"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the project GitHub repository in a new tab"
            className="w-10 px-0"
          >
            <LuGithub aria-hidden="true" />
          </HeaderActionLink>

          <HeaderActionToggle
            isSelected={isDark}
            onChange={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="min-w-24 justify-start sm:min-w-28"
          >
            {isDark ? <LuMoon aria-hidden="true" /> : <LuSun aria-hidden="true" />}
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </HeaderActionToggle>
        </div>
      </div>
    </header>
  );
};
