export const EDITOR_STORAGE_KEY = "phaicom-tools:editor:html-draft";

export const DEFAULT_DOCUMENT_HTML = "";
const LEGACY_SAMPLE_DOCUMENT_HTML = `
<h1>Quick Note</h1>
<p>Write <strong>rich text</strong> here.</p>
<p>Add <u>underline</u>, headings, lists, and links with the toolbar.</p>
<ul>
  <li>Everything is stored as HTML</li>
  <li>The preview stays synced in real time</li>
</ul>
`.trim();

const EMPTY_PARAGRAPH_PATTERN = /^<p(?:\s[^>]*)?><\/p>$/i;

export function normalizeHtmlDocument(html: string) {
  const normalized = html.trim();

  if (
    !normalized ||
    EMPTY_PARAGRAPH_PATTERN.test(normalized) ||
    normalized === LEGACY_SAMPLE_DOCUMENT_HTML
  ) {
    return "";
  }

  return normalized;
}
