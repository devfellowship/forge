import { describe, expect, it } from "vitest";
import { isValidIdentity, isValidSegment, repoUrl } from "./identity";
import { adaptSkill } from "./api";

describe("isValidSegment", () => {
  it("accepts normal owner/repo/skill segments", () => {
    expect(isValidSegment("devfellowship")).toBe(true);
    expect(isValidSegment("dfl-code-style")).toBe(true);
    expect(isValidSegment("react.perf_audit-2")).toBe(true);
  });

  it("rejects shell-injection payloads", () => {
    expect(isValidSegment("x; rm -rf ~ #")).toBe(false);
    expect(isValidSegment("a b")).toBe(false);
    expect(isValidSegment("$(whoami)")).toBe(false);
    expect(isValidSegment("../etc")).toBe(false);
    expect(isValidSegment("UPPER")).toBe(false);
    expect(isValidSegment("")).toBe(false);
    expect(isValidSegment(undefined)).toBe(false);
  });
});

describe("adaptSkill install-command validation", () => {
  it("marks a skill with an injection source as non-installable", () => {
    const skill = adaptSkill({
      name: "evil",
      source: "x; rm -rf ~ #/repo",
      slug: "evil",
    });
    expect(skill.installable).toBe(false);
  });

  it("marks a clean 3-segment skill as installable", () => {
    const skill = adaptSkill({
      name: "dfl-code-style",
      owner: "devfellowship",
      repo: "skills",
      skill: "dfl-code-style",
    });
    expect(skill.installable).toBe(true);
    expect(skill.owner).toBe("devfellowship");
    expect(skill.repo).toBe("skills");
    expect(skill.skill).toBe("dfl-code-style");
    expect(skill.source).toBe("devfellowship/skills");
  });

  it("keeps isValidIdentity consistent with adaptSkill", () => {
    expect(isValidIdentity("devfellowship", "skills", "dfl-code-style")).toBe(true);
    expect(isValidIdentity("a", "b", "c;d")).toBe(false);
  });
});

describe("repoUrl", () => {
  it("builds a github url for valid segments", () => {
    expect(repoUrl("devfellowship", "skills")).toBe("https://github.com/devfellowship/skills");
  });

  it("returns empty for hostile segments rather than a malformed link", () => {
    expect(repoUrl("x; rm -rf ~ #", "repo")).toBe("");
    expect(repoUrl("owner", "../etc")).toBe("");
  });
});
