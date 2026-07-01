export function formatCount(n: number): string {
  if (n >= 1000) {
    const value = (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "");
    return `${value}k`;
  }
  return String(n);
}

export function sparkPath(trend: number[]): string {
  if (trend.length < 2) return "";
  const w = 60;
  const h = 18;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  return trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Install target is the specific skill via the upstream `owner/repo@skill`
 * filter form (skills CLI), which narrows a multi-skill repo to one skill by
 * name — matching the 3-segment API identity owner/repo/skill.
 */
export function installCommand(owner: string, repo: string, skill: string): string {
  return `npx skills add ${owner}/${repo}@${skill}`;
}
