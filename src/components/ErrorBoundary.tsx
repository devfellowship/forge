import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled render error", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-[1200px] px-6 pb-[90px] pt-10">
          <EmptyState
            icon={<AlertTriangle className="h-6 w-6" strokeWidth={1.8} />}
            title="Something broke"
            description="An unexpected error crashed this view. Reloading usually clears it."
            action={<Button onClick={() => window.location.reload()}>Reload the page</Button>}
          />
        </main>
      );
    }
    return this.props.children;
  }
}
