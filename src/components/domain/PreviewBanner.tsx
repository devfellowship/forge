import { useState } from "react";
import { AlertTriangle, RotateCw, X } from "lucide-react";

interface PreviewBannerProps {
  /** Called to re-attempt the registry fetch. */
  onRetry?: () => void;
}

/**
 * Shown when the registry fetch FAILED and the grid is displaying labelled sample rows.
 * This is an honest error state — it never claims the sample data is real or "indexing".
 */
export function PreviewBanner({ onRetry }: PreviewBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-5 flex items-center gap-3 rounded-[11px] border border-[hsl(0_70%_55%/.28)] bg-[hsl(0_70%_50%/.08)] px-[14px] py-[10px]">
      <AlertTriangle className="h-4 w-4 shrink-0 text-[hsl(0_78%_66%)]" strokeWidth={2} />
      <p className="m-0 flex-1 text-[13px] leading-[1.5] text-[hsl(212_12%_70%)]">
        Registry unreachable — showing sample skills for preview only. These are not installable.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-[6px] rounded-md border border-[hsl(0_70%_55%/.32)] px-[10px] py-[4px] text-[12px] font-semibold text-[hsl(0_78%_70%)] transition-colors hover:bg-[hsl(0_70%_50%/.14)]"
        >
          <RotateCw className="h-[13px] w-[13px]" />
          Retry
        </button>
      )}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(212_10%_52%)] transition-colors hover:bg-[hsl(0_70%_50%/.12)] hover:text-foreground"
      >
        <X className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
