"use client";
import type { BreadcrumbProps, BreadcrumbsProps, LinkProps } from "react-aria-components";

import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
} from "react-aria-components";
import { LuChevronRight } from "react-icons/lu";

import { Link } from "@/components/ui/Link";
import { composeTailwindRenderProps } from "@/lib/react-aria-utils";
import { cn } from "@/lib/utils";

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...props} className={cn("flex gap-1", props.className)} />;
}

export function Breadcrumb(props: BreadcrumbProps & Omit<LinkProps, "className">) {
  return (
    <AriaBreadcrumb
      {...props}
      className={composeTailwindRenderProps(props.className, "flex items-center gap-1")}
    >
      {({ isCurrent }) => (
        <>
          <Link variant="secondary" {...props} />
          {!isCurrent && (
            <LuChevronRight className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
          )}
        </>
      )}
    </AriaBreadcrumb>
  );
}
