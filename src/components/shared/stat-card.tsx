"use client";

import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; positive: boolean };
  icon?: ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
export default function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <CardAction>
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              {icon}
            </div>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="space-y-1.5">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>

        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                trend.positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.positive ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
