export type Kind = "skill" | "mcp" | "connection";

export type AuditVerdict = "trust" | "caution" | "warning";

export interface SkillFile {
  path: string;
  contents: string;
}

export interface McpTool {
  name: string;
  desc: string;
}

export interface ConnectionRef {
  name: string;
  desc: string;
}

export interface Skill {
  id: string;
  name: string;
  /** Repository owner, e.g. "devfellowship". */
  owner: string;
  /** Repository name, e.g. "skills". */
  repo: string;
  /** Skill identifier within the repo, e.g. "dfl-code-style". */
  skill: string;
  /** Back-compat alias for skill within a repo (kept === skill). */
  slug: string;
  /** Display form "owner/repo". */
  source: string;
  kind: Kind;
  description: string;
  topics: string[];
  installs: number;
  updatedAt: string;
  author: string;
  audit: { score: number; verdict: AuditVerdict };
  trend: number[];
  mcps: McpTool[];
  conns: ConnectionRef[];
  files: SkillFile[];
  /** False when owner/repo/skill fail the identity allowlist — install is unsafe. */
  installable: boolean;
  /** True for sample rows shown while the registry is unreachable — not real installable entries. */
  preview?: boolean;
}

export interface AgentTarget {
  id: string;
  label: string;
}

export type Scope = "global" | "project";

export type LeaderboardTab = "trending" | "hot" | "official" | "all";

export type SearchMode = "fuzzy" | "semantic";
