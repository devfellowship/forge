export function formatCount(n: number): string {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return "0";
  const value = Math.floor(n);
  if (value >= 1000) {
    const scaled = (value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "");
    return `${scaled}k`;
  }
  return String(value);
}

/**
 * Turns a real ISO `updated_at` into a short relative label ("2 days ago"). Non-ISO strings
 * (the mock "recently"/"2 days ago" form) pass through unchanged so preview data keeps working.
 */
export function humanizeDate(value: string): string {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return value;

  const diff = Date.now() - ms;
  if (diff < 0) return "just now";

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    const mins = Math.max(1, Math.round(diff / minute));
    return mins === 1 ? "1 minute ago" : `${mins} minutes ago`;
  }
  if (diff < day) {
    const hours = Math.round(diff / hour);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (diff < 30 * day) {
    const days = Math.round(diff / day);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (diff < 365 * day) {
    const months = Math.round(diff / (30 * day));
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.round(diff / (365 * day));
  return years === 1 ? "1 year ago" : `${years} years ago`;
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
