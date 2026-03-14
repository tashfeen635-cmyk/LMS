"use client";

import { useMemo, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByStudent,
  useAssignments,
  useGradesByStudent,
} from "@/lib/services/hooks";
import { getCourseById } from "@/lib/mock-data";
import { isOverdue } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import AssignmentCard from "@/components/academic/assignment-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

type FilterTab = "all" | "pending" | "submitted" | "graded";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentAssignmentsPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } = useCoursesByStudent(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: grades, isLoading: gradesLoading } = useGradesByStudent(userId);

  const isLoading = coursesLoading || assignmentsLoading || gradesLoading;

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Set of enrolled course IDs
  const enrolledCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // All assignments relevant to this student (non-draft, from enrolled courses)
  const myAssignments = useMemo(
    () =>
      (allAssignments ?? [])
        .filter((a) => enrolledCourseIds.has(a.courseId) && a.status !== "draft")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [allAssignments, enrolledCourseIds]
  );

  // Assignment IDs where the student has a grade already
  const gradedAssignmentIds = useMemo(
    () => new Set((grades ?? []).map((g) => g.assignmentId)),
    [grades]
  );

  // Assignment IDs where the student has submitted (check submissions array)
  const submittedAssignmentIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of myAssignments) {
      if (a.submissions?.some((s) => s.studentId === userId)) {
        ids.add(a.id);
      }
    }
    return ids;
  }, [myAssignments, userId]);

  // Categorise each assignment
  const categorised = useMemo(() => {
    return myAssignments.map((a) => {
      let category: FilterTab;
      if (gradedAssignmentIds.has(a.id)) {
        category = "graded";
      } else if (submittedAssignmentIds.has(a.id)) {
        category = "submitted";
      } else {
        category = "pending";
      }
      return { assignment: a, category };
    });
  }, [myAssignments, gradedAssignmentIds, submittedAssignmentIds]);

  // Counts per tab
  const counts = useMemo(() => {
    const c = { all: 0, pending: 0, submitted: 0, graded: 0 };
    for (const item of categorised) {
      c.all++;
      c[item.category]++;
    }
    return c;
  }, [categorised]);

  // Apply filter tab + search
  const filteredAssignments = useMemo(() => {
    let items = categorised;

    // Tab filter
    if (activeTab !== "all") {
      items = items.filter((item) => item.category === activeTab);
    }

    // Search filter
    const q = search.toLowerCase().trim();
    if (q) {
      items = items.filter((item) => {
        const course = getCourseById(item.assignment.courseId);
        return (
          item.assignment.title.toLowerCase().includes(q) ||
          (course?.name.toLowerCase().includes(q) ?? false)
        );
      });
    }

    return items;
  }, [categorised, activeTab, search]);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Assignments" description="View and manage all your assignments" />
        <LoadingState type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Assignments" description="View and manage all your assignments" />

      {/* Filter Tabs + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          defaultValue="all"
          onValueChange={(val) => setActiveTab(val as FilterTab)}
        >
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1.5">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-1.5">
                {counts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted
              <Badge variant="secondary" className="ml-1.5">
                {counts.submitted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="graded">
              Graded
              <Badge variant="secondary" className="ml-1.5">
                {counts.graded}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative max-w-sm w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Assignment list */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title={search ? "No matching assignments" : "No assignments found"}
          description={
            search
              ? "Try a different search term or filter."
              : "Assignments from your courses will appear here."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map(({ assignment }) => {
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
    </div>
  );
}
