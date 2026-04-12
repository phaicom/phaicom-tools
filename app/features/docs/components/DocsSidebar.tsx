import { DocsNavigation } from "./DocsNavigation";

type DocsSidebarProps = {
  pathname: string;
};

export function DocsSidebar({ pathname }: DocsSidebarProps) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20">
        <DocsNavigation pathname={pathname} />
      </div>
    </aside>
  );
}
