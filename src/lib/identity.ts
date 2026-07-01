const SEGMENT = /^[a-z0-9][a-z0-9._-]{0,99}$/;

/** Validates a single owner/repo/skill segment against the shell-safe allowlist. */
export function isValidSegment(value: string | undefined | null): boolean {
  return typeof value === "string" && SEGMENT.test(value);
}

/** True only when every identity segment is safe to interpolate into a shell command / URL. */
export function isValidIdentity(owner: string, repo: string, skill: string): boolean {
  return isValidSegment(owner) && isValidSegment(repo) && isValidSegment(skill);
}
