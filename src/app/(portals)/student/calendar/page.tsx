"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ClipboardList,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByStudent,
  useAssignments,
} from "@/lib/services/hooks";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Event type for calendar
// ---------------------------------------------------------------------------

interface CalendarEntry {
  id: string;
  title: string;
  time?: string;
  type: "class" | "assignment" | "exam";
  color: string;
  courseId?: string;
  courseName?: string;
  room?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const EVENT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  class: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  assignment: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  exam: {
    bg: "bg-red-50 dark:bg-red-950/50",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentCalendarPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } = useCoursesByStudent(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } = useAssignments();

  const isLoading = coursesLoading || assignmentsLoading;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();

  // Enrolled course IDs
  const enrolledCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // Build calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // Generate all events for the visible grid
  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();

    if (!courses) return map;

    // Class schedule events - generate for each day in the grid
    for (const day of calendarDays) {
      const dayOfWeek = day.getDay();
      const dateKey = format(day, "yyyy-MM-dd");

      // Skip weekends for class schedule (most classes are weekdays)
      for (const course of courses) {
        for (const slot of course.schedule) {
          if (DAY_MAP[slot.day] === dayOfWeek) {
            const entries = map.get(dateKey) ?? [];
            entries.push({
              id: `${course.id}-${slot.day}-${dateKey}`,
              title: course.name,
              time: `${slot.startTime} - ${slot.endTime}`,
              type: "class",
              color: course.color,
              courseId: course.id,
              courseName: course.name,
              room: slot.room,
            });
            map.set(dateKey, entries);
          }
        }
      }
    }

    // Assignment due dates
    if (allAssignments) {
      for (const assignment of allAssignments) {
        if (!enrolledCourseIds.has(assignment.courseId)) continue;
        if (assignment.status === "draft") continue;

        const dueDate = parseISO(assignment.dueDate);
        const dateKey = format(dueDate, "yyyy-MM-dd");
        const course = courses.find((c) => c.id === assignment.courseId);

        const isExam = assignment.type === "test";
        const entries = map.get(dateKey) ?? [];
        entries.push({
          id: assignment.id,
          title: assignment.title,
          time: format(dueDate, "h:mm a"),
          type: isExam ? "exam" : "assignment",
          color: course?.color ?? "#f59e0b",
          courseId: assignment.courseId,
          courseName: course?.name,
          description: `${assignment.points} points - ${assignment.type}`,
        });
        map.set(dateKey, entries);
      }
    }

    return map;
  }, [courses, allAssignments, enrolledCourseIds, calendarDays]);

  // Events for the selected day
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const events = eventsMap.get(dateKey) ?? [];
    // Sort: classes first, then assignments, then exams
    const typeOrder = { class: 0, assignment: 1, exam: 2 };
    return [...events].sort(
      (a, b) => typeOrder[a.type] - typeOrder[b.type]
    );
  }, [selectedDate, eventsMap]);

  // Navigation
  const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Calendar" description="View your class schedule and upcoming deadlines" />
        <LoadingState type="card" count={1} className="grid-cols-1" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Calendar" description="View your class schedule and upcoming deadlines" />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">Classes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-orange-500" />
          <span className="text-xs text-muted-foreground">Assignments Due</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Exams</span>
        </div>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayEvents = eventsMap.get(dateKey) ?? [];
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate
                ? isSameDay(day, selectedDate)
                : false;

              // Group event types for dots
              const hasClass = dayEvents.some((e) => e.type === "class");
              const hasAssignment = dayEvents.some(
                (e) => e.type === "assignment"
              );
              const hasExam = dayEvents.some((e) => e.type === "exam");

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative flex min-h-[72px] flex-col items-start gap-0.5 border-b border-r p-1.5 text-left transition-colors hover:bg-muted/50 sm:min-h-[88px] sm:p-2",
                    !isCurrentMonth && "opacity-40",
                    isSelected && "bg-primary/5 ring-1 ring-primary/30",
                    isToday && "bg-primary/5"
                  )}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday &&
                        "bg-primary text-primary-foreground font-bold",
                      !isToday && "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Event pills (max 3 visible, then +N more) */}
                  <div className="flex w-full flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((event) => {
                      const style = EVENT_STYLES[event.type];
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium",
                            style.bg,
                            style.text
                          )}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Dot indicators (for mobile) */}
                  <div className="absolute bottom-1 right-1 flex gap-0.5 sm:hidden">
                    {hasClass && (
                      <div className="size-1.5 rounded-full bg-blue-500" />
                    )}
                    {hasAssignment && (
                      <div className="size-1.5 rounded-full bg-orange-500" />
                    )}
                    {hasExam && (
                      <div className="size-1.5 rounded-full bg-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
              {isSameDay(selectedDate, today) && (
                <Badge variant="secondary" className="ml-1">
                  Today
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No events scheduled for this day.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => {
                  const style = EVENT_STYLES[event.type];
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3"
                      )}
                    >
                      {/* Color bar */}
                      <div
                        className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">
                            {event.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 border-transparent text-[10px]",
                              style.bg,
                              style.text
                            )}
                          >
                            {event.type === "class"
                              ? "Class"
                              : event.type === "assignment"
                              ? "Due"
                              : "Exam"}
                          </Badge>
                        </div>

                        {event.courseName && event.type !== "class" && (
                          <p className="text-xs text-muted-foreground">
                            {event.courseName}
                          </p>
                        )}

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {event.time && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" />
                              {event.time}
                            </span>
                          )}
                          {event.room && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3" />
                              {event.room}
                            </span>
                          )}
                          {event.description && (
                            <span className="inline-flex items-center gap-1">
                              <ClipboardList className="size-3" />
                              {event.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
