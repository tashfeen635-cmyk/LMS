"use client";

import {
  CheckCircle,
  Circle,
  FileEdit,
  Clock,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  FileText,
  FolderKanban,
  PenTool,
} from "lucide-react";
import type { Assignment, AssignmentType } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, isOverdue, isUpcoming } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AssignmentCardProps {
  assignment: Assignment;
  courseName?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTypeIcon(type: AssignmentType) {
  switch (type) {
    case "homework":
      return <BookOpen className="size-3" />;
    case "quiz":
      return <HelpCircle className="size-3" />;
    case "test":
      return <FileText className="size-3" />;
    case "project":
      return <FolderKanban className="size-3" />;
    case "essay":
      return <PenTool className="size-3" />;
  }
}

function getTypeColor(type: AssignmentType): string {
  switch (type) {
    case "homework":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "quiz":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    case "test":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    case "project":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "essay":
      return "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300";
  }
}

// ---------------------------------------------------------------------------
// AssignmentCard
// ---------------------------------------------------------------------------
export default function AssignmentCard({
  assignment,
  courseName,
  className,
}: AssignmentCardProps) {
  const overdue = isOverdue(assignment.dueDate);
  const dueSoon = !overdue && isUpcoming(assignment.dueDate, 3);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:ring-2 hover:ring-primary/20",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <CardTitle className="truncate">{assignment.title}</CardTitle>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Course badge */}
              {courseName && (
                <Badge variant="secondary" className="text-xs">
                  {courseName}
                </Badge>
              )}

              {/* Type badge */}
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 border-transparent text-xs",
                  getTypeColor(assignment.type)
                )}
              >
                {getTypeIcon(assignment.type)}
                <span className="capitalize">{assignment.type}</span>
              </Badge>
            </div>
          </div>

          {/* Status indicator */}
          <div className="shrink-0 pt-0.5">
            {assignment.status === "graded" && (
              <CheckCircle className="size-5 text-emerald-500" />
            )}
            {assignment.status === "published" && (
              <Circle className="size-5 text-blue-500" />
            )}
            {assignment.status === "draft" && (
              <FileEdit className="size-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-3">
          {/* Points */}
          <span className="text-sm font-medium text-muted-foreground">
            {assignment.points} pts
          </span>

          {/* Due date indicator */}
          {overdue ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertTriangle className="size-3.5" />
              Overdue
            </span>
          ) : dueSoon ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              <Clock className="size-3.5" />
              Due soon
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Due {formatDate(assignment.dueDate)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
