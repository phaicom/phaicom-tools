import { Outlet, useLocation } from "react-router";

import { DocsBreadcrumbs, DocsSidebar } from "@/features/docs";

export function meta() {
  return [
    { title: "Docs | Phaicom Tools" },
    { name: "description", content: "Documentation for Phaicom Tools." },
  ];
}

export default function Docs() {
  const location = useLocation();

  return (
    <main className="mx-auto flex w-full max-w-375 flex-1 flex-col px-4 py-6 md:px-6 xl:px-8">
      <div className="grid flex-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <DocsSidebar pathname={location.pathname} />

        <section className="min-w-0">
          <DocsBreadcrumbs pathname={location.pathname} />

          <div className="mt-6">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
