import type {
  AuditVerdict,
  ConnectionRef,
  Kind,
  McpTool,
  SearchMode,
  Skill,
  SkillFile,
} from "@/data/types";
import { isValidIdentity } from "@/lib/identity";

const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "https://skills.devfellowship.com";

export interface ApiSkill {
  id?: string;
  name?: string;
  slug?: string;
  skill?: string;
  owner?: string;
  repo?: string;
  source?: string;
  kind?: string;
  type?: string;
  description?: string;
  summary?: string;
  topics?: string[];
  tags?: string[];
  installs?: number;
  install_count?: number;
  installCount?: number;
  updated_at?: string;
  updatedAt?: string;
  author?: string;
  hash?: string;
  audit?: ApiAudit;
  trend?: number[];
  mcps?: ApiNamed[];
  mcp_tools?: ApiNamed[];
  connections?: ApiNamed[];
  conns?: ApiNamed[];
  files?: ApiFile[];
  tree?: ApiFile[];
}

interface ApiAudit {
  score?: number;
  verdict?: string;
}

interface ApiNamed {
  name?: string;
  desc?: string;
  description?: string;
}

interface ApiFile {
  path?: string;
  name?: string;
  contents?: string;
  content?: string;
}

interface ListResponse {
  skills?: ApiSkill[];
  scope?: string;
}

interface SearchResponse {
  skills?: ApiSkill[];
  searchType?: string;
  scope?: string;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status);
  }
  return (await res.json()) as T;
}

const KINDS: ReadonlySet<string> = new Set<Kind>(["skill", "mcp", "connection"]);
const VERDICTS: ReadonlySet<string> = new Set<AuditVerdict>(["trust", "caution", "warning"]);

function toKind(raw: string | undefined): Kind {
  const value = (raw ?? "").toLowerCase();
  return KINDS.has(value) ? (value as Kind) : "skill";
}

function toVerdict(raw: string | undefined, score: number): AuditVerdict {
  const value = (raw ?? "").toLowerCase();
  if (VERDICTS.has(value)) return value as AuditVerdict;
  if (score >= 90) return "trust";
  if (score >= 75) return "caution";
  return "warning";
}

function toNamedList(items: ApiNamed[] | undefined): McpTool[] {
  if (!items) return [];
  return items.map((it) => ({
    name: it.name ?? "",
    desc: it.desc ?? it.description ?? "",
  }));
}

function toConnList(items: ApiNamed[] | undefined): ConnectionRef[] {
  return toNamedList(items);
}

function toFiles(items: ApiFile[] | undefined): SkillFile[] {
  if (!items) return [];
  return items.map((f) => ({
    path: f.path ?? f.name ?? "",
    contents: f.contents ?? f.content ?? "",
  }));
}

/** Splits a "owner/repo" source string, tolerating a bare owner or extra segments. */
function splitSource(source: string | undefined): { owner: string; repo: string } {
  const parts = (source ?? "").split("/").filter(Boolean);
  const owner = parts[0] ?? "";
  const repo = parts[1] ?? parts[0] ?? "";
  return { owner, repo };
}

/**
 * Identity resolution + hardening boundary. Every field below is author-controlled
 * (comes from the registry payload), so it is treated as hostile: identity segments
 * are validated against a shell-safe allowlist and `installable` is set accordingly.
 * String rendering safety (XSS) is handled downstream by react-markdown / React's
 * own text escaping — no raw HTML is ever produced from these values.
 */
export function adaptSkill(raw: ApiSkill): Skill {
  const skill = raw.skill ?? raw.slug ?? raw.name ?? "unknown";
  const fromSource = splitSource(raw.source);
  const owner = raw.owner ?? fromSource.owner ?? "devfellowship";
  const repo = raw.repo ?? fromSource.repo ?? owner;
  const source = `${owner}/${repo}`;
  const score = raw.audit?.score ?? 0;
  const mcps = toNamedList(raw.mcps ?? raw.mcp_tools);
  const conns = toConnList(raw.connections ?? raw.conns);
  const installable = isValidIdentity(owner, repo, skill);
  return {
    id: raw.id ?? `${owner}/${repo}/${skill}`,
    name: raw.name ?? skill,
    owner,
    repo,
    skill,
    slug: skill,
    source,
    kind: toKind(raw.kind ?? raw.type),
    description: raw.description ?? raw.summary ?? "",
    topics: raw.topics ?? raw.tags ?? [],
    installs: raw.installs ?? raw.install_count ?? raw.installCount ?? 0,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? "recently",
    author: raw.author ?? owner,
    audit: { score, verdict: toVerdict(raw.audit?.verdict, score) },
    trend: raw.trend ?? [],
    mcps,
    conns,
    files: toFiles(raw.files ?? raw.tree),
    installable,
  };
}

export async function fetchSkills(signal?: AbortSignal): Promise<Skill[]> {
  const data = await getJson<ListResponse>("/api/v1/skills", signal);
  return (data.skills ?? []).map(adaptSkill);
}

export async function fetchSkill(
  owner: string,
  repo: string,
  skill: string,
  signal?: AbortSignal,
): Promise<Skill> {
  const data = await getJson<ApiSkill>(
    `/api/v1/skills/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(skill)}`,
    signal,
  );
  return adaptSkill(data);
}

export async function searchSkills(
  query: string,
  mode: SearchMode,
  signal?: AbortSignal,
): Promise<Skill[]> {
  const params = new URLSearchParams({ q: query, semantic: String(mode === "semantic") });
  const data = await getJson<SearchResponse>(
    `/api/v1/skills/search?${params.toString()}`,
    signal,
  );
  return (data.skills ?? []).map(adaptSkill);
}
