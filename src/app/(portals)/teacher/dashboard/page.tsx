"use client";

import { useMemo } from "react";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Megaphone,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByTeacher,
  useAssignments,
  useGradesByCourse,
  useAnnouncementsByRole,
} from "@/lib/services/hooks";
import {
  getUserById,
  getCourseById,
  getAssignmentsByCourse,
} from "@/lib/mock-data";
import { formatDate, calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import AnnouncementCard from "@/components/communication/announcement-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getTodayName(): string {
  return DAYS[new Date().getDay()];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } =
    useCoursesByTeacher(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } =
    useAssignments();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncementsByRole("teacher");

  const isLoading = coursesLoading || assignmentsLoading || announcementsLoading;

  // IDs of courses taught by this teacher
  const myCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // Total unique students across all classes
  const totalStudents = useMemo(() => {
    if (!courses) return 0;
    const studentIds = new Set<string>();
    for (const course of courses) {
      for (const sid of course.students) {
        studentIds.add(sid);
      }
    }
    return studentIds.size;
  }, [courses]);

  // Active classes count
  const activeClasses = courses?.length ?? 0;

  // Assignments belonging to this teacher's courses
  const myAssignments = useMemo(
    () =>
      (allAssignments ?? []).filter((a) => myCourseIds.has(a.courseId)),
    [allAssignments, myCourseIds]
  );

  // Assignments needing grading: status === 'published' with submissions that
  // have no grade, or assignments with status 'published' past due date
  const assignmentsToGrade = useMemo(() => {
    return myAssignments.filter((a) => {
      if (a.status !== "graded" && a.status !== "draft") {
        // Check if there are any submissions without a grade
        if (a.submissions && a.submissions.length > 0) {
          return a.submissions.some((s) => s.grade === undefined);
        }
        return false;
      }
      return false;
    }).length;
  }, [myAssignments]);

  // Grading queue: individual submissions needing grading
  const gradingQueue = useMemo(() => {
    const queue: {
      assignmentId: string;
      assignmentTitle: string;
      courseId: string;
      courseName: string;
      studentId: string;
      studentName: string;
      submittedAt: string;
    }[] = [];

    for (const assignment of myAssignments) {
      if (!assignment.submissions) continue;
      const course = getCourseById(assignment.courseId);

      for (const sub of assignment.submissions) {
        if (sub.grade === undefined) {
          const student = getUserById(sub.studentId);
          queue.push({
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            courseId: assignment.courseId,
            courseName: course?.name ?? "Unknown Course",
            studentId: sub.studentId,
            studentName: student?.name ?? "Unknown Student",
            submittedAt: sub.submittedAt,
          });
        }
      }
    }

    return queue
      .sort(
        (a, b) =>
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      )
      .slice(0, 5);
  }, [myAssignments]);

  // Average class performance across all teacher's courses
  const avgClassPerformance = useMemo(() => {
    if (!courses || courses.length === 0) return 0;

    let totalPercent = 0;
    let gradeCount = 0;

    for (const course of courses) {
      const courseAssignments = myAssignments.filter(
        (a) => a.courseId === course.id
      );
      for (const assignment of courseAssignments) {
        if (assignment.submissions) {
          for (const sub of assignment.submissions) {
            if (sub.grade !== undefined) {
              totalPercent += calculatePercentage(sub.grade, assignment.points);
              gradeCount++;
            }
          }
        }
      }
    }

    return gradeCount > 0 ? Math.round(totalPercent / gradeCount) : 0;
  }, [courses, myAssignments]);

  // Today's classes
  const todayClasses = useMemo(() => {
    const today = getTodayName();
    if (!courses) return [];
    return courses
      .flatMap((course) =>
        course.schedule
          .filter((slot) => slot.day === today)
          .map((slot) => ({
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            color: course.color,
            startTime: slot.startTime,
            endTime: slot.endTime,
            room: slot.room,
            studentCount: course.students.length,
          }))
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [courses]);

  // Latest 3 announcements
  const recentAnnouncements = useMemo(() => {
    if (!announcements) return [];
    return [...announcements]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }, [announcements]);

  // First name for greeting
  const firstName = user?.name.split(" ").pop() ?? "Teacher";
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
          title={`Welcome back, ${firstName}`}
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
        title={`Welcome back, ${firstName}`}
        description={todayFormatted}
      />

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Across all classes"
          icon={<Users className="size-4" />}
        />
        <StatCard
          title="Active Classes"
          value={activeClasses}
          description="Currently teaching"
          icon={<BookOpen className="size-4" />}
        />
        <StatCard
          title="Assignments to Grade"
          value={assignmentsToGrade}
          description="Pending grading"
          icon={<ClipboardCheck className="size-4" />}
        />
        <StatCard
          title="Avg Class Performance"
          value={`${avgClassPerformance}%`}
          description="Across all courses"
          icon={<TrendingUp className="size-4" />}
        />
      </div>

      {/* Two column layout: Today's Classes + Grading Queue */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No classes scheduled for today.
              </p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div
                    key={`${cls.courseId}-${i}`}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className="h-10 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: cls.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {cls.courseName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {cls.courseCode}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                        <Clock className="size-3" />
                        {cls.startTime} - {cls.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {cls.room}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3" />
                        {cls.studentCount} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grading Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Grading Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {gradingQueue.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                All caught up! No assignments need grading.
              </p>
            ) : (
              <div className="space-y-3">
                {gradingQueue.map((item, i) => (
                  <div
                    key={`${item.assignmentId}-${item.studentId}`}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.studentName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.assignmentTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.courseName} &middot;{" "}
                        {formatDate(item.submittedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="size-4" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No recent announcements.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentAnnouncements.map((announcement) => {
                const author = getUserById(announcement.authorId);
                return (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    authorName={author?.name}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
