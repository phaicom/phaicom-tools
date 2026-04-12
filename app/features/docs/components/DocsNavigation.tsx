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
  "rounded-sm border-t-0 bg-transparent px-2 py-1.5 text-sidebar-foreground shadow-none transition-[background-color,color,transform] duration-300 ease-out hover:-translate-y-[1px] hover:bg-sidebar-accent/65 hover:text-sidebar-accent-foreground";

const navItemContentClassName =
  "flex min-w-0 flex-1 items-center rounded-sm pr-2 text-sm transition-colors duration-300";

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
          isActive && "bg-sidebar-primary/12 text-sidebar-primary",
          !isActive && isBranchActive && "bg-sidebar-accent/55",
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
              isActive
                ? "text-sidebar-primary"
                : hasChildren
                  ? "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 group-hover:text-sidebar-accent-foreground",
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
              pathname === docsNavigation.overview.path &&
                "bg-sidebar-primary/12 text-sidebar-primary",
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
                  pathname === docsNavigation.overview.path
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground/80 group-hover:text-sidebar-accent-foreground",
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
