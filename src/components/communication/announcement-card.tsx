import { Pin } from "lucide-react";
import type { Announcement, AnnouncementPriority } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AnnouncementCardProps {
  announcement: Announcement;
  authorName?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPriorityBorderColor(priority: AnnouncementPriority): string {
  switch (priority) {
    case "urgent":
      return "border-l-red-500";
    case "high":
      return "border-l-orange-500";
    case "normal":
      return "border-l-blue-500";
    case "low":
      return "border-l-gray-400 dark:border-l-gray-600";
  }
}

// ---------------------------------------------------------------------------
// AnnouncementCard
// ---------------------------------------------------------------------------
export default function AnnouncementCard({
  announcement,
  authorName,
  className,
}: AnnouncementCardProps) {
  return (
    <Card
      className={cn(
        "border-l-4",
        getPriorityBorderColor(announcement.priority),
        className
      )}
    >
      <CardHeader>
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {/* Pin indicator */}
          {announcement.pinned && (
            <Pin className="mt-0.5 size-3.5 shrink-0 -rotate-45 text-muted-foreground" />
          )}
          <CardTitle className="truncate">{announcement.title}</CardTitle>
        </div>

        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] capitalize",
              announcement.priority === "urgent" &&
                "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
              announcement.priority === "high" &&
                "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
            )}
          >
            {announcement.priority}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Content preview — clamp to 2 lines */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {announcement.content}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {authorName && <span>By {authorName}</span>}
          <span>{formatDate(announcement.createdAt)}</span>
        </div>

        {/* Target role badges */}
        {announcement.targetRoles.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {announcement.targetRoles.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="text-[10px] capitalize"
              >
                {role}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
