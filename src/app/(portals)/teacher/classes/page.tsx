"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import { useCoursesByTeacher, useAssignments } from "@/lib/services/hooks";
import { calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherClassesPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } =
    useCoursesByTeacher(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } =
    useAssignments();

  const isLoading = coursesLoading || assignmentsLoading;

  const [search, setSearch] = useState("");

  // Calculate average grade per course from submissions
  const courseStats = useMemo(() => {
    if (!courses || !allAssignments)
      return new Map<
        string,
        { avgGrade: number; gradeCount: number }
      >();

    const map = new Map<
      string,
      { avgGrade: number; gradeCount: number }
    >();

    for (const course of courses) {
      const courseAssignments = allAssignments.filter(
        (a) => a.courseId === course.id
      );
      let totalPercent = 0;
      let gradeCount = 0;

      for (const assignment of courseAssignments) {
        if (assignment.submissions) {
          for (const sub of assignment.submissions) {
            if (sub.grade !== undefined) {
              totalPercent += calculatePercentage(
                sub.grade,
                assignment.points
              );
              gradeCount++;
            }
          }
        }
      }

      map.set(course.id, {
        avgGrade: gradeCount > 0 ? Math.round(totalPercent / gradeCount) : 0,
        gradeCount,
      });
    }

    return map;
  }, [courses, allAssignments]);

  // Filtered courses by search
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  // Format schedule summary
  function getScheduleSummary(
    schedule: { day: string; startTime: string; endTime: string; room: string }[]
  ): string {
    if (schedule.length === 0) return "No schedule";
    const days = schedule.map((s) => s.day.slice(0, 3));
    const time = `${schedule[0].startTime} - ${schedule[0].endTime}`;
    return `${days.join(", ")} ${time}`;
  }

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Classes"
          description="Manage your courses and class rosters"
        />
        <LoadingState type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Classes"
        description="Manage your courses and class rosters"
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Class grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" />}
          title={search ? "No matching classes" : "No classes assigned"}
          description={
            search
              ? "Try a different search term."
              : "You do not have any classes assigned yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const stats = courseStats.get(course.id);
            const avgGrade = stats?.avgGrade ?? 0;
            const scheduleSummary = getScheduleSummary(course.schedule);

            return (
              <Link
                key={course.id}
                href={`/teacher/classes/${course.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                <Card className="relative overflow-hidden pt-0 transition-shadow hover:shadow-md">
                  {/* Colored accent strip */}
                  <div
                    className="h-1.5 w-full shrink-0"
                    style={{ backgroundColor: course.color }}
                    aria-hidden="true"
                  />

                  <CardHeader className="pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate">
                          {course.name}
                        </CardTitle>
                        <CardDescription className="mt-0.5 font-mono text-xs">
                          {course.code}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Student count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="size-3.5 shrink-0" />
                      <span>
                        {course.students.length} student
                        {course.students.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 shrink-0" />
                      <span className="truncate">{scheduleSummary}</span>
                    </div>

                    {/* Average grade bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="size-3" />
                          Avg Grade
                        </span>
                        <span className="font-medium tabular-nums">
                          {stats?.gradeCount
                            ? `${avgGrade}%`
                            : "N/A"}
                        </span>
                      </div>
                      {stats?.gradeCount ? (
                        <Progress value={avgGrade} />
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
