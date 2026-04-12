import { MarkdownEditorPage } from "@/features/markdown-editor";

export const handle = {
  docsNav: {
    title: "Markdown Editor",
    order: 30,
  },
};

export function meta() {
  return [
    { title: "Markdown Editor | Phaicom Tools" },
    {
      name: "description",
      content:
        "A split-screen Markdown editor with WYSIWYG authoring, live preview, and embedded HTML support.",
    },
  ];
}

export default function MarkdownEditorDocsPage() {
  return <MarkdownEditorPage />;
}
