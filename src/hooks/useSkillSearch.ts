import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SearchMode, Skill } from "@/data/types";
import { searchSkills } from "@/lib/api";

export interface SkillSearchState {
  results: Skill[];
  loading: boolean;
  error: string | null;
}

/**
 * Server-side search against /api/v1/skills/search. Disabled (enabled=false) when the
 * caller is operating on fallback/mock data, in which case the client filter is used instead.
 */
export function useSkillSearch(
  query: string,
  mode: SearchMode,
  enabled: boolean,
): SkillSearchState {
  const [results, setResults] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!enabled || !q) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    const handle = window.setTimeout(() => {
      searchSkills(q, mode, controller.signal)
        .then((live) => {
          if (active) setResults(live);
        })
        .catch((err: unknown) => {
          if (!active || controller.signal.aborted) return;
          setResults([]);
          setError(err instanceof Error ? err.message : "Search failed");
          toast.error("Search is unavailable right now");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [query, mode, enabled]);

  return { results, loading, error };
}
