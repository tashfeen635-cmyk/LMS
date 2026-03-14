"use client";

import { Check, X, Clock, Shield } from "lucide-react";
import type { AttendanceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AttendanceToggleProps {
  status: AttendanceStatus;
  onChange?: (status: AttendanceStatus) => void;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const options: {
  value: AttendanceStatus;
  icon: typeof Check;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "present",
    icon: Check,
    label: "Present",
    activeClass:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-900",
  },
  {
    value: "absent",
    icon: X,
    label: "Absent",
    activeClass:
      "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900",
  },
  {
    value: "late",
    icon: Clock,
    label: "Late",
    activeClass:
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900",
  },
  {
    value: "excused",
    icon: Shield,
    label: "Excused",
    activeClass:
      "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900",
  },
];

// ---------------------------------------------------------------------------
// AttendanceToggle
// ---------------------------------------------------------------------------
export default function AttendanceToggle({
  status,
  onChange,
  disabled = false,
}: AttendanceToggleProps) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = status === option.value;

        return (
          <Button
            key={option.value}
            variant="ghost"
            size="icon"
            disabled={disabled}
            aria-label={option.label}
            aria-checked={isActive}
            role="radio"
            className={cn(
              "size-8 rounded-full",
              isActive
                ? option.activeClass
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChange?.(option.value)}
          >
            <Icon className="size-4" />
          </Button>
        );
      })}
    </div>
  );
}
