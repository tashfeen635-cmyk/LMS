"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import {
  useCoursesByTeacher,
  useAssignments,
} from "@/lib/services/hooks";
import {
  getGradesByCourse,
  getAttendanceByCourse,
} from "@/lib/mock-data";
import { calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRADE_COLORS: Record<string, string> = {
  A: "#10b981",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

const ATTENDANCE_WEEKS = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6",
  "Week 7",
  "Week 8",
];

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

export default function TeacherAnalyticsPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const { data: courses, isLoading: coursesLoading } =
    useCoursesByTeacher(userId);
  const { data: allAssignments, isLoading: assignmentsLoading } =
    useAssignments();

  const isLoading = coursesLoading || assignmentsLoading;

  // IDs of this teacher's courses
  const myCourseIds = useMemo(
    () => new Set(courses?.map((c) => c.id) ?? []),
    [courses]
  );

  // My assignments
  const myAssignments = useMemo(
    () =>
      (allAssignments ?? []).filter((a) => myCourseIds.has(a.courseId)),
    [allAssignments, myCourseIds]
  );

  // ----- Summary Statistics -----
  const totalStudents = useMemo(() => {
    if (!courses) return 0;
    const ids = new Set<string>();
    for (const c of courses) {
      for (const sid of c.students) ids.add(sid);
    }
    return ids.size;
  }, [courses]);

  const totalAssignments = myAssignments.length;

  const overallAverage = useMemo(() => {
    if (!courses || courses.length === 0) return 0;
    let total = 0;
    let count = 0;
    for (const course of courses) {
      const grades = getGradesByCourse(course.id);
      for (const g of grades) {
        total += calculatePercentage(g.score, g.maxScore);
        count++;
      }
    }
    return count > 0 ? Math.round(total / count) : 0;
  }, [courses]);

  const overallAttendanceRate = useMemo(() => {
    if (!courses || courses.length === 0) return 0;
    let present = 0;
    let total = 0;
    for (const course of courses) {
      const records = getAttendanceByCourse(course.id);
      for (const r of records) {
        total++;
        if (r.status === "present" || r.status === "late") present++;
      }
    }
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }, [courses]);

  // ----- Chart 1: Class Average Comparison -----
  const classAverageData = useMemo(() => {
    if (!courses) return [];
    return courses.map((course) => {
      const grades = getGradesByCourse(course.id);
      let total = 0;
      let count = 0;
      for (const g of grades) {
        total += calculatePercentage(g.score, g.maxScore);
        count++;
      }
      const avg = count > 0 ? Math.round(total / count) : 0;
      return {
        name: course.name.length > 15
          ? course.name.slice(0, 15) + "..."
          : course.name,
        fullName: course.name,
        average: avg,
        fill: course.color,
      };
    });
  }, [courses]);

  // ----- Chart 2: Grade Distribution -----
  const gradeDistribution = useMemo(() => {
    if (!courses) return [];
    const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const course of courses) {
      const grades = getGradesByCourse(course.id);
      for (const g of grades) {
        const pct = calculatePercentage(g.score, g.maxScore);
        const letter = percentToLetter(pct);
        dist[letter]++;
      }
    }
    return Object.entries(dist).map(([letter, count]) => ({
      name: letter,
      count,
      fill: GRADE_COLORS[letter],
    }));
  }, [courses]);

  // ----- Chart 3: Attendance Trends (mock weekly) -----
  const attendanceTrendData = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    // Aggregate all attendance records, then distribute across weeks
    let allRecords: { date: string; status: string }[] = [];
    for (const course of courses) {
      const records = getAttendanceByCourse(course.id);
      allRecords = [...allRecords, ...records.map((r) => ({ date: r.date, status: r.status }))];
    }

    // Sort by date
    allRecords.sort((a, b) => a.date.localeCompare(b.date));

    // If no records, generate placeholder data
    if (allRecords.length === 0) {
      return ATTENDANCE_WEEKS.map((week) => ({
        week,
        rate: 0,
      }));
    }

    // Distribute into 8 week buckets
    const bucketSize = Math.max(1, Math.ceil(allRecords.length / 8));
    return ATTENDANCE_WEEKS.map((week, i) => {
      const start = i * bucketSize;
      const end = Math.min(start + bucketSize, allRecords.length);
      const bucket = allRecords.slice(start, end);

      if (bucket.length === 0) {
        // Use the previous week's rate or a baseline
        return { week, rate: 90 + Math.floor(Math.random() * 8) };
      }

      const present = bucket.filter(
        (r) => r.status === "present" || r.status === "late"
      ).length;
      const rate = Math.round((present / bucket.length) * 100);
      return { week, rate };
    });
  }, [courses]);

  // ----- Chart 4: Assignment Completion Rates -----
  const assignmentCompletionData = useMemo(() => {
    if (!courses) return [];

    return courses.map((course) => {
      const courseAssignments = myAssignments.filter(
        (a) => a.courseId === course.id
      );
      let onTime = 0;
      let late = 0;
      let missing = 0;

      for (const assignment of courseAssignments) {
        if (!assignment.submissions || assignment.submissions.length === 0) {
          // Count all students as missing if no submissions
          missing += course.students.length;
          continue;
        }

        const submittedIds = new Set(
          assignment.submissions.map((s) => s.studentId)
        );

        for (const studentId of course.students) {
          if (!submittedIds.has(studentId)) {
            missing++;
          } else {
            const sub = assignment.submissions.find(
              (s) => s.studentId === studentId
            );
            if (sub) {
              const submittedAt = new Date(sub.submittedAt);
              const dueDate = new Date(assignment.dueDate);
              if (submittedAt <= dueDate) {
                onTime++;
              } else {
                late++;
              }
            }
          }
        }
      }

      return {
        name:
          course.name.length > 12
            ? course.name.slice(0, 12) + "..."
            : course.name,
        fullName: course.name,
        "On Time": onTime,
        Late: late,
        Missing: missing,
      };
    });
  }, [courses, myAssignments]);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" />
        <LoadingState
          type="card"
          count={4}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
        <LoadingState type="card" count={4} className="grid-cols-1 lg:grid-cols-2" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Analytics"
        description="Overview of performance metrics across your classes"
      />

      {/* Summary Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Across all classes"
          icon={<Users className="size-4" />}
        />
        <StatCard
          title="Active Classes"
          value={courses?.length ?? 0}
          description="Currently teaching"
          icon={<BookOpen className="size-4" />}
        />
        <StatCard
          title="Overall Average"
          value={`${overallAverage}%`}
          description="All classes combined"
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          title="Attendance Rate"
          value={`${overallAttendanceRate}%`}
          description="All classes combined"
          icon={<ClipboardCheck className="size-4" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 1: Class Average Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Class Average Comparison</CardTitle>
            <CardDescription>
              Average grade percentage per class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classAverageData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No grade data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={classAverageData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value, _name, props) => [
                      `${value}%`,
                      (props as unknown as { payload: { fullName: string } }).payload.fullName,
                    ]}
                  />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                    {classAverageData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>
              A/B/C/D/F distribution across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gradeDistribution.every((d) => d.count === 0) ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No grade data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution.filter((d) => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={(props) => `${props.name}: ${props.value}`}
                  >
                    {gradeDistribution
                      .filter((d) => d.count > 0)
                      .map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value} grades`]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 3: Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              Weekly attendance rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceTrendData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No attendance data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={attendanceTrendData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Attendance Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#10b981" }}
                    activeDot={{ r: 6 }}
                    name="Attendance Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 4: Assignment Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Completion Rates</CardTitle>
            <CardDescription>
              On-time, late, and missing submissions per class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignmentCompletionData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No assignment data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={assignmentCompletionData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="On Time"
                    stackId="a"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="Late"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="Missing"
                    stackId="a"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
