const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:"]);

/**
 * Returns a link href only if its scheme is on the allowlist, otherwise "".
 * Blocks `javascript:`, `data:`, `vbscript:` and other executable/exfil schemes.
 * Relative and anchor links (no scheme) are allowed.
 */
export function safeHref(href: string | undefined | null): string {
  if (!href) return "";
  const trimmed = href.trim();
  if (trimmed === "") return "";
  // Anchor or scheme-relative/relative links have no dangerous scheme.
  if (trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed, "https://forge.local");
    // If URL parsing pulled a scheme from the input, enforce the allowlist.
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      return ALLOWED_SCHEMES.has(url.protocol.toLowerCase()) ? trimmed : "";
    }
    return trimmed;
  } catch {
    return "";
  }
}
