"use client";

const BLOCK_ELEMENTS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "body",
  "caption",
  "div",
  "dl",
  "dt",
  "dd",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "html",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function getIndent(level: number) {
  return "  ".repeat(level);
}

function escapeAttributeValue(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function serializeAttributes(element: Element) {
  return Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${escapeAttributeValue(attribute.value)}"`)
    .join("");
}

function normalizeTextNode(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function formatInlineChildren(nodes: ChildNode[]) {
  return nodes
    .map((node) => formatNode(node, 0, false))
    .join("")
    .replace(/\s+</g, " <")
    .trim();
}

function formatElement(element: Element, level: number, indent: boolean): string {
  const tagName = element.tagName.toLowerCase();
  const attributes = serializeAttributes(element);
  const prefix = indent ? getIndent(level) : "";

  if (VOID_ELEMENTS.has(tagName)) {
    return `${prefix}<${tagName}${attributes}>`;
  }

  const childNodes = Array.from(element.childNodes).filter((node) => {
    if (node.nodeType !== Node.TEXT_NODE) {
      return true;
    }

    return normalizeTextNode(node.textContent ?? "").length > 0;
  });

  if (childNodes.length === 0) {
    return `${prefix}<${tagName}${attributes}></${tagName}>`;
  }

  const hasBlockChildren = childNodes.some(
    (node) =>
      node.nodeType === Node.ELEMENT_NODE &&
      BLOCK_ELEMENTS.has((node as Element).tagName.toLowerCase()),
  );

  if (!hasBlockChildren) {
    const content = formatInlineChildren(childNodes);
    return `${prefix}<${tagName}${attributes}>${content}</${tagName}>`;
  }

  const content = childNodes
    .map((node) => formatNode(node, level + 1, true))
    .filter(Boolean)
    .join("\n");

  return `${prefix}<${tagName}${attributes}>\n${content}\n${prefix}</${tagName}>`;
}

function formatNode(node: ChildNode, level: number, indent: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizeTextNode(node.textContent ?? "");

    if (!text) {
      return "";
    }

    return indent ? `${getIndent(level)}${text}` : text;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    return formatElement(node as Element, level, indent);
  }

  return "";
}

export function formatHtmlDocument(html: string) {
  const normalizedHtml = html.trim();

  if (!normalizedHtml || typeof DOMParser === "undefined") {
    return normalizedHtml;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(normalizedHtml, "text/html");
  const formatted = Array.from(document.body.childNodes)
    .map((node) => formatNode(node, 0, true))
    .filter(Boolean)
    .join("\n");

  return formatted || normalizedHtml;
}
