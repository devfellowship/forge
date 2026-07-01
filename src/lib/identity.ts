const SEGMENT = /^[a-z0-9][a-z0-9._-]{0,99}$/;

/** Validates a single owner/repo/skill segment against the shell-safe allowlist. */
export function isValidSegment(value: string | undefined | null): boolean {
  return typeof value === "string" && SEGMENT.test(value);
}

/** True only when every identity segment is safe to interpolate into a shell command / URL. */
export function isValidIdentity(owner: string, repo: string, skill: string): boolean {
  return isValidSegment(owner) && isValidSegment(repo) && isValidSegment(skill);
}

/**
 * Builds the GitHub repo URL for an owner/repo pair. Returns "" when either segment fails
 * the allowlist, so callers can fall back rather than emit a malformed/hostile link.
 */
export function repoUrl(owner: string, repo: string): string {
  if (!isValidSegment(owner) || !isValidSegment(repo)) return "";
  return `https://github.com/${owner}/${repo}`;
}
