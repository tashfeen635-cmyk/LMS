import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatters
export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy")
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "MMM d, yyyy h:mm a")
}

export function formatTime(date: string): string {
  return format(parseISO(date), "h:mm a")
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export function isOverdue(dueDate: string): boolean {
  return isBefore(parseISO(dueDate), new Date())
}

export function isUpcoming(date: string, withinDays: number = 7): boolean {
  const target = parseISO(date)
  const now = new Date()
  const future = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000)
  return isAfter(target, now) && isBefore(target, future)
}

// Grade color mapping
export function getGradeColor(letterGrade: string): string {
  switch (letterGrade) {
    case "A": return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
    case "B": return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950"
    case "C": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950"
    case "D": return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950"
    case "F": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
    default: return "text-muted-foreground bg-muted"
  }
}

export function getGradeBgColor(letterGrade: string): string {
  switch (letterGrade) {
    case "A": return "#10b981"
    case "B": return "#3b82f6"
    case "C": return "#f59e0b"
    case "D": return "#f97316"
    case "F": return "#ef4444"
    default: return "#6b7280"
  }
}

// Attendance status color mapping
export function getAttendanceColor(status: string): string {
  switch (status) {
    case "present": return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
    case "absent": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
    case "late": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950"
    case "excused": return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950"
    default: return "text-muted-foreground bg-muted"
  }
}

// Percentage calculation
export function calculatePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}

// Initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
