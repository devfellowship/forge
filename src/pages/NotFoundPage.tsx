import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-[90px] pt-10">
      <EmptyState
        icon={<Compass className="h-6 w-6" strokeWidth={1.8} />}
        title="Page not found"
        description="That page doesn't exist. Head back to the registry to browse skills."
        action={
          <Link
            to="/"
            className="inline-flex h-[38px] items-center justify-center rounded-lg bg-primary px-4 text-[13.5px] font-bold text-primary-foreground transition-colors hover:bg-[hsl(33_92%_60%)]"
          >
            Back to registry
          </Link>
        }
      />
    </main>
  );
}
