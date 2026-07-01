import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Skill } from "@/data/types";
import { SKILLS } from "@/data/skills";
import { fetchSkills } from "@/lib/api";

export interface SkillsState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  /** True only when the fetch FAILED and we are showing labelled sample rows instead of live data. */
  usingFallback: boolean;
  retry: () => void;
}

/** Sample rows shown while the registry is unreachable. Never installable, always flagged preview. */
const PREVIEW_SKILLS: Skill[] = SKILLS.map((s) => ({
  ...s,
  installable: false,
  preview: true,
}));

export function useSkills(): SkillsState {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetchSkills(controller.signal)
      .then((live) => {
        if (!active) return;
        // A resolved promise means the request succeeded (API 200). An empty list is a REAL
        // empty/indexing registry — show it as-is, never mask it with sample data.
        setSkills(live);
        setUsingFallback(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        // A rejection means a genuine FETCH FAILURE (network error / non-2xx). Show sample rows
        // that are clearly flagged preview + non-installable — never as real installable entries.
        setSkills(PREVIEW_SKILLS);
        setUsingFallback(true);
        setError(err instanceof Error ? err.message : "Failed to load registry");
        toast.error("Couldn't reach the registry — showing preview data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  return { skills, loading, error, usingFallback, retry };
}
