"use client";

import { useMemo, useState } from "react";
import {
  FileBarChart,
  Download,
  FileText,
  CheckCircle2,
  TrendingUp,
  Users,
  GraduationCap,
  CalendarCheck,
} from "lucide-react";
import { useCourses, useUsers } from "@/lib/services/hooks";
import { grades } from "@/lib/mock-data/grades";
import { attendance } from "@/lib/mock-data/attendance";
import { calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------

type ReportType = "grades" | "attendance" | "enrollment" | "performance";

const REPORT_OPTIONS: { value: ReportType; label: string; icon: React.ReactNode }[] = [
  { value: "grades", label: "Grade Reports", icon: <GraduationCap className="size-4" /> },
  { value: "attendance", label: "Attendance Reports", icon: <CalendarCheck className="size-4" /> },
  { value: "enrollment", label: "Enrollment Reports", icon: <Users className="size-4" /> },
  { value: "performance", label: "Performance Reports", icon: <TrendingUp className="size-4" /> },
];

// ---------------------------------------------------------------------------
// Mock chart data generators
// ---------------------------------------------------------------------------

const GRADE_DISTRIBUTION = [
  { grade: "A", count: 18, fill: "#10b981" },
  { grade: "B", count: 12, fill: "#3b82f6" },
  { grade: "C", count: 7, fill: "#f59e0b" },
  { grade: "D", count: 3, fill: "#f97316" },
  { grade: "F", count: 2, fill: "#ef4444" },
];

const ATTENDANCE_OVER_TIME = [
  { week: "Week 1", rate: 95 },
  { week: "Week 2", rate: 92 },
  { week: "Week 3", rate: 97 },
  { week: "Week 4", rate: 88 },
  { week: "Week 5", rate: 93 },
  { week: "Week 6", rate: 90 },
  { week: "Week 7", rate: 96 },
  { week: "Week 8", rate: 91 },
];

const ENROLLMENT_BY_GRADE = [
  { name: "Grade 10", value: 4, fill: "#3b82f6" },
  { name: "Grade 11", value: 3, fill: "#8b5cf6" },
  { name: "Grade 12", value: 3, fill: "#10b981" },
];

const PERFORMANCE_BY_CLASS = [
  { course: "Algebra II", average: 82 },
  { course: "English Lit", average: 88 },
  { course: "AP Chem", average: 79 },
  { course: "World History", average: 85 },
  { course: "Calculus I", average: 76 },
  { course: "Creative Wrt", average: 87 },
  { course: "Physics", average: 81 },
  { course: "US Govt", average: 80 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: users, isLoading: usersLoading } = useUsers();

  const isLoading = coursesLoading || usersLoading;

  const [reportType, setReportType] = useState<ReportType>("grades");
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-03-13");
  const [gradeLevel, setGradeLevel] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [exportAlert, setExportAlert] = useState<string | null>(null);

  // Teachers for filter
  const teachers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => u.role === "teacher");
  }, [users]);

  // Summary stats computed from mock data
  const summaryStats = useMemo(() => {
    switch (reportType) {
      case "grades": {
        const total = grades.length;
        const avgPct = total > 0
          ? Math.round(
              grades.reduce(
                (sum, g) => sum + calculatePercentage(g.score, g.maxScore),
                0
              ) / total
            )
          : 0;
        const aCount = grades.filter((g) => g.letterGrade === "A").length;
        return [
          { label: "Total Grades Recorded", value: total },
          { label: "Average Score", value: `${avgPct}%` },
          { label: "A Grades", value: aCount },
          { label: "Grade Distribution", value: "5 levels" },
        ];
      }
      case "attendance": {
        const total = attendance.length;
        const present = attendance.filter(
          (a) => a.status === "present" || a.status === "late"
        ).length;
        const absent = attendance.filter((a) => a.status === "absent").length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        return [
          { label: "Total Records", value: total },
          { label: "Attendance Rate", value: `${rate}%` },
          { label: "Absences", value: absent },
          { label: "Late Arrivals", value: attendance.filter((a) => a.status === "late").length },
        ];
      }
      case "enrollment": {
        const studentCount = users?.filter((u) => u.role === "student").length ?? 0;
        const courseCount = courses?.length ?? 0;
        const avgClassSize = courseCount > 0
          ? Math.round(
              (courses ?? []).reduce((sum, c) => sum + c.students.length, 0) /
                courseCount
            )
          : 0;
        return [
          { label: "Total Students", value: studentCount },
          { label: "Total Courses", value: courseCount },
          { label: "Avg Class Size", value: avgClassSize },
          { label: "Grade Levels", value: 3 },
        ];
      }
      case "performance": {
        const avgPerf =
          PERFORMANCE_BY_CLASS.reduce((s, c) => s + c.average, 0) /
          PERFORMANCE_BY_CLASS.length;
        const topCourse = PERFORMANCE_BY_CLASS.reduce((best, c) =>
          c.average > best.average ? c : best
        );
        const lowCourse = PERFORMANCE_BY_CLASS.reduce((worst, c) =>
          c.average < worst.average ? c : worst
        );
        return [
          { label: "School Average", value: `${Math.round(avgPerf)}%` },
          { label: "Top Performing", value: topCourse.course },
          { label: "Needs Improvement", value: lowCourse.course },
          { label: "Courses Analyzed", value: PERFORMANCE_BY_CLASS.length },
        ];
      }
    }
  }, [reportType, users, courses]);

  function handleExport(format: "PDF" | "CSV") {
    setExportAlert(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported as ${format} successfully.`
    );
    setTimeout(() => setExportAlert(null), 4000);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" />
        <LoadingState type="card" count={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        <LoadingState type="card" count={1} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export school-wide reports"
      >
        <Button variant="outline" className="gap-2" onClick={() => handleExport("PDF")}>
          <Download className="size-4" />
          Export PDF
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => handleExport("CSV")}>
          <FileText className="size-4" />
          Export CSV
        </Button>
      </PageHeader>

      {/* Export Alert */}
      {exportAlert && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          <AlertDescription>{exportAlert}</AlertDescription>
        </Alert>
      )}

      {/* Report Type Selector */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {REPORT_OPTIONS.map((opt) => (
          <Card
            key={opt.value}
            className={`cursor-pointer transition-all ${
              reportType === opt.value
                ? "ring-2 ring-primary"
                : "hover:ring-1 hover:ring-muted-foreground/20"
            }`}
            onClick={() => setReportType(opt.value)}
          >
            <CardContent className="flex items-center gap-3 pt-4">
              <div
                className={`flex size-10 items-center justify-center rounded-full ${
                  reportType === opt.value
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {opt.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                {reportType === opt.value && (
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs">Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={(v) => setGradeLevel(v ?? "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">
                {reportType === "performance" ? "Teacher" : "Course"}
              </Label>
              {reportType === "performance" ? (
                <Select value={teacherFilter} onValueChange={(v) => setTeacherFilter(v ?? "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v ?? "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {(courses ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Preview */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "grades" && "Grade Distribution"}
            {reportType === "attendance" && "Attendance Rate Over Time"}
            {reportType === "enrollment" && "Enrollment by Grade Level"}
            {reportType === "performance" && "Class Performance Comparison"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === "grades" ? (
                <BarChart data={GRADE_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="grade"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
                    {GRADE_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.grade} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : reportType === "attendance" ? (
                <LineChart data={ATTENDANCE_OVER_TIME}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    name="Attendance Rate"
                  />
                </LineChart>
              ) : reportType === "enrollment" ? (
                <PieChart>
                  <Pie
                    data={ENROLLMENT_BY_GRADE}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {ENROLLMENT_BY_GRADE.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={PERFORMANCE_BY_CLASS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="course"
                    width={100}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Average"]}
                  />
                  <Bar
                    dataKey="average"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    name="Class Average"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
