import { describe, expect, it } from "vitest";
import { installCommand, sparkPath } from "./format";

describe("sparkPath guard", () => {
  it("returns empty string for fewer than 2 points", () => {
    expect(sparkPath([])).toBe("");
    expect(sparkPath([5])).toBe("");
  });

  it("produces a valid path for 2+ points with no NaN", () => {
    const path = sparkPath([1, 2, 3]);
    expect(path).toMatch(/^M/);
    expect(path).not.toMatch(/NaN/);
  });

  it("handles a flat trend without div-by-zero", () => {
    const path = sparkPath([4, 4, 4]);
    expect(path).not.toMatch(/NaN/);
  });
});

describe("installCommand", () => {
  it("targets the specific skill via owner/repo@skill", () => {
    expect(installCommand("devfellowship", "skills", "dfl-stack")).toBe(
      "npx skills add devfellowship/skills@dfl-stack",
    );
  });
});
