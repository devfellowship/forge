import { describe, expect, it } from "vitest";
import { safeHref } from "./markdown";

describe("safeHref scheme allowlist", () => {
  it("allows http/https/mailto", () => {
    expect(safeHref("https://example.com")).toBe("https://example.com");
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("mailto:a@b.com")).toBe("mailto:a@b.com");
  });

  it("allows relative and anchor links", () => {
    expect(safeHref("/docs")).toBe("/docs");
    expect(safeHref("#section")).toBe("#section");
    expect(safeHref("./rel")).toBe("./rel");
  });

  it("blocks javascript: and other executable schemes", () => {
    expect(safeHref("javascript:alert(1)")).toBe("");
    expect(safeHref("  javascript:alert(1)")).toBe("");
    expect(safeHref("JavaScript:alert(1)")).toBe("");
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBe("");
    expect(safeHref("vbscript:msgbox(1)")).toBe("");
  });

  it("handles empty/undefined", () => {
    expect(safeHref("")).toBe("");
    expect(safeHref(undefined)).toBe("");
    expect(safeHref(null)).toBe("");
  });
});
