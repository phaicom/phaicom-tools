import type { ConsoleLevel, PlaygroundCode } from "../types";

export const PREVIEW_MESSAGE_SOURCE = "phaicom-html-playground";

function escapeInlineScript(value: string) {
  return value.replace(/<\/script/gi, "<\\/script");
}

function buildBridgeScript(token: string) {
  const safeToken = JSON.stringify(token).replace(/</g, "\\u003c");
  const safeSource = JSON.stringify(PREVIEW_MESSAGE_SOURCE);

  return `<script>
(() => {
  const send = (level, values) => {
    const message = values.map((value) => {
      if (typeof value === "string") return value;
      if (value instanceof Error) return value.name + ": " + value.message;
      try { return JSON.stringify(value); } catch { return String(value); }
    }).join(" ");
    window.parent.postMessage({ source: ${safeSource}, token: ${safeToken}, level, message }, "*");
  };
  ["log", "warn", "error"].forEach((level) => {
    const original = console[level].bind(console);
    console[level] = (...values) => { original(...values); send(level, values); };
  });
  window.addEventListener("error", (event) => {
    send("error", [event.error || event.message || "Unknown runtime error"]);
  });
  window.addEventListener("unhandledrejection", (event) => {
    send("error", ["Unhandled promise rejection:", event.reason]);
  });
})();
</script>`;
}

export function buildPreviewDocument(code: PlaygroundCode, token: string) {
  const bridge = buildBridgeScript(token);
  const style = `<style>\n${code.css}\n</style>`;
  const script = `<script>\n${escapeInlineScript(code.javascript)}\n</script>`;
  const trimmedHtml = code.html.trim();
  const isFullDocument = /<!doctype\s+html|<html[\s>]/i.test(trimmedHtml);

  if (isFullDocument) {
    let document = trimmedHtml;
    document = /<\/head>/i.test(document)
      ? document.replace(/<\/head>/i, `${style}\n</head>`)
      : `${style}\n${document}`;
    document = /<\/body>/i.test(document)
      ? document.replace(/<\/body>/i, `${bridge}\n${script}\n</body>`)
      : `${document}\n${bridge}\n${script}`;
    return document;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${style}
</head>
<body>
${code.html}
${bridge}
${script}
</body>
</html>`;
}

export function buildDownloadDocument(code: PlaygroundCode) {
  return buildPreviewDocument(code, "download").replace(buildBridgeScript("download"), "");
}

export function downloadHtml(code: PlaygroundCode) {
  const blob = new Blob([buildDownloadDocument(code)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "playground.html";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parsePreviewMessage(
  value: unknown,
  expectedToken: string,
): { level: ConsoleLevel; message: string } | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const validLevel = data.level === "log" || data.level === "warn" || data.level === "error";
  if (
    data.source !== PREVIEW_MESSAGE_SOURCE ||
    data.token !== expectedToken ||
    !validLevel ||
    typeof data.message !== "string"
  ) {
    return null;
  }
  return { level: data.level as ConsoleLevel, message: data.message.slice(0, 10_000) };
}
