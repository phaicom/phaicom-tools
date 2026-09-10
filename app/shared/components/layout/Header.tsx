import { Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import { LuGithub, LuMenu, LuMoon, LuSun, LuX } from "react-icons/lu";
import { Link, useLocation } from "react-router";

import { HeaderActionLink, HeaderActionToggle } from "@/shared/components/layout/HeaderAction";
import { useTheme } from "@/shared/components/theme/ThemeProvider";
import { Button } from "@/shared/components/ui/Button";
import { tools } from "@/shared/data/tools";
import { cn } from "@/shared/utils/cn";

const GITHUB_REPO_URL = "https://github.com/phaicom/phaicom-tools";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Categories", to: "/#categories" },
];

export const Header = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/88">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 md:px-6 xl:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 text-foreground no-underline">
          <img src="/logo.svg" alt="" className="size-8 rounded-md" />
          <span className="truncate text-sm font-semibold sm:text-base">Phaicom Tools</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-7 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.to === "/"
                ? location.pathname === "/"
                : link.to === "/tools"
                  ? location.pathname === "/tools"
                  : false;
            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <HeaderActionLink
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Phaicom Tools on GitHub"
            className="hidden min-w-0 px-2.5 sm:inline-flex"
          >
            <LuGithub aria-hidden="true" />
            <span className="hidden lg:inline">GitHub</span>
          </HeaderActionLink>

          <HeaderActionToggle
            isSelected={isDark}
            onChange={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="min-w-0 px-2.5"
          >
            <span aria-hidden="true" className="dark:hidden">
              <LuSun />
            </span>
            <span aria-hidden="true" className="hidden dark:inline">
              <LuMoon />
            </span>
            <span className="hidden lg:inline">
              <span className="dark:hidden">Light</span>
              <span className="hidden dark:inline">Dark</span>
            </span>
          </HeaderActionToggle>

          <DialogTrigger>
            <Button variant="quiet" className="size-10 px-0 md:hidden" aria-label="Open navigation">
              <LuMenu className="size-5" />
            </Button>
            <ModalOverlay
              isDismissable
              className={({ isEntering, isExiting }) =>
                cn(
                  "fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm md:hidden",
                  isEntering && "animate-in duration-150 fade-in",
                  isExiting && "animate-out duration-100 fade-out",
                )
              }
            >
              <Modal className="fixed inset-y-0 right-0 w-[min(88vw,360px)] bg-background shadow-xl outline-none">
                <Dialog aria-label="Main navigation" className="flex h-full flex-col outline-none">
                  {({ close }) => (
                    <>
                      <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        <span className="font-semibold">Navigate</span>
                        <Button
                          variant="quiet"
                          className="size-10 px-0"
                          onPress={close}
                          aria-label="Close navigation"
                        >
                          <LuX className="size-5" />
                        </Button>
                      </div>
                      <div className="flex-1 overflow-y-auto px-4 py-5">
                        <nav aria-label="Mobile navigation" className="grid gap-1">
                          {navLinks.map((link) => (
                            <Link
                              key={link.label}
                              to={link.to}
                              onClick={close}
                              className="rounded-md px-3 py-3 text-base font-semibold text-foreground no-underline hover:bg-secondary"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </nav>
                        <div className="mt-7 border-t border-border pt-5">
                          <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Open a tool
                          </p>
                          <div className="mt-2 grid">
                            {tools.map((tool) => (
                              <Link
                                key={tool.path}
                                to={tool.path}
                                onClick={close}
                                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground no-underline hover:bg-secondary hover:text-foreground"
                              >
                                {tool.shortName}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-14 items-center gap-2 border-t border-border px-7 text-sm font-semibold text-foreground no-underline"
                      >
                        <LuGithub /> View on GitHub
                      </a>
                    </>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
      </div>
    </header>
  );
};
