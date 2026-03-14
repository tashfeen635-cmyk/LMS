import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
export default function Timeline({ items, className }: TimelineProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div
                className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border"
                aria-hidden="true"
              />
            )}

            {/* Dot / Icon */}
            <div className="relative z-10 flex shrink-0">
              {item.icon ? (
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full ring-4 ring-background",
                    item.color
                      ? undefined
                      : "bg-primary/10 text-primary dark:bg-primary/20"
                  )}
                  style={
                    item.color
                      ? { backgroundColor: item.color, color: "#fff" }
                      : undefined
                  }
                >
                  {item.icon}
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-1.5 size-[10px] rounded-full ring-4 ring-background",
                    item.color ? undefined : "bg-primary"
                  )}
                  style={
                    item.color ? { backgroundColor: item.color } : undefined
                  }
                />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex min-w-0 flex-1 flex-col gap-0.5",
                item.icon ? "pt-1" : "pt-0"
              )}
            >
              <p className="text-sm font-medium leading-snug text-foreground">
                {item.title}
              </p>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
              <time className="text-xs text-muted-foreground/70">
                {item.time}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
