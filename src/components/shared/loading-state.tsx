import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface LoadingStateProps {
  type?: "card" | "table" | "list";
  count?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Card skeleton
// ---------------------------------------------------------------------------
function CardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table skeleton
// ---------------------------------------------------------------------------
function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {/* Search bar placeholder */}
      <Skeleton className="h-8 w-64" />

      <div className="rounded-lg border">
        {/* Header */}
        <div className="flex gap-4 border-b p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "flex gap-4 p-3",
              rowIndex < rows - 1 && "border-b"
            )}
          >
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// List skeleton
// ---------------------------------------------------------------------------
function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoadingState
// ---------------------------------------------------------------------------
export default function LoadingState({
  type = "card",
  count = 3,
  className,
}: LoadingStateProps) {
  if (type === "table") {
    return (
      <div className={className}>
        <TableSkeleton rows={count} />
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className={className}>
        <ListSkeleton rows={count} />
      </div>
    );
  }

  // Default: card grid
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
