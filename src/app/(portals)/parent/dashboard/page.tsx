"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  TrendingUp,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Eye,
  ChevronRight,
  Users,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByStudent,
  useGradesByStudent,
  useAttendanceByStudent,
  useAssignments,
  useAnnouncementsByRole,
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
  calculatePercentage,
  isOverdue,
  isUpcoming,
  getInitials,
  getGradeColor,
  getAttendanceColor,
} from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import AnnouncementCard from "@/components/communication/announcement-card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ParentDashboardPage() {
  const { user } = useAuthStore();
  const childrenIds = user?.children ?? [];
  const [selectedChildId, setSelectedChildId] = useState<string>(
    childrenIds[0] ?? ""
  );

  const selectedChild = selectedChildId ? getUserById(selectedChildId) : null;

  // Data hooks for the selected child
  const { data: courses, isLoading: coursesLoading } =
    useCoursesByStudent(selectedChildId || null);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByStudent(selectedChildId || null);
  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByStudent(selectedChildId || null);
  const { data: allAssignments, isLoading: assignmentsLoading } =
    useAssignments();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncementsByRole("parent");

  const isLoading =
    coursesLoading || gradesLoading || attendanceLoading || assignmentsLoading;

  // Enrolled course IDs
  const enrolledCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // Child's assignments
  const childAssignments = useMemo(
    () =>
      (allAssignments ?? []).filter(
        (a) => enrolledCourseIds.has(a.courseId) && a.status !== "draft"
      ),
    [allAssignments, enrolledCourseIds]
  );

  // Pending assignments (not yet graded for this student)
  const pendingAssignments = useMemo(() => {
    if (!grades) return childAssignments.filter((a) => a.status === "published");
    const gradedAssignmentIds = new Set(grades.map((g) => g.assignmentId));
    return childAssignments.filter(
      (a) =>
        a.status === "published" ||
        (a.status === "graded" && !gradedAssignmentIds.has(a.id))
    );
  }, [childAssignments, grades]);

  // GPA
  const gpa = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    return calculateGPA(grades);
  }, [grades]);

  // Attendance rate
  const attendanceRate = useMemo(() => {
    if (!attendance || attendance.length === 0) return 0;
    const present = attendance.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  // Alerts: low grades, absences, upcoming deadlines
  const alerts = useMemo(() => {
    const items: { id: string; type: "grade" | "absence" | "deadline"; message: string; severity: "warning" | "info" }[] = [];

    // Low grades (below 70%)
    if (grades) {
      for (const g of grades) {
        const pct = calculatePercentage(g.score, g.maxScore);
        if (pct < 70) {
          const course = getCourseById(g.courseId);
          const assignment = getAssignmentById(g.assignmentId);
          items.push({
            id: `grade-${g.id}`,
            type: "grade",
            message: `Low grade: ${pct}% on "${assignment?.title ?? "Assignment"}" in ${course?.name ?? "Course"}`,
            severity: "warning",
          });
        }
      }
    }

    // Recent absences
    if (attendance) {
      for (const a of attendance) {
        if (a.status === "absent") {
          const course = getCourseById(a.courseId);
          items.push({
            id: `absence-${a.id}`,
            type: "absence",
            message: `Absent from ${course?.name ?? "Course"} on ${formatDate(a.date)}`,
            severity: "warning",
          });
        }
      }
    }

    // Upcoming deadlines (within 7 days)
    for (const a of childAssignments) {
      if (a.status === "published" && !isOverdue(a.dueDate) && isUpcoming(a.dueDate, 7)) {
        const course = getCourseById(a.courseId);
        items.push({
          id: `deadline-${a.id}`,
          type: "deadline",
          message: `"${a.title}" due ${formatDate(a.dueDate)} in ${course?.name ?? "Course"}`,
          severity: "info",
        });
      }
    }

    return items.slice(0, 6);
  }, [grades, attendance, childAssignments]);

  // First name for greeting
  const firstName = user?.name.split(" ")[0] ?? "Parent";
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${firstName}`}
          description={todayFormatted}
        />
        <LoadingState
          type="card"
          count={4}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
        <LoadingState type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Parent Dashboard"
        description={`Welcome back, ${firstName}. ${todayFormatted}`}
      />

      {/* Child selector (only if multiple children) */}
      {childrenIds.length > 1 && (
        <div className="flex items-center gap-3">
          <Users className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Viewing:
          </span>
          <Select
            value={selectedChildId}
            onValueChange={(val) => val && setSelectedChildId(val)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {childrenIds.map((childId) => {
                const child = getUserById(childId);
                return (
                  <SelectItem key={childId} value={childId}>
                    {child?.name ?? childId}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Child overview card */}
      {selectedChild && (
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Avatar className="size-16">
              <AvatarImage src={selectedChild.avatar} alt={selectedChild.name} />
              <AvatarFallback className="text-lg">
                {getInitials(selectedChild.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedChild.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedChild.email}
              </p>
              {selectedChild.grade && (
                <Badge variant="secondary" className="mt-1">
                  Grade {selectedChild.grade}
                </Badge>
              )}
            </div>
            <Link href={`/parent/children/${selectedChildId}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="size-4" />
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current GPA"
          value={gpa.toFixed(2)}
          description="Out of 4.00"
          icon={<GraduationCap className="size-4" />}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description={`${attendance?.length ?? 0} records`}
          icon={<CalendarCheck className="size-4" />}
        />
        <StatCard
          title="Courses Enrolled"
          value={courses?.length ?? 0}
          description="Active courses"
          icon={<BookOpen className="size-4" />}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          description="Need attention"
          icon={<ClipboardList className="size-4" />}
        />
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-orange-500" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No alerts at this time. Everything looks good!
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3",
                      alert.severity === "warning"
                        ? "border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/30"
                        : "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 size-2 shrink-0 rounded-full",
                        alert.severity === "warning"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      )}
                    />
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-1">
              <Link href="/parent/communications">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="size-4" />
                  Contact Teacher
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </Link>
              <Link href={`/parent/children/${selectedChildId}/grades`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="size-4" />
                  View Grades
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </Link>
              <Link href={`/parent/children/${selectedChildId}/attendance`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CalendarCheck className="size-4" />
                  View Attendance
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </Link>
              <Link href={`/parent/children/${selectedChildId}`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Eye className="size-4" />
                  Child Overview
                  <ChevronRight className="ml-auto size-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Announcements
        </h2>
        {announcementsLoading ? (
          <LoadingState type="card" count={2} />
        ) : !announcements || announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No announcements at this time.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.slice(0, 4).map((ann) => {
              const author = getUserById(ann.authorId);
              return (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  authorName={author?.name}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
