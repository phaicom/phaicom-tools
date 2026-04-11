import { Link, useLocation } from "react-router";

export const Header = () => {
  const location = useLocation();
  const isExactHome = location.pathname === "/";

  return (
    <header className="flex h-14 flex-row items-center gap-2 border-b border-border bg-primary-foreground px-4">
      <Link
        to="/"
        onClick={isExactHome ? (e) => e.preventDefault() : undefined}
        className="flex flex-row items-center text-secondary-foreground no-underline"
      >
        <img src="/logo.svg" alt="Phaicom's Tools Logo" className="h-8 w-8 rounded-sm" />
        <h4 className="font-semibold">
          <span className="hidden md:inline">Phaicom's Tools</span>
          <span className="md:hidden">PCTs</span>
        </h4>
      </Link>
    </header>
  );
};
