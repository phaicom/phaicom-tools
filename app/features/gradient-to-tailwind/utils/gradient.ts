function collapseWhitespace(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function extractGradientValue(css: string) {
  const trimmed = css.trim().replace(/;$/, "");

  if (/^(?:linear|radial)-gradient\(/i.test(trimmed)) {
    return trimmed;
  }

  const declarationMatch = trimmed.match(
    /^(?:background|background-image)\s*:\s*((?:linear|radial)-gradient\([\s\S]*\))$/i,
  );

  return declarationMatch?.[1] ?? null;
}

function normalizeGradientValue(css: string) {
  return collapseWhitespace(css)
    .replace(/\s*,\s*/g, ",")
    .replace(/\(\s*/g, "(")
    .replace(/\s*\)/g, ")")
    .replace(/,\s+/g, ",")
    .replace(/\s+(?=(?:[^()]*\([^()]*\))*[^()]*$)/g, "_");
}

export function toTailwindGradientArbitraryValue(css: string) {
  const extracted = extractGradientValue(css);

  if (!extracted || !extracted.endsWith(")")) {
    return null;
  }

  const normalized = normalizeGradientValue(extracted);

  return normalized.length > 0 ? normalized : null;
}

export function convertGradientToTailwindBg(css: string) {
  const gradient = toTailwindGradientArbitraryValue(css);

  return gradient ? `bg-[${gradient}]` : "";
}

export function convertGradientToTailwindText(css: string) {
  const backgroundClass = convertGradientToTailwindBg(css);

  return backgroundClass ? `${backgroundClass} bg-clip-text text-transparent` : "";
}
