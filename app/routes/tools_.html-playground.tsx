import { HtmlPlaygroundPage } from "@/features/html-playground";

export function meta() {
  return [
    { title: "HTML Playground – Online HTML, CSS & JavaScript Editor | Phaicom Tools" },
    {
      name: "description",
      content:
        "Write and run HTML, CSS, and JavaScript in your browser with a live, sandboxed preview. Experiment with frontend code instantly without setup.",
    },
  ];
}

export default function HtmlPlaygroundRoute() {
  return <HtmlPlaygroundPage />;
}
