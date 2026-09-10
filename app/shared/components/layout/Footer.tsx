import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-6 xl:px-8">
        <div>
          <p className="text-sm font-semibold text-foreground">Phaicom Tools</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Focused utilities for everyday web work.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/tools" className="text-muted-foreground no-underline hover:text-foreground">
            All tools
          </Link>
          <Link
            to="/#categories"
            className="text-muted-foreground no-underline hover:text-foreground"
          >
            Categories
          </Link>
          <a
            href="https://github.com/phaicom/phaicom-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground no-underline hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};
