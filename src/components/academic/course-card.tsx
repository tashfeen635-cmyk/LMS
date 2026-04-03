"use client";

import { Clock, User } from "lucide-react";
import type { Course } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface CourseCardProps {
  course: Course;
  teacherName?: string;
  progress?: number;
  nextClass?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// CourseCard
// ---------------------------------------------------------------------------
export default function CourseCard({
  course,
  teacherName,
  progress,
  nextClass,
  className,
}: CourseCardProps) {
  return (
    <Card className={cn("relative overflow-hidden pt-0", className)}>
      {/* Colored accent strip */}
      <div
        className="h-2 w-full shrink-0"
        style={{ backgroundColor: course.color }}
        aria-hidden="true"
      />

      <CardHeader className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg">{course.name}</CardTitle>
            <CardDescription className="mt-0.5 font-mono text-xs">
              {course.code}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {/* Teacher */}
        {teacherName && (
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <User className="size-4 shrink-0" />
            <span className="truncate">{teacherName}</span>
          </div>
        )}

        {/* Progress bar */}
        {typeof progress === "number" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Next class */}
        {nextClass && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span className="truncate">Next: {nextClass}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
