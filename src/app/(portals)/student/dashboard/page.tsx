"use client";

import { useMemo } from "react";
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  CalendarCheck,
  Clock,
  MapPin,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByStudent,
  useAssignments,
  useGradesByStudent,
  useAttendanceByStudent,
} from "@/lib/services/hooks";
import { getUserById, getCourseById, getAssignmentById } from "@/lib/mock-data";
import {
  formatDate,
  calculatePercentage,
  isOverdue,
} from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import AssignmentCard from "@/components/academic/assignment-card";
import GradeBadge from "@/components/academic/grade-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTodayName(): string {
  return DAYS[new Date().getDay()];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } = useCoursesByStudent(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: grades, isLoading: gradesLoading } = useGradesByStudent(userId);
  const { data: attendance, isLoading: attendanceLoading } = useAttendanceByStudent(userId);

  const isLoading = coursesLoading || assignmentsLoading || gradesLoading || attendanceLoading;

  // Enrolled course IDs for this student
  const enrolledCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // Only assignments belonging to the student's courses
  const myAssignments = useMemo(
    () =>
      (allAssignments ?? []).filter(
        (a) => enrolledCourseIds.has(a.courseId) && a.status !== "draft"
      ),
    [allAssignments, enrolledCourseIds]
  );

  // Pending = published and not yet graded (student hasn't received a grade)
  const pendingAssignments = useMemo(() => {
    if (!grades) return myAssignments.filter((a) => a.status === "published");
    const gradedAssignmentIds = new Set(grades.map((g) => g.assignmentId));
    return myAssignments.filter(
      (a) => a.status === "published" || (a.status === "graded" && !gradedAssignmentIds.has(a.id))
    );
  }, [myAssignments, grades]);

  // Average grade percentage
  const averageGrade = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    const total = grades.reduce(
      (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
      0
    );
    return Math.round(total / grades.length);
  }, [grades]);

  // Attendance rate (present + late / total)
  const attendanceRate = useMemo(() => {
    if (!attendance || attendance.length === 0) return 0;
    const countedPresent = attendance.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;
    return Math.round((countedPresent / attendance.length) * 100);
  }, [attendance]);

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
          }))
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [courses]);

  // Upcoming assignments (next 5 not overdue, sorted by due date)
  const upcomingAssignments = useMemo(() => {
    return myAssignments
      .filter((a) => a.status === "published" && !isOverdue(a.dueDate))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [myAssignments]);

  // Recent grades (last 5 by date descending)
  const recentGrades = useMemo(() => {
    if (!grades) return [];
    return [...grades]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [grades]);

  // First name for greeting
  const firstName = user?.name.split(" ")[0] ?? "Student";
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
          title={`Hey ${firstName}! Ready to learn?`}
          description={todayFormatted}
        />
        <LoadingState type="card" count={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        <LoadingState type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`Hey ${firstName}! Ready to learn?`}
        description={todayFormatted}
      />

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Subjects"
          value={courses?.length ?? 0}
          description="Active courses"
          icon={<BookOpen className="size-5" />}
        />
        <StatCard
          title="Homework To Do"
          value={pendingAssignments.length}
          description="Need your attention"
          icon={<ClipboardList className="size-5" />}
        />
        <StatCard
          title="My Score"
          value={`${averageGrade}%`}
          description={`From ${grades?.length ?? 0} graded items`}
          icon={<TrendingUp className="size-5" />}
        />
        <StatCard
          title="Days Present"
          value={`${attendanceRate}%`}
          description={`${attendance?.length ?? 0} records`}
          icon={<CalendarCheck className="size-5" />}
        />
      </div>

      {/* Two column layout for Today's Classes + Upcoming Assignments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>My Classes Today</CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <p className="text-base text-muted-foreground py-4 text-center">
                No classes today — enjoy your free time!
              </p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div
                    key={`${cls.courseId}-${i}`}
                    className="flex items-center gap-3 rounded-lg border p-4"
                  >
                    <div
                      className="h-10 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: cls.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium">
                        {cls.courseName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {cls.courseCode}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        <Clock className="size-3.5" />
                        {cls.startTime} - {cls.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {cls.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Homework Coming Up</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 ? (
              <p className="text-base text-muted-foreground py-4 text-center">
                All done! No homework right now.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const course = getCourseById(assignment.courseId);
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      courseName={course?.name}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGrades.length === 0 ? (
            <p className="text-base text-muted-foreground py-4 text-center">
              No scores yet — keep learning!
            </p>
          ) : (
            <div className="space-y-3">
              {recentGrades.map((grade) => {
                const course = getCourseById(grade.courseId);
                const assignment = getAssignmentById(grade.assignmentId);
                return (
                  <div
                    key={grade.id}
                    className="flex items-center gap-3 rounded-lg border p-4"
                  >
                    <div
                      className="h-10 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: course?.color ?? "#6b7280" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium">
                        {assignment?.title ?? "Assignment"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course?.name ?? "Course"} &middot; {formatDate(grade.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-base font-semibold tabular-nums">
                        {grade.score}/{grade.maxScore}
                      </span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {calculatePercentage(grade.score, grade.maxScore)}%
                      </span>
                      <GradeBadge grade={grade.letterGrade} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
