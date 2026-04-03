"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Something Went Wrong
        </h2>

        <p className="mt-3 text-muted-foreground">
          An unexpected error occurred. Please try again or return to the
          previous page.
        </p>

        <button
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
