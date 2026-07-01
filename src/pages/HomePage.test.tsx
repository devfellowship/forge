import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Skill } from "@/data/types";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const useSkillsMock = vi.fn();
const useSkillSearchMock = vi.fn();

vi.mock("@/hooks/useSkills", () => ({ useSkills: () => useSkillsMock() }));
vi.mock("@/hooks/useSkillSearch", () => ({ useSkillSearch: () => useSkillSearchMock() }));

const setQuery = vi.fn();
vi.mock("@/hooks/useSearchState", () => ({
  useSearchState: () => ({ query: "react", mode: "fuzzy", setQuery }),
}));

import { HomePage } from "./HomePage";

function skill(id: string): Skill {
  return {
    id,
    name: `skill-${id}`,
    owner: "devfellowship",
    repo: "skills",
    skill: `skill-${id}`,
    slug: `skill-${id}`,
    source: "devfellowship/skills",
    kind: "skill",
    description: "desc",
    topics: [],
    installs: 1,
    updatedAt: "recently",
    author: "dfl",
    audit: { score: 90, verdict: "trust" },
    trend: [],
    mcps: [],
    conns: [],
    files: [],
    installable: true,
  };
}

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  useSkillsMock.mockReset();
  useSkillSearchMock.mockReset();
});

describe("HomePage search error state", () => {
  it("shows 'Search is unavailable' when the search backend errors — NOT 'No matches found'", () => {
    // Live registry (no fallback), search enabled, backend returns an error.
    useSkillsMock.mockReturnValue({
      skills: [skill("a")],
      loading: false,
      usingFallback: false,
      error: null,
      retry: vi.fn(),
    });
    useSkillSearchMock.mockReturnValue({
      results: [],
      loading: false,
      error: "Search failed",
      retry: vi.fn(),
    });

    renderHome();

    // Appears both in the aria-live region and the EmptyState heading.
    expect(screen.getAllByText("Search is unavailable").length).toBeGreaterThan(0);
    expect(screen.getByText("Retry search")).toBeInTheDocument();
    expect(screen.queryByText("No matches found")).not.toBeInTheDocument();
  });

  it("shows 'No matches found' for a genuine empty result (no error)", () => {
    useSkillsMock.mockReturnValue({
      skills: [skill("a")],
      loading: false,
      usingFallback: false,
      error: null,
      retry: vi.fn(),
    });
    useSkillSearchMock.mockReturnValue({
      results: [],
      loading: false,
      error: null,
      retry: vi.fn(),
    });

    renderHome();

    expect(screen.getByText("No matches found")).toBeInTheDocument();
    expect(screen.queryByText("Search is unavailable")).not.toBeInTheDocument();
  });
});
