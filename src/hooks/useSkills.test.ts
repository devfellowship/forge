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

  it("uses mock fallback ONLY when the request errors", async () => {
    fetchSkills.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useSkills());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills).toEqual(SKILLS);
    expect(result.current.usingFallback).toBe(true);
    expect(result.current.error).toBe("network down");
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
