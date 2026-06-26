"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <span className="text-4xl">💀</span>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>

      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred. Don&apos;t worry, our team has been notified.
        Try refreshing the page.
      </p>

      <button
        onClick={reset}
        className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
