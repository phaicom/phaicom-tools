import { Link, useLocation } from "react-router";

import { DocsNavTrigger } from "@/components/docs/DocsNavTrigger";

export const Header = () => {
  const location = useLocation();
  const isExactHome = location.pathname === "/";
  const isDocsRoute = location.pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary-foreground">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl flex-row items-center gap-2 px-4 md:px-6 xl:px-8 2xl:px-10">
        {isDocsRoute ? <DocsNavTrigger pathname={location.pathname} /> : null}

        <Link
          to="/"
          onClick={isExactHome ? (e) => e.preventDefault() : undefined}
          className="flex flex-row items-center gap-2 text-secondary-foreground no-underline"
        >
          <img src="/logo.svg" alt="Phaicom's Tools Logo" className="h-8 w-8 rounded-sm" />
          <h4 className="font-semibold">
            <span className="hidden md:inline">Phaicom's Tools</span>
            <span className="md:hidden">PCTs</span>
          </h4>
        </Link>
      </div>
    </header>
  );
};
