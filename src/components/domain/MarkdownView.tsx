import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeHref } from "@/lib/markdown";

interface MarkdownViewProps {
  source: string;
}

function SafeAnchor({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const safe = safeHref(href);
  if (!safe) return <span {...rest}>{children}</span>;
  return (
    <a href={safe} rel="noopener noreferrer nofollow ugc" target="_blank" {...rest}>
      {children}
    </a>
  );
}

/**
 * Renders untrusted, author-controlled markdown. react-markdown escapes text and
 * does NOT execute raw HTML (rehype-raw is deliberately not used), and link hrefs
 * are passed through a scheme allowlist — so a `javascript:` URL or an HTML payload
 * in a skill's README/name/description cannot produce executable output.
 */
export function MarkdownView({ source }: MarkdownViewProps) {
  return (
    <div className="md animate-fadeUp">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: SafeAnchor }}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
