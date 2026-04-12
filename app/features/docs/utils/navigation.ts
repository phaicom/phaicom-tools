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

const docsPages = [
  {
    children: [],
    id: "gradient-to-tailwind",
    label: "Gradient to Tailwind",
    path: "/docs/gradient-to-tailwind",
    segment: "gradient-to-tailwind",
  },
  {
    children: [],
    id: "image-to-webp",
    label: "Image to WebP",
    path: "/docs/image-to-webp",
    segment: "image-to-webp",
  },
  {
    children: [],
    id: "editor",
    label: "HTML Editor",
    path: "/docs/editor",
    segment: "editor",
  },
] satisfies DocsNavNode[];

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
        label: "Docs",
        path: "/docs",
        isCurrent: true,
      },
    ] satisfies DocsBreadcrumb[];
  }

  const currentPage = docsPagesByPath.get(normalizedPathname);

  return [
    {
      label: "Docs",
      path: "/docs",
      isCurrent: false,
    },
    {
      label: currentPage?.label ?? toTitleCase(normalizedPathname.replace(/^\/docs\/?/, "")),
      path: currentPage?.path,
      isCurrent: true,
    },
  ] satisfies DocsBreadcrumb[];
}
