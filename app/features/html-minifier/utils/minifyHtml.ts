import type { HtmlMinifierOptions, HtmlMinifierStats } from "../types";

const TEMPLATE_FRAGMENTS = [
  /<%[\s\S]*?%>/,
  /<\?[\s\S]*?\?>/,
  /{{[\s\S]*?}}/,
  /<code(?:\s[^>]*)?>[\s\S]*?<\/code\s*>/gi,
];

export async function minifyHtml(input: string, options: HtmlMinifierOptions) {
  const { minify } = await import("html-minifier-terser/dist/htmlminifier.esm.bundle");
  return minify(input, {
    collapseBooleanAttributes: options.optimizeAttributes,
    collapseWhitespace: options.collapseWhitespace,
    conservativeCollapse: true,
    continueOnParseError: false,
    html5: true,
    ignoreCustomComments: [/^!/, /^\s*#/],
    ignoreCustomFragments: TEMPLATE_FRAGMENTS,
    minifyCSS: options.minifyCss,
    minifyJS: options.minifyJavaScript,
    processConditionalComments: false,
    removeAttributeQuotes: options.optimizeAttributes,
    removeComments: options.removeComments,
    removeEmptyAttributes: options.removeEmptyAttributes,
    removeOptionalTags: options.removeOptionalTags,
    removeRedundantAttributes: options.optimizeAttributes,
    removeScriptTypeAttributes: options.optimizeAttributes,
    removeStyleLinkTypeAttributes: options.optimizeAttributes,
    removeTagWhitespace: false,
    sortAttributes: false,
    sortClassName: false,
    useShortDoctype: options.useShortDoctype,
  });
}

export function getUtf8ByteSize(value: string) {
  return new TextEncoder().encode(value).length;
}

export function getMinifierStats(input: string, output: string): HtmlMinifierStats {
  const originalBytes = getUtf8ByteSize(input);
  const minifiedBytes = getUtf8ByteSize(output);
  const savedBytes = Math.max(0, originalBytes - minifiedBytes);

  return {
    minifiedBytes,
    originalBytes,
    savedBytes,
    reduction: originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0,
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export function getDownloadName(sourceName: string | null) {
  if (!sourceName) return "minified.html";
  return sourceName.replace(/\.(html?)$/i, ".min.$1");
}
