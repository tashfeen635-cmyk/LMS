"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  CalendarCheck,
  Clock,
  MapPin,
  FileText,
  ClipboardList,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCourse,
  useAssignmentsByCourse,
  useGradesByCourse,
  useAttendanceByCourse,
} from "@/lib/services/hooks";
import { getUserById, getAssignmentsByCourse as getAssignmentsByCourseSync } from "@/lib/mock-data";
import { formatDate, calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import AssignmentCard from "@/components/academic/assignment-card";
import GradeBadge from "@/components/academic/grade-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const { user } = useAuthStore();

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: assignments, isLoading: assignmentsLoading } =
    useAssignmentsByCourse(courseId);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByCourse(courseId);
  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByCourse(courseId);

  const isLoading =
    courseLoading || assignmentsLoading || gradesLoading || attendanceLoading;

  // Student count
  const studentCount = course?.students.length ?? 0;

  // Average grade across all students
  const avgGrade = useMemo(() => {
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

  // Per-student grade summary for the gradebook tab
  const studentGradeSummaries = useMemo(() => {
    if (!course || !grades) return [];

    return course.students.map((studentId) => {
      const student = getUserById(studentId);
      const studentGrades = grades.filter((g) => g.studentId === studentId);
      const avg =
        studentGrades.length > 0
          ? Math.round(
              studentGrades.reduce(
                (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
                0
              ) / studentGrades.length
            )
          : null;

      return {
        studentId,
        studentName: student?.name ?? "Unknown",
        studentEmail: student?.email ?? "",
        gradeCount: studentGrades.length,
        averagePercent: avg,
        letterGrade: avg !== null ? percentToLetter(avg) : "-",
      };
    });
  }, [course, grades]);

  // Assignments sorted by due date
  const sortedAssignments = useMemo(
    () =>
      [...(assignments ?? [])].sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      ),
    [assignments]
  );

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState
          type="card"
          count={1}
          className="grid-cols-1"
        />
        <LoadingState type="table" count={5} />
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Class not found"
        description="The class you are looking for does not exist."
        action={{
          label: "Back to Classes",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="space-y-4">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Classes
          </Button>
        </Link>

        <div className="flex items-start gap-4">
          <div
            className="mt-1 h-12 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: course.color }}
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {course.name}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {course.code}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roster">
            Roster
            <Badge variant="secondary" className="ml-1.5">
              {studentCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments
            {sortedAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {sortedAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ------ Overview Tab ------ */}
        <TabsContent value="overview">
          <div className="space-y-6 pt-4">
            {/* Stat cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <StatCard
                title="Students"
                value={studentCount}
                description="Enrolled in this class"
                icon={<Users className="size-4" />}
              />
              <StatCard
                title="Average Grade"
                value={grades && grades.length > 0 ? `${avgGrade}%` : "N/A"}
                description={`${grades?.length ?? 0} graded items`}
                icon={<TrendingUp className="size-4" />}
              />
              <StatCard
                title="Attendance Rate"
                value={
                  attendance && attendance.length > 0
                    ? `${attendanceRate}%`
                    : "N/A"
                }
                description={`${attendance?.length ?? 0} records`}
                icon={<CalendarCheck className="size-4" />}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.schedule.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No schedule available.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Room</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.schedule.map((slot, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {slot.day}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="size-3.5 text-muted-foreground" />
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-muted-foreground" />
                                {slot.room}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/teacher/classes/${courseId}/roster`}>
                    <Button variant="outline" className="gap-2">
                      <Users className="size-4" />
                      View Full Roster
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------ Roster Tab ------ */}
        <TabsContent value="roster">
          <div className="pt-4">
            {studentCount === 0 ? (
              <EmptyState
                title="No students enrolled"
                description="There are no students enrolled in this class yet."
              />
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Student Roster</CardTitle>
                  <Link href={`/teacher/classes/${courseId}/roster`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Users className="size-3.5" />
                      Full Roster Page
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">
                          Graded Items
                        </TableHead>
                        <TableHead className="text-right">Average</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentGradeSummaries.map((row) => (
                        <TableRow key={row.studentId}>
                          <TableCell className="font-medium">
                            {row.studentName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {row.studentEmail}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            {row.gradeCount}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.averagePercent !== null ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="tabular-nums">
                                  {row.averagePercent}%
                                </span>
                                <GradeBadge grade={row.letterGrade} />
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ------ Gradebook Tab ------ */}
        <TabsContent value="gradebook">
          <div className="pt-4">
            {!grades || grades.length === 0 ? (
              <EmptyState
                title="No grades recorded"
                description="Grades for this class will appear here once assignments are graded."
              />
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">
                          Percentage
                        </TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...grades]
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((grade) => {
                          const student = getUserById(grade.studentId);
                          const assignment = assignments?.find(
                            (a) => a.id === grade.assignmentId
                          );
                          const pct = calculatePercentage(
                            grade.score,
                            grade.maxScore
                          );

                          return (
                            <TableRow key={grade.id}>
                              <TableCell className="font-medium">
                                {student?.name ?? grade.studentId}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {assignment?.title ?? grade.assignmentId}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {grade.score}/{grade.maxScore}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {pct}%
                              </TableCell>
                              <TableCell className="text-center">
                                <GradeBadge grade={grade.letterGrade} />
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(grade.date)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>

                  {/* Summary */}
                  <div className="mt-4 flex items-center justify-end gap-3 border-t pt-3">
                    <span className="text-sm text-muted-foreground">
                      Class Average:
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {avgGrade}%
                    </span>
                    <GradeBadge grade={percentToLetter(avgGrade)} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ------ Assignments Tab ------ */}
        <TabsContent value="assignments">
          <div className="pt-4">
            {sortedAssignments.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="size-6" />}
                title="No assignments yet"
                description="Create assignments for this class to get started."
              />
            ) : (
              <div className="space-y-4">
                {/* Status filter badges */}
                <div className="flex flex-wrap gap-2">
                  {["published", "graded", "draft"].map((status) => {
                    const count = sortedAssignments.filter(
                      (a) => a.status === status
                    ).length;
                    if (count === 0) return null;
                    return (
                      <Badge
                        key={status}
                        variant={
                          status === "published"
                            ? "default"
                            : status === "graded"
                              ? "secondary"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {status}: {count}
                      </Badge>
                    );
                  })}
                </div>

                {/* Assignment cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      courseName={course.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
