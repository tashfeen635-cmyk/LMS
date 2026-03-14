"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ClipboardList,
  CheckCircle,
  Circle,
  FileEdit,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import {
  useCourse,
  useAssignmentsByCourse,
} from "@/lib/services/hooks";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssignmentType, AssignmentStatus, Assignment } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusIcon(status: AssignmentStatus) {
  switch (status) {
    case "graded":
      return <CheckCircle className="size-4 text-emerald-500" />;
    case "published":
      return <Circle className="size-4 text-blue-500" />;
    case "draft":
      return <FileEdit className="size-4 text-muted-foreground" />;
  }
}

function getStatusVariant(
  status: AssignmentStatus
): "default" | "secondary" | "outline" {
  switch (status) {
    case "graded":
      return "secondary";
    case "published":
      return "default";
    case "draft":
      return "outline";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherAssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: assignments, isLoading: assignmentsLoading } =
    useAssignmentsByCourse(courseId);

  const isLoading = courseLoading || assignmentsLoading;

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state for creating an assignment
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<AssignmentType>("homework");
  const [formPoints, setFormPoints] = useState("100");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<AssignmentStatus>("draft");

  // Local assignments (to include newly created ones)
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>([]);

  // Merge server + local assignments and sort by due date
  const allAssignments = useMemo(() => {
    const merged = [...(assignments ?? []), ...localAssignments];
    return merged.sort(
      (a, b) =>
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
  }, [assignments, localAssignments]);

  // Handle form submit
  function handleCreateAssignment() {
    if (!formTitle.trim() || !formDueDate) return;

    const newAssignment: Assignment = {
      id: `local-${Date.now()}`,
      courseId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      type: formType,
      points: parseInt(formPoints) || 100,
      dueDate: new Date(formDueDate).toISOString(),
      status: formStatus,
      submissions: [],
    };

    setLocalAssignments((prev) => [...prev, newAssignment]);

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setFormType("homework");
    setFormPoints("100");
    setFormDueDate("");
    setFormStatus("draft");
    setDialogOpen(false);
  }

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState type="card" count={1} className="grid-cols-1" />
        <LoadingState type="card" count={6} />
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
          title={`${course.name} - Assignments`}
          description={`${allAssignments.length} assignment${allAssignments.length !== 1 ? "s" : ""}`}
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Create Assignment
                </Button>
              }
            />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Assignment</DialogTitle>
                <DialogDescription>
                  Add a new assignment to {course.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="assignment-title">Title</Label>
                  <Input
                    id="assignment-title"
                    placeholder="e.g. Chapter 6 Homework"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="assignment-desc">Description</Label>
                  <Textarea
                    id="assignment-desc"
                    placeholder="Describe the assignment..."
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                {/* Type & Points row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formType}
                      onValueChange={(val) =>
                        setFormType(val as AssignmentType)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignment-points">Points</Label>
                    <Input
                      id="assignment-points"
                      type="number"
                      min={1}
                      value={formPoints}
                      onChange={(e) => setFormPoints(e.target.value)}
                    />
                  </div>
                </div>

                {/* Due date */}
                <div className="space-y-2">
                  <Label htmlFor="assignment-due">Due Date</Label>
                  <Input
                    id="assignment-due"
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formStatus}
                    onValueChange={(val) =>
                      setFormStatus(val as AssignmentStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateAssignment}
                  disabled={!formTitle.trim() || !formDueDate}
                >
                  Create Assignment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>
      </div>

      {/* Status filter badges */}
      {allAssignments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(["published", "graded", "draft"] as AssignmentStatus[]).map(
            (status) => {
              const count = allAssignments.filter(
                (a) => a.status === status
              ).length;
              if (count === 0) return null;
              return (
                <Badge
                  key={status}
                  variant={getStatusVariant(status)}
                  className="gap-1.5 capitalize"
                >
                  {getStatusIcon(status)}
                  {status}: {count}
                </Badge>
              );
            }
          )}
        </div>
      )}

      {/* Assignment list */}
      {allAssignments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title="No assignments yet"
          description="Create your first assignment to get started."
        />
      ) : (
        <div className="space-y-3">
          {allAssignments.map((assignment) => {
            const submissionCount = assignment.submissions?.length ?? 0;
            const studentCount = course.students.length;

            return (
              <Card
                key={assignment.id}
                className="transition-shadow hover:shadow-sm"
              >
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Status icon */}
                  <div className="shrink-0">
                    {getStatusIcon(assignment.status)}
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {assignment.title}
                      </h3>
                      <Badge
                        variant={getStatusVariant(assignment.status)}
                        className="shrink-0 text-[10px] capitalize"
                      >
                        {assignment.status}
                      </Badge>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {/* Type */}
                      <span className="capitalize">{assignment.type}</span>

                      {/* Due date */}
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        Due {formatDate(assignment.dueDate)}
                      </span>

                      {/* Points */}
                      <span className="inline-flex items-center gap-1">
                        <Award className="size-3" />
                        {assignment.points} pts
                      </span>

                      {/* Submissions */}
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3" />
                        {submissionCount}/{studentCount} submitted
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
