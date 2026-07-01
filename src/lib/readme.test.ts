import { describe, expect, it } from "vitest";
import type { Skill } from "@/data/types";
import { readmeFor } from "./readme";

function makeSkill(topics: string[]): Skill {
  return {
    id: "1",
    name: "demo",
    owner: "devfellowship",
    repo: "skills",
    skill: "demo",
    slug: "demo",
    source: "devfellowship/skills",
    kind: "skill",
    description: "A demo skill.",
    topics,
    installs: 10,
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

describe("readmeFor topics guard", () => {
  it("renders the topic list when topics are present", () => {
    const md = readmeFor(makeSkill(["React", "Testing"]));
    expect(md).toContain("working inside the React, Testing space");
  });

  it("never emits the double-space empty-topics artifact", () => {
    const md = readmeFor(makeSkill([]));
    expect(md).not.toContain("working inside the  space");
    expect(md).not.toMatch(/inside the {2,}/);
  });
});
