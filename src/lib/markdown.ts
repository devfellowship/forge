const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:"]);

// C0 control chars (0x00-0x1F, includes tab/newline/CR) plus DEL (0x7F). The
// WHATWG URL parser strips these while resolving a scheme (e.g. `java\tscript:`
// -> protocol `javascript:`), so a naive regex scheme sniff and the parser
// disagree on them. Reject any input carrying one before parsing.
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

/**
 * Returns a link href only if its scheme is on the allowlist, otherwise "".
 * Blocks `javascript:`, `data:`, `vbscript:` and other executable/exfil schemes.
 * Relative and anchor links (no scheme) are allowed.
 */
export function safeHref(href: string | undefined | null): string {
  if (!href) return "";
  if (CONTROL_CHARS.test(href)) return "";
  const trimmed = href.trim();
  if (trimmed === "") return "";
  // Anchor or scheme-relative/relative links have no dangerous scheme.
  if (trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }
  // The URL parser is authoritative for scheme detection. Whenever a scheme is
  // present, decide with the parsed `url.protocol` against the allowlist — never
  // let a regex "no scheme detected" branch bypass this check.
  try {
    const url = new URL(trimmed, "https://forge.local");
    return ALLOWED_SCHEMES.has(url.protocol.toLowerCase()) ? trimmed : "";
  } catch {
    return "";
  }
}
