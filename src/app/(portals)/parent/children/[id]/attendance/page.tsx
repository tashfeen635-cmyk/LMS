"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CalendarDays,
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
  getDay,
} from "date-fns";
import {
  useAttendanceByStudent,
  useCoursesByStudent,
} from "@/lib/services/hooks";
import { getUserById, getCourseById } from "@/lib/mock-data";
import { cn, formatDate, getAttendanceColor } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_COLORS: Record<string, string> = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-yellow-500",
  excused: "bg-blue-500",
};

const STATUS_CELL_COLORS: Record<string, string> = {
  present:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  excused: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChildAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: childId } = use(params);
  const child = getUserById(childId);

  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByStudent(childId);
  const { data: courses, isLoading: coursesLoading } =
    useCoursesByStudent(childId);

  const isLoading = attendanceLoading || coursesLoading;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const childName = child?.name ?? "Student";

  // Attendance summary stats
  const summary = useMemo(() => {
    if (!attendance)
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const excused = attendance.filter((a) => a.status === "excused").length;
    const total = attendance.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, excused, rate };
  }, [attendance]);

  // Build attendance map by date
  const attendanceByDate = useMemo(() => {
    const map = new Map<string, string>();
    if (!attendance) return map;
    for (const record of attendance) {
      // If multiple records on same date, use priority: absent > late > excused > present
      const existing = map.get(record.date);
      const priorities: Record<string, number> = {
        absent: 4,
        late: 3,
        excused: 2,
        present: 1,
      };
      if (
        !existing ||
        (priorities[record.status] ?? 0) > (priorities[existing] ?? 0)
      ) {
        map.set(record.date, record.status);
      }
    }
    return map;
  }, [attendance]);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // Navigation
  const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const today = new Date();

  // Sorted attendance records for the table
  const sortedRecords = useMemo(() => {
    if (!attendance) return [];
    return [...attendance].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [attendance]);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`${childName}'s Attendance`}
          description="View attendance records"
        />
        <LoadingState
          type="card"
          count={5}
          className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
        />
        <LoadingState type="card" count={1} />
      </div>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <div className="space-y-6">
        <Link href={`/parent/children/${childId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to {childName}
          </Button>
        </Link>
        <PageHeader
          title={`${childName}'s Attendance`}
          description="View attendance records"
        />
        <EmptyState
          icon={<CalendarCheck className="size-6" />}
          title="No attendance records"
          description="Attendance records will appear here once they are recorded."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href={`/parent/children/${childId}`}>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back to {childName}
        </Button>
      </Link>

      {/* Header */}
      <PageHeader
        title={`${childName}'s Attendance`}
        description="View attendance records and calendar"
      />

      {/* Summary stat cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Days"
          value={summary.total}
          description={`${summary.rate}% attendance rate`}
          icon={<CalendarDays className="size-4" />}
        />
        <StatCard
          title="Present"
          value={summary.present}
          description="Days present"
          icon={<CheckCircle className="size-4" />}
        />
        <StatCard
          title="Absent"
          value={summary.absent}
          description="Days absent"
          icon={<XCircle className="size-4" />}
        />
        <StatCard
          title="Late"
          value={summary.late}
          description="Days late"
          icon={<Clock className="size-4" />}
        />
        <StatCard
          title="Excused"
          value={summary.excused}
          description="Days excused"
          icon={<AlertCircle className="size-4" />}
        />
      </div>

      {/* Calendar heatmap + Legend */}
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

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-red-500" />
              <span className="text-xs text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-yellow-500" />
              <span className="text-xs text-muted-foreground">Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-blue-500" />
              <span className="text-xs text-muted-foreground">Excused</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-muted-foreground">No Record</span>
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

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const status = attendanceByDate.get(dateKey);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "flex min-h-[56px] flex-col items-center justify-center gap-1 border-b border-r p-1.5",
                    !isCurrentMonth && "opacity-30"
                  )}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-full text-xs font-medium",
                      isToday &&
                        "bg-primary text-primary-foreground font-bold",
                      !isToday && "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Status dot */}
                  {status ? (
                    <div
                      className={cn(
                        "size-3 rounded-sm",
                        STATUS_COLORS[status] ?? "bg-gray-300"
                      )}
                      title={status}
                    />
                  ) : isCurrentMonth ? (
                    <div className="size-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance records table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record) => {
                const course = getCourseById(record.courseId);
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: course?.color ?? "#6b7280",
                          }}
                        />
                        <span className="text-muted-foreground">
                          {course?.name ?? "Course"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent capitalize text-[11px]",
                          STATUS_CELL_COLORS[record.status] ?? ""
                        )}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                      {record.note ?? "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
