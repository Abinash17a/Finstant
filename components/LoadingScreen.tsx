"use client";

export default function LoadingScreen() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-canvas)]">
      <div className="flex flex-col items-center">

        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-brand)] animate-spin"></div>
        </div>

        {/* Text */}
        <h2 className="mt-6 text-lg font-semibold text-[var(--color-ink)]">
          Loading Insights...
        </h2>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Analyzing your financial data
        </p>

        {/* Progress */}
        <div className="mt-6 w-64 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div className="h-full w-1/2 bg-[var(--color-accent)] animate-pulse rounded-full"></div>
        </div>

      </div>
    </div>
  );
}