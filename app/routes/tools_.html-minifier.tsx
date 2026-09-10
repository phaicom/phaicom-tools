import { HtmlMinifierPage } from "@/features/html-minifier";

export function meta() {
  return [
    { title: "HTML Minifier – Minify HTML Online | Phaicom Tools" },
    {
      name: "description",
      content:
        "Minify HTML online by removing unnecessary whitespace and comments. Copy or download optimized HTML directly in your browser.",
    },
  ];
}

export default function HtmlMinifierRoute() {
  return <HtmlMinifierPage />;
}
