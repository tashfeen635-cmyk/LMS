"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  useCoursesByStudent,
  useGradesByStudent,
} from "@/lib/services/hooks";
import {
  getUserById,
  getAssignmentById,
  calculateGPA,
} from "@/lib/mock-data";
import {
  cn,
  formatDate,
  calculatePercentage,
  getGradeColor,
  getGradeBgColor,
} from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import ProgressRing from "@/components/shared/progress-ring";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  grades: Grade[];
  averagePercent: number;
  letterGrade: string;
  trend: "up" | "down" | "stable";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChildGradesPage({
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

  const isLoading = coursesLoading || gradesLoading;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Overall GPA
  const overallGPA = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    return calculateGPA(grades);
  }, [grades]);

  // Overall average percentage
  const overallPercent = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    const total = grades.reduce(
      (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
      0
    );
    return Math.round(total / grades.length);
  }, [grades]);

  // Per-course summaries
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
          grades: courseGrades,
          averagePercent: Math.round(avgPct),
          letterGrade: percentToLetter(Math.round(avgPct)),
          trend,
        };
      })
      .filter(Boolean) as CourseGradeSummary[];
  }, [courses, grades]);

  // GPA trend by term
  const gpaTrendData = useMemo(() => {
    if (!grades || grades.length === 0) return [];

    const termMap = new Map<string, Grade[]>();
    for (const g of grades) {
      const existing = termMap.get(g.term) ?? [];
      existing.push(g);
      termMap.set(g.term, existing);
    }

    return Array.from(termMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([term, termGrades]) => ({
        term: term.replace("20", "'"),
        gpa: calculateGPA(termGrades),
      }));
  }, [grades]);

  // Detailed grades for selected course (or all)
  const detailedGrades = useMemo(() => {
    if (!grades) return [];
    const filtered = selectedCourseId
      ? grades.filter((g) => g.courseId === selectedCourseId)
      : grades;
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [grades, selectedCourseId]);

  const childName = child?.name ?? "Student";

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`${childName}'s Grades`}
          description="View academic performance"
        />
        <LoadingState
          type="card"
          count={4}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
        <LoadingState type="table" count={6} />
      </div>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <div className="space-y-6">
        <Link href={`/parent/children/${childId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to {childName}
          </Button>
        </Link>
        <PageHeader
          title={`${childName}'s Grades`}
          description="View academic performance"
        />
        <EmptyState
          icon={<GraduationCap className="size-6" />}
          title="No grades yet"
          description="Grades will appear here once assignments are graded."
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
        title={`${childName}'s Grades`}
        description="View academic performance across all courses"
      />

      {/* Top stats row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* GPA Card with ProgressRing */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 pt-6">
            <ProgressRing value={(overallGPA / 4) * 100} size={80} strokeWidth={7}>
              <span className="text-lg font-bold">{overallGPA.toFixed(2)}</span>
            </ProgressRing>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overall GPA
              </p>
              <p className="text-2xl font-bold">{overallGPA.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">out of 4.00</p>
            </div>
          </CardContent>
        </Card>

        <StatCard
          title="Average Score"
          value={`${overallPercent}%`}
          description="Across all courses"
          icon={<TrendingUp className="size-4" />}
        />

        <StatCard
          title="Total Graded"
          value={grades.length}
          description="Assignments graded"
          icon={<BookOpen className="size-4" />}
        />

        <StatCard
          title="Courses"
          value={courseSummaries.length}
          description="With grades"
          icon={<GraduationCap className="size-4" />}
        />
      </div>

      {/* Two-column: Course grades table + GPA trend chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Course grade summary table */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Summary by Course</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* GPA Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>GPA Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {gpaTrendData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={gpaTrendData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="term"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 4]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      ticks={[0, 1, 2, 3, 4]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--foreground))",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [Number(value).toFixed(2), "GPA"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{
                        r: 5,
                        fill: "hsl(var(--primary))",
                        strokeWidth: 2,
                        stroke: "hsl(var(--background))",
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Not enough data for trend chart.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed grades per course */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Detailed Grades</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCourseId === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCourseId(null)}
              >
                All Courses
              </Button>
              {courseSummaries.map((summary) => (
                <Button
                  key={summary.courseId}
                  variant={
                    selectedCourseId === summary.courseId ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCourseId(summary.courseId)}
                >
                  <div
                    className="mr-1.5 size-2.5 rounded-full"
                    style={{ backgroundColor: summary.courseColor }}
                  />
                  {summary.courseName}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedGrades.map((grade) => {
                const course = courses?.find((c) => c.id === grade.courseId);
                const assignment = getAssignmentById(grade.assignmentId);
                const pct = calculatePercentage(grade.score, grade.maxScore);

                return (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {assignment?.title ?? grade.assignmentId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: course?.color ?? "#6b7280" }}
                        />
                        <span className="text-muted-foreground">
                          {course?.name ?? "Course"}
                        </span>
                      </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
