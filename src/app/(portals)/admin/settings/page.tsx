"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  ScrollText,
  CheckCircle2,
  Building2,
  Globe,
  Calendar,
  Mail,
  Smartphone,
  MessageSquare,
  Lock,
  Key,
  Timer,
  UserCog,
  FileText,
  BookOpen,
  AlertTriangle,
  Users,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import Timeline from "@/components/shared/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// Mock Audit Log Data
// ---------------------------------------------------------------------------

const AUDIT_LOG_ITEMS = [
  {
    id: "audit1",
    title: "Admin Alex Kim changed grading scale",
    description: "Modified minimum score for grade A from 90 to 93 in the school-wide grading policy.",
    time: "Mar 13, 2026 9:45 AM",
    user: "Alex Kim",
    action: "update",
    target: "Grading Scale",
    icon: <BookOpen className="size-4" />,
    color: "#8b5cf6",
  },
  {
    id: "audit2",
    title: "Principal Henderson added new course",
    description: "Created AP Computer Science (CS-401) for Fall 2026 semester.",
    time: "Mar 13, 2026 8:30 AM",
    user: "Tom Henderson",
    action: "create",
    target: "Course",
    icon: <BookOpen className="size-4" />,
    color: "#3b82f6",
  },
  {
    id: "audit3",
    title: "VP Foster updated school policies",
    description: "Revised section 3.2 of the student code of conduct regarding electronic devices.",
    time: "Mar 12, 2026 4:15 PM",
    user: "Diana Foster",
    action: "update",
    target: "Policies",
    icon: <FileText className="size-4" />,
    color: "#10b981",
  },
  {
    id: "audit4",
    title: "Admin Alex Kim disabled user account",
    description: "Account for former staff member J. Reynolds marked as inactive.",
    time: "Mar 12, 2026 2:00 PM",
    user: "Alex Kim",
    action: "update",
    target: "User",
    icon: <UserCog className="size-4" />,
    color: "#f97316",
  },
  {
    id: "audit5",
    title: "Principal Henderson approved term dates",
    description: "Fall 2026 term dates confirmed: Aug 24 - Dec 18, 2026.",
    time: "Mar 12, 2026 11:30 AM",
    user: "Tom Henderson",
    action: "update",
    target: "Term",
    icon: <Calendar className="size-4" />,
    color: "#f59e0b",
  },
  {
    id: "audit6",
    title: "VP Foster created parent communication blast",
    description: "Sent parent-teacher conference reminder to 120 parent accounts.",
    time: "Mar 11, 2026 3:45 PM",
    user: "Diana Foster",
    action: "create",
    target: "Communication",
    icon: <Mail className="size-4" />,
    color: "#ec4899",
  },
  {
    id: "audit7",
    title: "Admin Alex Kim exported attendance report",
    description: "Generated CSV export of February 2026 attendance data.",
    time: "Mar 11, 2026 10:00 AM",
    user: "Alex Kim",
    action: "export",
    target: "Report",
    icon: <FileText className="size-4" />,
    color: "#14b8a6",
  },
  {
    id: "audit8",
    title: "Principal Henderson updated notification settings",
    description: "Enabled SMS notifications for urgent announcements school-wide.",
    time: "Mar 10, 2026 2:30 PM",
    user: "Tom Henderson",
    action: "update",
    target: "Settings",
    icon: <Bell className="size-4" />,
    color: "#6366f1",
  },
  {
    id: "audit9",
    title: "VP Foster added new teacher account",
    description: "Created account for Dr. Kim Park (Art Department).",
    time: "Mar 10, 2026 9:15 AM",
    user: "Diana Foster",
    action: "create",
    target: "User",
    icon: <Users className="size-4" />,
    color: "#3b82f6",
  },
  {
    id: "audit10",
    title: "Admin Alex Kim updated security policy",
    description: "Increased minimum password length from 8 to 12 characters.",
    time: "Mar 9, 2026 4:00 PM",
    user: "Alex Kim",
    action: "update",
    target: "Security",
    icon: <Shield className="size-4" />,
    color: "#ef4444",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  // General settings
  const [schoolName, setSchoolName] = useState("Westlake Academy");
  const [schoolAddress, setSchoolAddress] = useState(
    "1200 Education Blvd, Springfield, IL 62704"
  );
  const [timezone, setTimezone] = useState("America/Chicago");
  const [academicYearStart, setAcademicYearStart] = useState("2025-08-25");
  const [academicYearEnd, setAcademicYearEnd] = useState("2026-05-22");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailGradeAlerts, setEmailGradeAlerts] = useState(true);
  const [emailAttendanceAlerts, setEmailAttendanceAlerts] = useState(true);
  const [emailAnnouncements, setEmailAnnouncements] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");

  // Security settings
  const [minPasswordLength, setMinPasswordLength] = useState("12");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Audit log filters
  const [auditUserFilter, setAuditUserFilter] = useState("all");
  const [auditActionFilter, setAuditActionFilter] = useState("all");

  // Filtered audit log
  const filteredAuditLog = AUDIT_LOG_ITEMS.filter((item) => {
    if (auditUserFilter !== "all" && item.user !== auditUserFilter) return false;
    if (auditActionFilter !== "all" && item.action !== auditActionFilter) return false;
    return true;
  });

  function handleSave(section: string) {
    setSaveAlert(`${section} settings saved successfully.`);
    setTimeout(() => setSaveAlert(null), 4000);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure school-wide system settings"
      />

      {/* Save Alert */}
      {saveAlert && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          <AlertDescription>{saveAlert}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? "general")}>
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-1.5 size-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1.5 size-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-1.5 size-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="audit">
            <ScrollText className="mr-1.5 size-3.5" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* General Tab                                                    */}
        {/* ============================================================== */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" />
                    School Name
                  </Label>
                  <Input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Globe className="size-3.5" />
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={(v) => setTimezone(v ?? "EST")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>School Address</Label>
                <Input
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Academic Year Start
                  </Label>
                  <Input
                    type="date"
                    value={academicYearStart}
                    onChange={(e) => setAcademicYearStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Academic Year End
                  </Label>
                  <Input
                    type="date"
                    value={academicYearEnd}
                    onChange={(e) => setAcademicYearEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("General")}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* Notifications Tab                                              */}
        {/* ============================================================== */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Channel toggles */}
              <div>
                <h3 className="mb-4 text-sm font-medium text-foreground">
                  Notification Channels
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <Mail className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Email Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <MessageSquare className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          In-App Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Show notifications within the LMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={inAppNotifications}
                      onCheckedChange={setInAppNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <Smartphone className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          SMS Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Send text messages for urgent alerts
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification types */}
              <div>
                <h3 className="mb-4 text-sm font-medium text-foreground">
                  Notification Types
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Grade Alerts</Label>
                    <Switch
                      checked={emailGradeAlerts}
                      onCheckedChange={setEmailGradeAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Attendance Alerts</Label>
                    <Switch
                      checked={emailAttendanceAlerts}
                      onCheckedChange={setEmailAttendanceAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Announcements</Label>
                    <Switch
                      checked={emailAnnouncements}
                      onCheckedChange={setEmailAnnouncements}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={notificationFrequency}
                  onValueChange={(v) => setNotificationFrequency(v ?? "immediate")}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Notification")}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* Security Tab                                                   */}
        {/* ============================================================== */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Policy */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Lock className="size-4" />
                  Password Policy
                </h3>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Minimum Password Length</Label>
                      <Input
                        type="number"
                        value={minPasswordLength}
                        onChange={(e) => setMinPasswordLength(e.target.value)}
                        min={6}
                        max={32}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Require Uppercase Letters</Label>
                      <Switch
                        checked={requireUppercase}
                        onCheckedChange={setRequireUppercase}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Require Numbers</Label>
                      <Switch
                        checked={requireNumbers}
                        onCheckedChange={setRequireNumbers}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Require Special Characters</Label>
                      <Switch
                        checked={requireSpecialChars}
                        onCheckedChange={setRequireSpecialChars}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Settings */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Timer className="size-4" />
                  Session Settings
                </h3>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={(v) => setSessionTimeout(v ?? "30")}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Key className="size-4" />
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Require 2FA for All Users
                    </p>
                    <p className="text-xs text-muted-foreground">
                      When enabled, all users must set up two-factor
                      authentication on their next login
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                {twoFactorEnabled && (
                  <Alert className="mt-3 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertTriangle className="size-4" />
                    <AlertDescription>
                      Enabling 2FA will require all users to configure an
                      authenticator app on their next login. Make sure to
                      communicate this change to all staff and students.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Security")}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* Audit Log Tab                                                  */}
        {/* ============================================================== */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Audit Log</span>
                <Badge variant="secondary" className="text-xs">
                  {filteredAuditLog.length} entries
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Filter by User</Label>
                  <Select
                    value={auditUserFilter}
                    onValueChange={(v) => setAuditUserFilter(v ?? "all")}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="Alex Kim">Alex Kim</SelectItem>
                      <SelectItem value="Tom Henderson">
                        Tom Henderson
                      </SelectItem>
                      <SelectItem value="Diana Foster">Diana Foster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Filter by Action</Label>
                  <Select
                    value={auditActionFilter}
                    onValueChange={(v) => setAuditActionFilter(v ?? "all")}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timeline */}
              {filteredAuditLog.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No audit log entries match the current filters.
                </p>
              ) : (
                <Timeline items={filteredAuditLog} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
