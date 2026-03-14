import { Badge } from "@/components/ui/badge";
import { cn, getGradeColor } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface GradeBadgeProps {
  grade: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// GradeBadge
// ---------------------------------------------------------------------------
export default function GradeBadge({ grade, className }: GradeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-semibold",
        getGradeColor(grade),
        className
      )}
    >
      {grade}
    </Badge>
  );
}
