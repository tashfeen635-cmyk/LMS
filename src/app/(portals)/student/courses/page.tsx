"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import { useCoursesByStudent, useGradesByStudent } from "@/lib/services/hooks";
import { getUserById } from "@/lib/mock-data";
import { calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import CourseCard from "@/components/academic/course-card";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentCoursesPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } = useCoursesByStudent(userId);
  const { data: grades, isLoading: gradesLoading } = useGradesByStudent(userId);

  const isLoading = coursesLoading || gradesLoading;

  const [search, setSearch] = useState("");

  // Calculate average progress per course from grades
  const courseProgress = useMemo(() => {
    if (!grades || !courses) return new Map<string, number>();
    const map = new Map<string, number[]>();
    for (const g of grades) {
      const pct = calculatePercentage(g.score, g.maxScore);
      const arr = map.get(g.courseId) ?? [];
      arr.push(pct);
      map.set(g.courseId, arr);
    }
    const result = new Map<string, number>();
    for (const [courseId, pcts] of map) {
      const avg = Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length);
      result.set(courseId, avg);
    }
    return result;
  }, [grades, courses]);

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

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Courses" description="View all your enrolled courses" />
        <LoadingState type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="My Courses" description="View all your enrolled courses" />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" />}
          title={search ? "No matching courses" : "No courses enrolled"}
          description={
            search
              ? "Try a different search term."
              : "You are not enrolled in any courses yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const teacher = getUserById(course.teacherId);
            const progress = courseProgress.get(course.id);
            // Determine next class day
            const nextSlot = course.schedule[0];
            const nextClass = nextSlot
              ? `${nextSlot.day} ${nextSlot.startTime}`
              : undefined;

            return (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                <CourseCard
                  course={course}
                  teacherName={teacher?.name}
                  progress={progress}
                  nextClass={nextClass}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
