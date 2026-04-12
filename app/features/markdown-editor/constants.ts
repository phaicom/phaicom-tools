export const MARKDOWN_EDITOR_STORAGE_KEY = "phaicom-tools:markdown-editor:draft";

export const DEFAULT_MARKDOWN = `# Product Notes

Write in Markdown, mix in raw HTML, and watch the preview update instantly.

This editor supports:

- **Bold** and _italic_ text
- [Links](https://reactrouter.com/)
- Lists and nested ideas
- Blockquotes
- \`inline code\`
- Fenced code blocks
- Tables

> Tip: raw HTML tags like \`<br />\`, \`<span>\`, and \`<div>\` are preserved in the preview.

<div class="rounded-callout">
  <strong>Embedded HTML</strong><br />
  <span style="color:#9d4edd;">This line is rendered from raw HTML inside the Markdown source.</span>
</div>

## Example Table

| Tool | Status | Notes |
| --- | --- | --- |
| Editor | Ready | WYSIWYG Markdown editing |
| Preview | Live | Renders Markdown + HTML |
| Workflow | Smooth | No submit button needed |

### Code Sample

\`\`\`tsx
export function Greeting() {
  return <p>Hello from a fenced code block.</p>;
}
\`\`\`

Paragraphs, HTML blocks, and partial Markdown should all remain editable while you type.`;
