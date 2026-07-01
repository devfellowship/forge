import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const fetchSkills = vi.fn();
vi.mock("@/lib/api", () => ({
  fetchSkills: (...args: unknown[]) => fetchSkills(...args),
  ApiError: class ApiError extends Error {},
}));

import { useSkills } from "./useSkills";
import { SKILLS } from "@/data/skills";

afterEach(() => {
  fetchSkills.mockReset();
});

describe("useSkills fallback policy", () => {
  it("shows the REAL empty registry (no mock) when fetch returns an empty array", async () => {
    fetchSkills.mockResolvedValue([]);
    const { result } = renderHook(() => useSkills());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills).toEqual([]);
    expect(result.current.usingFallback).toBe(false);
  });

  it("uses sample fallback ONLY when the request errors", async () => {
    fetchSkills.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useSkills());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills).toHaveLength(SKILLS.length);
    expect(result.current.usingFallback).toBe(true);
    expect(result.current.error).toBe("network down");
  });

  it("never presents fallback rows as real installable entries", async () => {
    fetchSkills.mockRejectedValue(new Error("500"));
    const { result } = renderHook(() => useSkills());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills.length).toBeGreaterThan(0);
    for (const s of result.current.skills) {
      expect(s.preview).toBe(true);
      expect(s.installable).toBe(false);
    }
  });

  it("distinguishes empty-200 (no fallback) from fetch failure (fallback)", async () => {
    fetchSkills.mockResolvedValue([]);
    const empty = renderHook(() => useSkills());
    await waitFor(() => expect(empty.result.current.loading).toBe(false));
    expect(empty.result.current.usingFallback).toBe(false);
    expect(empty.result.current.error).toBeNull();
    expect(empty.result.current.skills).toEqual([]);

    fetchSkills.mockReset();
    fetchSkills.mockRejectedValue(new Error("boom"));
    const failed = renderHook(() => useSkills());
    await waitFor(() => expect(failed.result.current.loading).toBe(false));
    expect(failed.result.current.usingFallback).toBe(true);
    expect(failed.result.current.error).toBe("boom");
  });

  it("shows live data when the registry returns skills", async () => {
    const live = [{ ...SKILLS[0]!, id: "live-1" }];
    fetchSkills.mockResolvedValue(live);
    const { result } = renderHook(() => useSkills());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills).toEqual(live);
    expect(result.current.usingFallback).toBe(false);
  });
});
