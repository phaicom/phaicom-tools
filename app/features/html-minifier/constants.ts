import type { HtmlMinifierOptions } from "./types";

export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Hello</title>
  </head>
  <body>
    <!-- This comment can be removed. -->
    <h1>Hello World</h1>
    <p>Paste your HTML here, then minify it.</p>
  </body>
</html>`;

export const DEFAULT_OPTIONS: HtmlMinifierOptions = {
  collapseWhitespace: true,
  minifyCss: false,
  minifyJavaScript: false,
  optimizeAttributes: false,
  removeComments: true,
  removeEmptyAttributes: false,
  removeOptionalTags: false,
  useShortDoctype: true,
};

export const MAX_HTML_FILE_BYTES = 2 * 1024 * 1024;
export const HTML_MINIFIER_STORAGE_KEY = "phaicom-html-minifier-input-v1";
