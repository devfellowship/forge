import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSkill, searchSkills } from "./api";

function mockFetch(json: unknown) {
  const spy = vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> =>
      new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchSkill", () => {
  it("hits the 3-segment /api/v1/skills/:owner/:repo/:skill endpoint", async () => {
    const spy = mockFetch({ owner: "devfellowship", repo: "skills", skill: "dfl-code-style" });
    await fetchSkill("devfellowship", "skills", "dfl-code-style");
    const url = String(spy.mock.calls[0]?.[0]);
    expect(url).toContain("/api/v1/skills/devfellowship/skills/dfl-code-style");
  });
});

describe("searchSkills", () => {
  it("sends semantic=true and never mode=", async () => {
    const spy = mockFetch({ skills: [] });
    await searchSkills("react", "semantic");
    const url = String(spy.mock.calls[0]?.[0]);
    expect(url).toContain("semantic=true");
    expect(url).not.toContain("mode=");
  });

  it("sends semantic=false for fuzzy mode", async () => {
    const spy = mockFetch({ skills: [] });
    await searchSkills("react", "fuzzy");
    const url = String(spy.mock.calls[0]?.[0]);
    expect(url).toContain("semantic=false");
  });
});
