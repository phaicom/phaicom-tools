import { EditorPage } from "@/features/editor";

export const handle = {
  docsNav: {
    title: "HTML Editor",
    order: 30,
  },
};

export function meta() {
  return [
    { title: "HTML Editor | Phaicom Tools" },
    {
      name: "description",
      content:
        "A split-screen TipTap editor with real-time HTML output, accessible toolbar controls, and a safe live preview.",
    },
  ];
}

export default function EditorDocsPage() {
  return <EditorPage />;
}
