"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarCheck,
  BookOpen,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  useCoursesByStudent,
  useGradesByStudent,
  useAttendanceByStudent,
  useAssignments,
} from "@/lib/services/hooks";
import {
  getUserById,
  getCourseById,
  getAssignmentById,
  calculateGPA,
} from "@/lib/mock-data";
import {
  cn,
  formatDate,
  formatRelative,
  calculatePercentage,
  getInitials,
  getGradeColor,
  getAttendanceColor,
  isOverdue,
} from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import GradeBadge from "@/components/academic/grade-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Grade } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function percentToLetter(pct: number): string {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

interface CourseGradeSummary {
  courseId: string;
  courseName: string;
  courseColor: string;
  averagePercent: number;
  letterGrade: string;
  trend: "up" | "down" | "stable";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChildSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: childId } = use(params);
  const child = getUserById(childId);

  const { data: courses, isLoading: coursesLoading } =
    useCoursesByStudent(childId);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByStudent(childId);
  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByStudent(childId);
  const { data: allAssignments, isLoading: assignmentsLoading } =
    useAssignments();

  const isLoading =
    coursesLoading || gradesLoading || attendanceLoading || assignmentsLoading;

  // Enrolled course IDs
  const enrolledCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // GPA
  const gpa = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    return calculateGPA(grades);
  }, [grades]);

  // Attendance summary
  const attendanceSummary = useMemo(() => {
    if (!attendance) return { present: 0, absent: 0, late: 0, excused: 0, total: 0, rate: 0 };
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const excused = attendance.filter((a) => a.status === "excused").length;
    const total = attendance.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, excused, total, rate };
  }, [attendance]);

  // Per-course grade summaries
  const courseSummaries: CourseGradeSummary[] = useMemo(() => {
    if (!courses || !grades) return [];
    return courses
      .map((course) => {
        const courseGrades = grades.filter((g) => g.courseId === course.id);
        if (courseGrades.length === 0) return null;

        const avgPct =
          courseGrades.reduce(
            (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
            0
          ) / courseGrades.length;

        const sorted = [...courseGrades].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let trend: "up" | "down" | "stable" = "stable";
        if (sorted.length >= 2) {
          const mid = Math.floor(sorted.length / 2);
          const firstHalf = sorted.slice(0, mid);
          const secondHalf = sorted.slice(mid);
          const firstAvg =
            firstHalf.reduce(
              (s, g) => s + calculatePercentage(g.score, g.maxScore),
              0
            ) / firstHalf.length;
          const secondAvg =
            secondHalf.reduce(
              (s, g) => s + calculatePercentage(g.score, g.maxScore),
              0
            ) / secondHalf.length;
          if (secondAvg - firstAvg > 2) trend = "up";
          else if (firstAvg - secondAvg > 2) trend = "down";
        }

        return {
          courseId: course.id,
          courseName: course.name,
          courseColor: course.color,
          averagePercent: Math.round(avgPct),
          letterGrade: percentToLetter(Math.round(avgPct)),
          trend,
        };
      })
      .filter(Boolean) as CourseGradeSummary[];
  }, [courses, grades]);

  // Upcoming assignments
  const upcomingAssignments = useMemo(() => {
    if (!allAssignments) return [];
    return allAssignments
      .filter(
        (a) =>
          enrolledCourseIds.has(a.courseId) &&
          a.status === "published" &&
          !isOverdue(a.dueDate)
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 5);
  }, [allAssignments, enrolledCourseIds]);

  // Recent activity: combine grades + attendance, sorted by date desc
  const recentActivity = useMemo(() => {
    const items: {
      id: string;
      type: "grade" | "attendance";
      date: string;
      description: string;
      detail: string;
      color: string;
    }[] = [];

    if (grades) {
      for (const g of grades) {
        const course = getCourseById(g.courseId);
        const assignment = getAssignmentById(g.assignmentId);
        const pct = calculatePercentage(g.score, g.maxScore);
        items.push({
          id: `grade-${g.id}`,
          type: "grade",
          date: g.date,
          description: `Graded: ${assignment?.title ?? "Assignment"} - ${pct}% (${g.letterGrade})`,
          detail: course?.name ?? "Course",
          color: course?.color ?? "#6b7280",
        });
      }
    }

    if (attendance) {
      for (const a of attendance) {
        const course = getCourseById(a.courseId);
        items.push({
          id: `att-${a.id}`,
          type: "attendance",
          date: a.date,
          description: `Attendance: ${a.status.charAt(0).toUpperCase() + a.status.slice(1)}${a.note ? ` - ${a.note}` : ""}`,
          detail: course?.name ?? "Course",
          color: course?.color ?? "#6b7280",
        });
      }
    }

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
  }, [grades, attendance]);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState type="card" count={1} className="grid-cols-1" />
        <LoadingState
          type="card"
          count={4}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
      </div>
    );
  }

  if (!child) {
    return (
      <EmptyState
        title="Child not found"
        description="The student profile you are looking for does not exist."
        action={{
          label: "Back to Dashboard",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/parent/dashboard">
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Child profile header */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="size-20">
            <AvatarImage src={child.avatar} alt={child.name} />
            <AvatarFallback className="text-xl">
              {getInitials(child.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {child.name}
            </h1>
            <p className="text-sm text-muted-foreground">{child.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {child.grade && (
                <Badge variant="secondary">Grade {child.grade}</Badge>
              )}
              <Badge variant="outline">GPA: {gpa.toFixed(2)}</Badge>
              <Badge variant="outline">
                Attendance: {attendanceSummary.rate}%
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/parent/children/${childId}/grades`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <TrendingUp className="size-4" />
                Grades
              </Button>
            </Link>
            <Link href={`/parent/children/${childId}/attendance`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarCheck className="size-4" />
                Attendance
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">
            Courses
            <Badge variant="secondary" className="ml-1.5">
              {courses?.length ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* ------ Overview Tab ------ */}
        <TabsContent value="overview">
          <div className="space-y-6 pt-4">
            {/* Grade summary per course */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Summary by Course</CardTitle>
              </CardHeader>
              <CardContent>
                {courseSummaries.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No grades recorded yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-center">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseSummaries.map((summary) => (
                        <TableRow key={summary.courseId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-6 w-1 shrink-0 rounded-full"
                                style={{ backgroundColor: summary.courseColor }}
                              />
                              <span className="truncate text-sm font-medium">
                                {summary.courseName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <GradeBadge grade={summary.letterGrade} />
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {summary.averagePercent}%
                          </TableCell>
                          <TableCell className="text-center">
                            {summary.trend === "up" && (
                              <TrendingUp className="mx-auto size-4 text-emerald-500" />
                            )}
                            {summary.trend === "down" && (
                              <TrendingDown className="mx-auto size-4 text-red-500" />
                            )}
                            {summary.trend === "stable" && (
                              <Minus className="mx-auto size-4 text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Attendance summary + Upcoming assignments */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attendance summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <CheckCircle className="size-5 text-emerald-500" />
                      <div>
                        <p className="text-lg font-bold">{attendanceSummary.present}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <XCircle className="size-5 text-red-500" />
                      <div>
                        <p className="text-lg font-bold">{attendanceSummary.absent}</p>
                        <p className="text-xs text-muted-foreground">Absent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Clock className="size-5 text-yellow-500" />
                      <div>
                        <p className="text-lg font-bold">{attendanceSummary.late}</p>
                        <p className="text-xs text-muted-foreground">Late</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <AlertCircle className="size-5 text-blue-500" />
                      <div>
                        <p className="text-lg font-bold">{attendanceSummary.excused}</p>
                        <p className="text-xs text-muted-foreground">Excused</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAssignments.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No upcoming assignments.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAssignments.map((assignment) => {
                        const course = getCourseById(assignment.courseId);
                        return (
                          <div
                            key={assignment.id}
                            className="flex items-center gap-3 rounded-lg border p-3"
                          >
                            <div
                              className="h-10 w-1 shrink-0 rounded-full"
                              style={{ backgroundColor: course?.color ?? "#6b7280" }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {assignment.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {course?.name ?? "Course"} &middot; {assignment.type}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-xs font-medium text-foreground">
                                Due {formatDate(assignment.dueDate)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.points} pts
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ------ Courses Tab ------ */}
        <TabsContent value="courses">
          <div className="pt-4">
            {!courses || courses.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title="No courses"
                description="This student is not enrolled in any courses."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const teacher = getUserById(course.teacherId);
                  const courseGrades = grades?.filter(
                    (g) => g.courseId === course.id
                  );
                  const avgPct =
                    courseGrades && courseGrades.length > 0
                      ? Math.round(
                          courseGrades.reduce(
                            (sum, g) =>
                              sum + calculatePercentage(g.score, g.maxScore),
                            0
                          ) / courseGrades.length
                        )
                      : null;

                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div
                            className="mt-0.5 h-10 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-base">
                              {course.name}
                            </CardTitle>
                            <p className="text-xs font-mono text-muted-foreground">
                              {course.code}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Teacher: {teacher?.name ?? "Unknown"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Current Grade:
                          </span>
                          {avgPct !== null ? (
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold tabular-nums">
                                {avgPct}%
                              </span>
                              <GradeBadge grade={percentToLetter(avgPct)} />
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              N/A
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {course.schedule.map((slot, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {slot.day.slice(0, 3)} {slot.startTime}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ------ Recent Activity Tab ------ */}
        <TabsContent value="activity">
          <div className="pt-4">
            {recentActivity.length === 0 ? (
              <EmptyState
                icon={<FileText className="size-6" />}
                title="No recent activity"
                description="Activity will appear here as grades and attendance are recorded."
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div
                          className="mt-1 h-8 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {item.description}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.detail}</span>
                            <span>&middot;</span>
                            <span>{formatDate(item.date)}</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-[10px] capitalize",
                            item.type === "grade"
                              ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          )}
                        >
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
