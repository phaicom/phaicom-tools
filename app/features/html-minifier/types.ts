export type HtmlMinifierOptions = {
  collapseWhitespace: boolean;
  minifyCss: boolean;
  minifyJavaScript: boolean;
  optimizeAttributes: boolean;
  removeComments: boolean;
  removeEmptyAttributes: boolean;
  removeOptionalTags: boolean;
  useShortDoctype: boolean;
};

export type HtmlMinifierStats = {
  minifiedBytes: number;
  originalBytes: number;
  savedBytes: number;
  reduction: number;
};
