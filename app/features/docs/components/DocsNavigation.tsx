"use client";

import { useNavigate } from "react-router";

import { docsNavigation, type DocsNavNode } from "@/features/docs/utils/navigation";
import { Tree, TreeItem } from "@/shared/components/ui/Tree";
import { cn } from "@/shared/utils/cn";

type DocsNavigationProps = {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
};

const navItemClassName =
  "rounded-md border-t-0 bg-transparent px-2 py-1.5 text-sidebar-foreground shadow-none transition-[background-color,color,border-color] duration-200 ease-out hover:bg-sidebar-accent/35";

const navItemContentClassName =
  "flex min-w-0 flex-1 items-center rounded-md pr-2 text-sm transition-colors duration-200";

function getNavItemStateClassName(isActive: boolean, isBranchActive: boolean) {
  if (isActive) {
    return "bg-sidebar-primary/10 text-sidebar-primary ring-1 ring-inset ring-sidebar-primary/15";
  }

  if (isBranchActive) {
    return "bg-sidebar-accent/20 text-sidebar-foreground";
  }

  return "text-sidebar-foreground";
}

function getNavItemContentStateClassName(
  isActive: boolean,
  isBranchActive: boolean,
  hasChildren: boolean,
) {
  if (isActive) {
    return "text-sidebar-primary";
  }

  if (isBranchActive) {
    return "text-sidebar-foreground";
  }

  if (hasChildren) {
    return "text-sidebar-foreground/90 group-hover:text-sidebar-foreground";
  }

  return "text-sidebar-foreground/70 group-hover:text-sidebar-foreground";
}

function getExpandedKeys(nodes: DocsNavNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0 ? [node.id, ...getExpandedKeys(node.children)] : [],
  );
}

const defaultExpandedKeys = getExpandedKeys(docsNavigation.items);

function isNodeActive(node: DocsNavNode, pathname: string): boolean {
  if (node.path === pathname) {
    return true;
  }

  return node.children.some((child) => isNodeActive(child, pathname));
}

function renderTreeItems(
  nodes: DocsNavNode[],
  pathname: string,
  navigate: ReturnType<typeof useNavigate>,
  onNavigate?: () => void,
) {
  return nodes.map((node) => {
    const isActive = node.path === pathname;
    const isBranchActive = isNodeActive(node, pathname);
    const hasChildren = node.children.length > 0;

    return (
      <TreeItem
        key={node.id}
        title={node.label}
        className={cn(
          navItemClassName,
          node.path ? "cursor-pointer" : "cursor-default",
          getNavItemStateClassName(isActive, !isActive && isBranchActive),
        )}
        onAction={
          node.path
            ? () => {
                void navigate(node.path!);
                onNavigate?.();
              }
            : undefined
        }
        content={
          <div
            className={cn(
              navItemContentClassName,
              hasChildren ? "font-semibold tracking-tight" : "font-medium",
              getNavItemContentStateClassName(isActive, !isActive && isBranchActive, hasChildren),
            )}
          >
            <span className="truncate">{node.label}</span>
          </div>
        }
      >
        {node.children.length > 0
          ? renderTreeItems(node.children, pathname, navigate, onNavigate)
          : null}
      </TreeItem>
    );
  });
}

export function DocsNavigation({ pathname, onNavigate, className }: DocsNavigationProps) {
  const navigate = useNavigate();

  return (
    <nav className={className} aria-label="Documentation">
      <div className="mb-4">
        <p className="text-xs font-semibold tracking-[0.24em] text-sidebar-foreground/45 uppercase">
          Documentation
        </p>
        <p className="mt-2 text-sm text-sidebar-foreground/70">
          Browse every route under <code>/docs</code>.
        </p>
      </div>

      <Tree
        aria-label="Documentation pages"
        selectionMode="none"
        defaultExpandedKeys={defaultExpandedKeys}
        className={cn("w-full border-0 bg-transparent shadow-none", className)}
      >
        {docsNavigation.overview ? (
          <TreeItem
            title={docsNavigation.overview.label}
            className={cn(
              navItemClassName,
              "cursor-pointer",
              getNavItemStateClassName(pathname === docsNavigation.overview.path, false),
            )}
            onAction={() => {
              void navigate(docsNavigation.overview!.path);
              onNavigate?.();
            }}
            content={
              <div
                className={cn(
                  navItemContentClassName,
                  "font-medium",
                  getNavItemContentStateClassName(
                    pathname === docsNavigation.overview.path,
                    false,
                    false,
                  ),
                )}
              >
                <span className="truncate">{docsNavigation.overview.label}</span>
              </div>
            }
          />
        ) : null}

        {renderTreeItems(docsNavigation.items, pathname, navigate, onNavigate)}
      </Tree>
    </nav>
  );
}
