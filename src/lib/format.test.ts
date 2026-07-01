import { describe, expect, it } from "vitest";
import { formatCount, humanizeDate, installCommand, sparkPath } from "./format";

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

describe("formatCount guards", () => {
  it("formats normal counts", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(42)).toBe("42");
    expect(formatCount(1500)).toBe("1.5k");
    expect(formatCount(18420)).toBe("18k");
  });

  it("never renders NaN, Infinity, negatives or non-numbers", () => {
    expect(formatCount(NaN)).toBe("0");
    expect(formatCount(Infinity)).toBe("0");
    expect(formatCount(-5)).toBe("0");
    expect(formatCount(undefined as unknown as number)).toBe("0");
    expect(formatCount(null as unknown as number)).toBe("0");
  });
});

describe("humanizeDate", () => {
  it("passes through non-ISO mock strings unchanged", () => {
    expect(humanizeDate("recently")).toBe("recently");
    expect(humanizeDate("2 days ago")).toBe("2 days ago");
  });

  it("humanizes a real ISO timestamp into a relative label", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(humanizeDate(twoDaysAgo)).toBe("2 days ago");
  });

  it("handles a very recent ISO timestamp", () => {
    const now = new Date().toISOString();
    expect(humanizeDate(now)).toMatch(/ago|just now/);
  });
});
