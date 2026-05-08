import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { error: Error | null };

function reportError(error: Error, info?: { componentStack?: string }) {
  // Sentry-ready shim. Swap with `Sentry.captureException(error, { extra: info })` once wired.
  // eslint-disable-next-line no-console
  console.error("[ErrorBoundary]", error, info);
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    reportError(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isDev = import.meta.env.DEV;

    return (
      <div className="min-h-screen bg-background grid place-items-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-salmon-soft text-2xl">
            🌧️
          </div>
          <h1 className="font-display text-2xl font-bold text-pitch-black">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-grey">
            We've logged the issue. Try again, or head home and we'll keep things running.
          </p>

          {isDev && (
            <details className="mt-4 rounded-lg bg-muted p-3 text-left text-xs text-slate-grey">
              <summary className="cursor-pointer font-medium">Error details (dev only)</summary>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all">
                {error.message}
                {"\n\n"}
                {error.stack}
              </pre>
              <button
                type="button"
                className="mt-2 underline"
                onClick={() => navigator.clipboard?.writeText(`${error.message}\n${error.stack ?? ""}`)}
              >
                Copy details
              </button>
            </details>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={this.reset} className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              Try again
            </Button>
            <Button variant="outline" onClick={() => { window.location.href = "/"; }} className="w-full">
              Go home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
