import createDOMPurify from "dompurify";

let domPurify: ReturnType<typeof createDOMPurify> | null = null;

function getDomPurify() {
  if (typeof window === "undefined") {
    return null;
  }

  domPurify ??= createDOMPurify(window);

  return domPurify;
}

export function sanitizeHtml(html: string) {
  const purify = getDomPurify();

  if (!purify) {
    return "";
  }

  return purify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
