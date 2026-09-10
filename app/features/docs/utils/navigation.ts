import { tools } from "@/shared/data/tools";

export type DocsNavNode = {
  id: string;
  label: string;
  segment: string;
  path?: string;
  children: DocsNavNode[];
};

export type DocsBreadcrumb = {
  label: string;
  path?: string;
  isCurrent: boolean;
};

type DocsPage = {
  label: string;
  path: string;
};

const docsPages = tools.map((tool) => ({
  children: [],
  id: tool.path.split("/").at(-1) ?? tool.path,
  label: tool.shortName,
  path: tool.path,
  segment: tool.path.split("/").at(-1) ?? "",
})) satisfies DocsNavNode[];

const docsPagesByPath = new Map<string, DocsPage>(
  docsPages.map(({ label, path }) => [path, { label, path }]),
);

export const docsNavigation = {
  overview: {
    label: "Overview",
    path: "/docs",
  },
  items: docsPages,
};

export function normalizeDocsPath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }

  return pathname;
}

function toTitleCase(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDocsBreadcrumbs(pathname: string) {
  const normalizedPathname = normalizeDocsPath(pathname);

  if (!normalizedPathname.startsWith("/docs")) {
    return [] satisfies DocsBreadcrumb[];
  }

  if (normalizedPathname === "/docs") {
    return [
      {
        label: "Tools overview",
        path: "/tools",
        isCurrent: true,
      },
    ] satisfies DocsBreadcrumb[];
  }

  const currentPage = docsPagesByPath.get(normalizedPathname);

  return [
    {
      label: "All tools",
      path: "/tools",
      isCurrent: false,
    },
    {
      label: currentPage?.label ?? toTitleCase(normalizedPathname.replace(/^\/docs\/?/, "")),
      path: currentPage?.path,
      isCurrent: true,
    },
  ] satisfies DocsBreadcrumb[];
}
