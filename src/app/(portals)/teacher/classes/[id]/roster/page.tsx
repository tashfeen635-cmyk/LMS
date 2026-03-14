"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCourse,
  useGradesByCourse,
  useAttendanceByCourse,
} from "@/lib/services/hooks";
import { getUserById } from "@/lib/mock-data";
import { calculatePercentage, getInitials } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import GradeBadge from "@/components/academic/grade-badge";
import AttendanceToggle from "@/components/academic/attendance-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import type { AttendanceStatus } from "@/types";

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

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherClassRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const { user } = useAuthStore();

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByCourse(courseId);
  const { data: attendance, isLoading: attendanceLoading } =
    useAttendanceByCourse(courseId);

  const isLoading = courseLoading || gradesLoading || attendanceLoading;

  const [search, setSearch] = useState("");

  // Local state for today's attendance overrides
  const [todayAttendance, setTodayAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const todayISO = getTodayISO();

  // Build student data with grades and attendance
  const studentRows = useMemo(() => {
    if (!course) return [];

    return course.students.map((studentId) => {
      const student = getUserById(studentId);

      // Calculate current average grade for this student in this course
      const studentGrades = (grades ?? []).filter(
        (g) => g.studentId === studentId
      );
      const avgPercent =
        studentGrades.length > 0
          ? Math.round(
              studentGrades.reduce(
                (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
                0
              ) / studentGrades.length
            )
          : null;

      // Calculate attendance rate for this student in this course
      const studentAttendance = (attendance ?? []).filter(
        (a) => a.studentId === studentId
      );
      const attendanceRate =
        studentAttendance.length > 0
          ? Math.round(
              (studentAttendance.filter(
                (a) => a.status === "present" || a.status === "late"
              ).length /
                studentAttendance.length) *
                100
            )
          : null;

      // Today's attendance status (from local state, or from data, or default)
      const todayRecord = studentAttendance.find(
        (a) => a.date === todayISO
      );
      const currentStatus: AttendanceStatus =
        todayAttendance[studentId] ??
        todayRecord?.status ??
        "present";

      return {
        studentId,
        name: student?.name ?? "Unknown Student",
        email: student?.email ?? "",
        avatar: student?.avatar ?? "",
        avgPercent,
        letterGrade: avgPercent !== null ? percentToLetter(avgPercent) : "-",
        attendanceRate,
        todayStatus: currentStatus,
      };
    });
  }, [course, grades, attendance, todayAttendance, todayISO]);

  // Filtered by search
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return studentRows;
    return studentRows.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [studentRows, search]);

  // Summary stats for today's attendance
  const attendanceSummary = useMemo(() => {
    const total = studentRows.length;
    const present = studentRows.filter(
      (s) => s.todayStatus === "present" || s.todayStatus === "late"
    ).length;
    const absent = studentRows.filter(
      (s) => s.todayStatus === "absent"
    ).length;
    return { total, present, absent };
  }, [studentRows]);

  // Handler for toggling attendance
  function handleAttendanceChange(
    studentId: string,
    status: AttendanceStatus
  ) {
    setTodayAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  }

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState
          type="card"
          count={3}
          className="grid-cols-1 sm:grid-cols-3"
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
        <Link href={`/teacher/classes/${courseId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to {course.name}
          </Button>
        </Link>

        <PageHeader
          title={`${course.name} - Student Roster`}
          description={`${course.code} | Manage students and track attendance`}
        />
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Total Students"
          value={attendanceSummary.total}
          description="Enrolled in this class"
          icon={<Users className="size-4" />}
        />
        <StatCard
          title="Present Today"
          value={attendanceSummary.present}
          description="Marked present or late"
          icon={<UserCheck className="size-4" />}
        />
        <StatCard
          title="Absent Today"
          value={attendanceSummary.absent}
          description="Marked absent"
          icon={<UserX className="size-4" />}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Student roster table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title={search ? "No matching students" : "No students enrolled"}
          description={
            search
              ? "Try a different search term."
              : "There are no students enrolled in this class."
          }
        />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Current Avg</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-center">
                    Today&apos;s Attendance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((row) => (
                  <TableRow key={row.studentId}>
                    {/* Avatar + Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="default">
                          <AvatarImage
                            src={row.avatar}
                            alt={row.name}
                          />
                          <AvatarFallback>
                            {getInitials(row.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{row.name}</span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-muted-foreground">
                      {row.email}
                    </TableCell>

                    {/* Grade */}
                    <TableCell className="text-right">
                      {row.avgPercent !== null ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="tabular-nums">
                            {row.avgPercent}%
                          </span>
                          <GradeBadge grade={row.letterGrade} />
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Attendance rate */}
                    <TableCell className="text-right">
                      {row.attendanceRate !== null ? (
                        <span className="tabular-nums">
                          {row.attendanceRate}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Today's attendance toggle */}
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <AttendanceToggle
                          status={row.todayStatus}
                          onChange={(status) =>
                            handleAttendanceChange(row.studentId, status)
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
