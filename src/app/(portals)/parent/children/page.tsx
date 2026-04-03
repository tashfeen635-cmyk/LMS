"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Eye,
  TrendingUp,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByStudent,
  useGradesByStudent,
  useAttendanceByStudent,
} from "@/lib/services/hooks";
import { getUserById, calculateGPA } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import ProgressRing from "@/components/shared/progress-ring";
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

// ---------------------------------------------------------------------------
// Child Card (with its own data hooks)
// ---------------------------------------------------------------------------

function ChildCard({ childId }: { childId: string }) {
  const child = getUserById(childId);

  const { data: courses, isLoading: coursesLoading } =
    useCoursesByStudent(childId);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByStudent(childId);
  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByStudent(childId);

  const isLoading = coursesLoading || gradesLoading || attendanceLoading;

  const gpa = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    return calculateGPA(grades);
  }, [grades]);

  const attendanceRate = useMemo(() => {
    if (!attendance || attendance.length === 0) return 0;
    const present = attendance.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  if (!child) return null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <LoadingState type="card" count={1} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src={child.avatar} alt={child.name} />
            <AvatarFallback className="text-lg">
              {getInitials(child.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg">{child.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{child.email}</p>
            {child.grade && (
              <Badge variant="secondary" className="mt-1">
                Grade {child.grade}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        {/* Quick stats */}
        <div className="flex items-center justify-around">
          {/* GPA */}
          <div className="flex flex-col items-center gap-1">
            <ProgressRing
              value={(gpa / 4) * 100}
              size={64}
              strokeWidth={5}
              color="#10b981"
            >
              <span className="text-sm font-bold">{gpa.toFixed(1)}</span>
            </ProgressRing>
            <span className="text-xs text-muted-foreground">GPA</span>
          </div>

          {/* Attendance */}
          <div className="flex flex-col items-center gap-1">
            <ProgressRing
              value={attendanceRate}
              size={64}
              strokeWidth={5}
              color="#3b82f6"
            >
              <span className="text-sm font-bold">{attendanceRate}%</span>
            </ProgressRing>
            <span className="text-xs text-muted-foreground">Attendance</span>
          </div>

          {/* Courses */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <span className="text-lg font-bold">{courses?.length ?? 0}</span>
            </div>
            <span className="text-xs text-muted-foreground">Courses</span>
          </div>
        </div>

        {/* Action links */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <Link href={`/parent/children/${childId}`}>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Eye className="size-3.5" />
              Overview
            </Button>
          </Link>
          <Link href={`/parent/children/${childId}/grades`}>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <TrendingUp className="size-3.5" />
              Grades
            </Button>
          </Link>
          <Link href={`/parent/children/${childId}/attendance`}>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <CalendarCheck className="size-3.5" />
              Attendance
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ParentChildrenPage() {
  const { user } = useAuthStore();
  const childrenIds = user?.children ?? [];

  if (childrenIds.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Children"
          description="View and manage your children's academic profiles"
        />
        <EmptyState
          icon={<Users className="size-6" />}
          title="No children linked"
          description="No student profiles are linked to your account. Please contact the school administration."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Children"
        description={`You have ${childrenIds.length} ${childrenIds.length === 1 ? "child" : "children"} enrolled`}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {childrenIds.map((childId) => (
          <ChildCard key={childId} childId={childId} />
        ))}
      </div>
    </div>
  );
}
