export const EDITOR_STORAGE_KEY = "phaicom-tools:editor:html-draft";
export const EDITOR_WRAP_PARAGRAPH_STORAGE_KEY = "phaicom-tools:editor:wrap-paragraph-output";

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

export function formatHtmlOutput(html: string, wrapInParagraph: boolean) {
  const normalized = normalizeHtmlDocument(html);

  if (!normalized) {
    return wrapInParagraph ? "<p></p>" : "";
  }

  if (wrapInParagraph || typeof DOMParser === "undefined") {
    return normalized;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(normalized, "text/html");
  const elements = Array.from(document.body.children);

  if (elements.length !== 1 || elements[0]?.tagName.toLowerCase() !== "p") {
    return normalized;
  }

  return elements[0].innerHTML.trim();
}
