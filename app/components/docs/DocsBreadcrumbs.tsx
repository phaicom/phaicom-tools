import { LuChevronRight } from "react-icons/lu";
import { Link } from "react-router";

import { getDocsBreadcrumbs } from "@/lib/docs-nav";

type DocsBreadcrumbsProps = {
  pathname: string;
};

export function DocsBreadcrumbs({ pathname }: DocsBreadcrumbsProps) {
  const breadcrumbs = getDocsBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? <LuChevronRight className="size-3.5 text-muted-foreground" /> : null}

          {item.path && !item.isCurrent ? (
            <Link to={item.path} className="text-muted-foreground no-underline hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span
              className={item.isCurrent ? "font-medium text-foreground" : "text-muted-foreground"}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
