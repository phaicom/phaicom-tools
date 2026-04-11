function collapseWhitespace(input: string) {
  return input.trim().replace(/\s+/g, " ");
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
  const trimmed = css.trim();

  if (!/^(?:linear|radial)-gradient\(/i.test(trimmed) || !trimmed.endsWith(")")) {
    return null;
  }

  const normalized = normalizeGradientValue(trimmed);

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
