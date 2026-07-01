import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MarkdownView } from "./MarkdownView";

describe("MarkdownView XSS hardening", () => {
  it("does not render a javascript: link as an executable href", () => {
    const { container } = render(
      <MarkdownView source={"[click](javascript:alert(document.cookie))"} />,
    );
    const anchor = container.querySelector("a");
    // Either no anchor is produced, or its href is not the javascript: scheme.
    if (anchor) {
      expect(anchor.getAttribute("href")).not.toMatch(/^javascript:/i);
    }
    expect(container.innerHTML).not.toMatch(/href="javascript:/i);
  });

  it("does not execute raw HTML / attribute-breakout payloads", () => {
    const payload = '"><img src=x onerror="alert(1)"><script>alert(2)</script>';
    const { container } = render(<MarkdownView source={payload} />);
    // No live nodes: the markup is escaped as text, so no script/img elements exist
    // and no element carries an onerror handler.
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    // The raw markup must not appear as live (unescaped) HTML.
    expect(container.innerHTML).not.toMatch(/<script/i);
    expect(container.innerHTML).not.toMatch(/<img/i);
  });

  it("renders safe https links normally", () => {
    const { container } = render(<MarkdownView source={"[ok](https://example.com)"} />);
    const anchor = container.querySelector("a");
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
  });
});
