"use client";

import { useMemo } from "react";
import { use } from "react";
import { ArrowLeft, User, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/stores/auth-store";
import {
  useCourse,
  useAssignmentsByCourse,
  useGradesByStudentAndCourse,
} from "@/lib/services/hooks";
import { getUserById } from "@/lib/mock-data";
import { formatDate, calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import AssignmentCard from "@/components/academic/assignment-card";
import GradeBadge from "@/components/academic/grade-badge";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: assignments, isLoading: assignmentsLoading } = useAssignmentsByCourse(courseId);
  const { data: grades, isLoading: gradesLoading } = useGradesByStudentAndCourse(userId, courseId);

  const isLoading = courseLoading || assignmentsLoading || gradesLoading;

  // Teacher info
  const teacher = course ? getUserById(course.teacherId) : undefined;

  // Published assignments only (visible to students)
  const visibleAssignments = useMemo(
    () =>
      (assignments ?? [])
        .filter((a) => a.status !== "draft")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [assignments]
  );

  // Sorted grades by date descending
  const sortedGrades = useMemo(
    () =>
      [...(grades ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [grades]
  );

  // Average grade percentage
  const averagePercent = useMemo(() => {
    if (!grades || grades.length === 0) return null;
    const total = grades.reduce(
      (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
      0
    );
    return Math.round(total / grades.length);
  }, [grades]);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState type="card" count={1} className="grid-cols-1" />
        <LoadingState type="table" count={4} />
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="The course you are looking for does not exist."
        action={{
          label: "Back to Courses",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="space-y-4">
        <Link href="/student/courses">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Courses
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
          <TabsTrigger value="assignments">
            Assignments
            {visibleAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {visibleAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="grades">
            Grades
            {sortedGrades.length > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {sortedGrades.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ------ Overview Tab ------ */}
        <TabsContent value="overview">
          <div className="grid gap-6 pt-4 lg:grid-cols-3">
            {/* Description */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>

                {averagePercent !== null && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Your average:
                    </span>
                    <span className="text-sm font-semibold">{averagePercent}%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teacher info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                {teacher ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {teacher.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                    {teacher.department && (
                      <p className="text-xs text-muted-foreground">
                        Department: {teacher.department}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Instructor information unavailable.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="lg:col-span-3">
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
        </TabsContent>

        {/* ------ Assignments Tab ------ */}
        <TabsContent value="assignments">
          <div className="pt-4">
            {visibleAssignments.length === 0 ? (
              <EmptyState
                title="No assignments yet"
                description="Assignments for this course will appear here once published."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    courseName={course.name}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ------ Grades Tab ------ */}
        <TabsContent value="grades">
          <div className="pt-4">
            {sortedGrades.length === 0 ? (
              <EmptyState
                title="No grades yet"
                description="Your grades for this course will appear here once assignments are graded."
              />
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedGrades.map((grade) => {
                        const pct = calculatePercentage(grade.score, grade.maxScore);
                        // Try to find the assignment title
                        const matchedAssignment = visibleAssignments.find(
                          (a) => a.id === grade.assignmentId
                        );
                        return (
                          <TableRow key={grade.id}>
                            <TableCell className="text-muted-foreground">
                              {formatDate(grade.date)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {matchedAssignment?.title ?? grade.assignmentId}
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
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Summary row */}
                  {averagePercent !== null && (
                    <div className="mt-4 flex items-center justify-end gap-3 border-t pt-3">
                      <span className="text-sm text-muted-foreground">
                        Course Average:
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        {averagePercent}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
