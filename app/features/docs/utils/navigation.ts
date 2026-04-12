type DocsRouteHandle = {
  docsNav?: {
    title?: string;
    order?: number;
    hide?: boolean;
  };
};

type DocsRouteModule = {
  handle?: DocsRouteHandle;
};

type DocsRouteEntry = {
  segments: string[];
  title: string;
  order: number;
};

type MutableDocsNavNode = {
  id: string;
  label: string;
  segment: string;
  path?: string;
  order: number;
  hasPage: boolean;
  children: MutableDocsNavNode[];
  childrenBySegment: Map<string, MutableDocsNavNode>;
};

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

const docsRouteModules = {
  ...import.meta.glob("../../../routes/docs*.tsx", { eager: true }),
  ...import.meta.glob("../../../routes/docs/**/*.tsx", { eager: true }),
} satisfies Record<string, DocsRouteModule>;

function toTitleCase(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRouteSegments(routeFile: string) {
  const withoutExtension = routeFile.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension.split("/routes/")[1];

  if (!normalized || normalized === "docs") {
    return null;
  }

  if (normalized.startsWith("docs/")) {
    return normalized.slice("docs/".length).split("/");
  }

  if (normalized.startsWith("docs.")) {
    return normalized.slice("docs.".length).split(".");
  }

  return null;
}

function getDocsEntries() {
  return Object.entries(docsRouteModules)
    .map(([routeFile, routeModule]) => {
      const rawSegments = getRouteSegments(routeFile);

      if (
        !rawSegments ||
        rawSegments.some((segment) => segment.startsWith("_") && segment !== "_index")
      ) {
        return null;
      }

      const segments = rawSegments.filter((segment) => segment !== "_index");

      if (routeModule.handle?.docsNav?.hide) {
        return null;
      }

      const title =
        routeModule.handle?.docsNav?.title ??
        (segments.length > 0 ? toTitleCase(segments[segments.length - 1]) : "Overview");

      return {
        segments,
        title,
        order: routeModule.handle?.docsNav?.order ?? 0,
      } satisfies DocsRouteEntry;
    })
    .filter((entry): entry is DocsRouteEntry => entry !== null);
}

function createNode(segment: string, parentSegments: string[]) {
  const pathSegments = [...parentSegments, segment];

  return {
    id: pathSegments.join("/") || "docs",
    label: toTitleCase(segment),
    segment,
    order: 0,
    hasPage: false,
    children: [],
    childrenBySegment: new Map(),
  } satisfies MutableDocsNavNode;
}

function sortNodes(nodes: MutableDocsNavNode[]) {
  nodes.sort((a, b) => {
    const orderDelta = a.order - b.order;

    if (orderDelta !== 0) {
      return orderDelta;
    }

    return a.label.localeCompare(b.label);
  });

  for (const node of nodes) {
    sortNodes(node.children);
  }
}

function finalizeNodes(nodes: MutableDocsNavNode[]): DocsNavNode[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.label,
    segment: node.segment,
    path: node.children.length === 0 && node.hasPage ? node.path : undefined,
    children: finalizeNodes(node.children),
  }));
}

function buildDocsNavigation() {
  const entries = getDocsEntries();
  let overview: { label: string; path: string } | null = null;
  const roots: MutableDocsNavNode[] = [];
  const rootsBySegment = new Map<string, MutableDocsNavNode>();

  for (const entry of entries) {
    if (entry.segments.length === 0) {
      overview = {
        label: entry.title,
        path: "/docs",
      };
      continue;
    }

    let currentNodes = roots;
    let currentMap = rootsBySegment;
    let parentSegments: string[] = [];

    for (const [index, segment] of entry.segments.entries()) {
      let node = currentMap.get(segment);

      if (!node) {
        node = createNode(segment, parentSegments);
        currentMap.set(segment, node);
        currentNodes.push(node);
      }

      if (index === entry.segments.length - 1) {
        node.hasPage = true;
        node.path = `/docs/${entry.segments.join("/")}`;
        node.label = entry.title;
        node.order = entry.order;
      }

      parentSegments = [...parentSegments, segment];
      currentNodes = node.children;
      currentMap = node.childrenBySegment;
    }
  }

  sortNodes(roots);

  return {
    overview,
    items: finalizeNodes(roots),
  };
}

export const docsNavigation = buildDocsNavigation();

export function getDocsBreadcrumbs(pathname: string) {
  if (!pathname.startsWith("/docs")) {
    return [] satisfies DocsBreadcrumb[];
  }

  const segments = pathname
    .replace(/^\/docs\/?/, "")
    .split("/")
    .filter(Boolean);
  const breadcrumbs: DocsBreadcrumb[] = [
    {
      label: "Docs",
      path: "/docs",
      isCurrent: segments.length === 0,
    },
  ];

  let currentPath = "/docs";

  for (const [index, segment] of segments.entries()) {
    currentPath = `${currentPath}/${segment}`;
    const matchingNode = findNodeByPath(docsNavigation.items, currentPath);

    breadcrumbs.push({
      label: matchingNode?.label ?? toTitleCase(segment),
      path: matchingNode?.path,
      isCurrent: index === segments.length - 1,
    });
  }

  return breadcrumbs;
}

function findNodeByPath(nodes: DocsNavNode[], path: string): DocsNavNode | null {
  for (const node of nodes) {
    if (node.path === path) {
      return node;
    }

    const childMatch = findNodeByPath(node.children, path);

    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}
