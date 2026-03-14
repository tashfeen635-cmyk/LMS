"use client";

import { useMemo } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Database,
  HardDrive,
  Wifi,
  Clock,
  Shield,
  UserPlus,
  Settings,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useUsers, useCourses } from "@/lib/services/hooks";
import { grades } from "@/lib/mock-data/grades";
import { attendance } from "@/lib/mock-data/attendance";
import { calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/shared/stat-card";
import LoadingState from "@/components/shared/loading-state";
import Timeline from "@/components/shared/timeline";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
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
// Constants
// ---------------------------------------------------------------------------

const ROLE_COLORS: Record<string, string> = {
  Students: "#3b82f6",
  Teachers: "#10b981",
  Parents: "#f59e0b",
  Admins: "#8b5cf6",
};

const MONTHLY_ACTIVITY = [
  { month: "Sep", logins: 1240, actions: 890 },
  { month: "Oct", logins: 1580, actions: 1120 },
  { month: "Nov", logins: 1420, actions: 980 },
  { month: "Dec", logins: 980, actions: 640 },
  { month: "Jan", logins: 1680, actions: 1340 },
  { month: "Feb", logins: 1820, actions: 1480 },
  { month: "Mar", logins: 1950, actions: 1560 },
];

const RECENT_ADMIN_ACTIONS = [
  {
    id: "act1",
    title: "Admin Alex Kim changed grading scale",
    description: "Updated minimum score for grade A from 90 to 93",
    time: "10 minutes ago",
    icon: <Settings className="size-4" />,
    color: "#8b5cf6",
  },
  {
    id: "act2",
    title: "Principal Henderson added new course",
    description: "AP Computer Science added to Fall 2026 catalog",
    time: "25 minutes ago",
    icon: <BookOpen className="size-4" />,
    color: "#3b82f6",
  },
  {
    id: "act3",
    title: "VP Foster updated school policies",
    description: "Revised attendance policy for Spring 2026",
    time: "1 hour ago",
    icon: <FileText className="size-4" />,
    color: "#10b981",
  },
  {
    id: "act4",
    title: "Admin Alex Kim imported 15 student records",
    description: "Bulk CSV import completed successfully",
    time: "2 hours ago",
    icon: <UserPlus className="size-4" />,
    color: "#f59e0b",
  },
  {
    id: "act5",
    title: "Principal Henderson sent school-wide announcement",
    description: "Spring Break Schedule notification published",
    time: "3 hours ago",
    icon: <AlertTriangle className="size-4" />,
    color: "#ef4444",
  },
  {
    id: "act6",
    title: "VP Foster assigned teacher to Physics section",
    description: "Mr. James Brown assigned to Physics (SCI-301)",
    time: "4 hours ago",
    icon: <Users className="size-4" />,
    color: "#6366f1",
  },
  {
    id: "act7",
    title: "Admin Alex Kim enabled 2FA for admin accounts",
    description: "Two-factor authentication enforced for all admin roles",
    time: "5 hours ago",
    icon: <Shield className="size-4" />,
    color: "#ec4899",
  },
  {
    id: "act8",
    title: "System backup completed automatically",
    description: "Full database backup stored in cloud storage",
    time: "6 hours ago",
    icon: <Database className="size-4" />,
    color: "#14b8a6",
  },
  {
    id: "act9",
    title: "VP Foster approved term dates for Fall 2026",
    description: "Fall 2026 term: Aug 25 - Dec 18, 2026",
    time: "Yesterday at 4:30 PM",
    icon: <CalendarCheck className="size-4" />,
    color: "#f97316",
  },
  {
    id: "act10",
    title: "Principal Henderson reviewed quarterly report",
    description: "Q1 2026 academic performance report marked as reviewed",
    time: "Yesterday at 2:15 PM",
    icon: <GraduationCap className="size-4" />,
    color: "#3b82f6",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const isLoading = usersLoading || coursesLoading;

  // Total user count
  const totalUsers = users?.length ?? 0;

  // Active courses
  const activeCourses = courses?.length ?? 0;

  // Enrollment by role for pie chart
  const enrollmentData = useMemo(() => {
    if (!users) return [];
    const counts: Record<string, number> = {
      Students: 0,
      Teachers: 0,
      Parents: 0,
      Admins: 0,
    };
    for (const u of users) {
      if (u.role === "student") counts.Students++;
      else if (u.role === "teacher") counts.Teachers++;
      else if (u.role === "parent") counts.Parents++;
      else if (u.role === "admin") counts.Admins++;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  // Average school GPA
  const averageGPA = useMemo(() => {
    if (grades.length === 0) return 0;
    const scaleMap: Record<string, number> = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };
    const total = grades.reduce(
      (sum, g) => sum + (scaleMap[g.letterGrade] ?? 0),
      0
    );
    return Math.round((total / grades.length) * 100) / 100;
  }, []);

  // Attendance rate
  const attendanceRate = useMemo(() => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;
    return Math.round((present / attendance.length) * 100);
  }, []);

  // System health cards
  const systemHealth = [
    {
      label: "Database",
      status: "Healthy",
      icon: <Database className="size-4" />,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    },
    {
      label: "Storage",
      status: "45% used",
      icon: <HardDrive className="size-4" />,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    },
    {
      label: "API",
      status: "99.9% uptime",
      icon: <Wifi className="size-4" />,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    },
    {
      label: "Last Backup",
      status: "2 hours ago",
      icon: <Clock className="size-4" />,
      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="School administration overview"
        />
        <LoadingState
          type="card"
          count={4}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
        <LoadingState type="card" count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        description="School administration overview"
      />

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          description="Registered accounts"
          icon={<Users className="size-4" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Active Courses"
          value={activeCourses}
          description="Current semester"
          icon={<BookOpen className="size-4" />}
          trend={{ value: 3, positive: true }}
        />
        <StatCard
          title="Average School GPA"
          value={averageGPA.toFixed(2)}
          description="All students"
          icon={<GraduationCap className="size-4" />}
          trend={{ value: 2, positive: true }}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description="This semester"
          icon={<CalendarCheck className="size-4" />}
          trend={{ value: 1, positive: attendanceRate >= 90 }}
        />
      </div>

      {/* Charts side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollment by Role - Donut */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enrollmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {enrollmentData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={ROLE_COLORS[entry.name] ?? "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity Trend - LineChart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_ACTIVITY}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="logins"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Logins"
                  />
                  <Line
                    type="monotone"
                    dataKey="actions"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Actions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          System Health
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {systemHealth.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 pt-4">
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${item.color}`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="shrink-0 text-[10px] uppercase"
                >
                  {item.label === "Storage" ? "OK" : item.label === "Last Backup" ? "OK" : "Online"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline items={RECENT_ADMIN_ACTIONS} />
        </CardContent>
      </Card>
    </div>
  );
}
