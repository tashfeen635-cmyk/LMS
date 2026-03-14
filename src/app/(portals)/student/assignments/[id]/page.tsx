"use client";

import { use, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  FileEdit,
  FileUp,
  Upload,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  FileText,
  FolderKanban,
  PenTool,
  AlertTriangle,
  Send,
} from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/stores/auth-store";
import { useAssignment } from "@/lib/services/hooks";
import { getCourseById } from "@/lib/mock-data";
import {
  cn,
  formatDate,
  formatDateTime,
  isOverdue,
  calculatePercentage,
} from "@/lib/utils";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import GradeBadge from "@/components/academic/grade-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { AssignmentType, Submission } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTypeIcon(type: AssignmentType) {
  switch (type) {
    case "homework":
      return <BookOpen className="size-4" />;
    case "quiz":
      return <HelpCircle className="size-4" />;
    case "test":
      return <FileText className="size-4" />;
    case "project":
      return <FolderKanban className="size-4" />;
    case "essay":
      return <PenTool className="size-4" />;
  }
}

function getTypeColor(type: AssignmentType): string {
  switch (type) {
    case "homework":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "quiz":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    case "test":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    case "project":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "essay":
      return "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300";
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case "graded":
      return {
        icon: <CheckCircle2 className="size-4" />,
        label: "Graded",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950",
      };
    case "published":
      return {
        icon: <Circle className="size-4" />,
        label: "Published",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950",
      };
    default:
      return {
        icon: <FileEdit className="size-4" />,
        label: "Draft",
        color: "text-muted-foreground",
        bg: "bg-muted",
      };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: assignmentId } = use(params);
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  const { data: assignment, isLoading } = useAssignment(assignmentId);

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Course info
  const course = assignment ? getCourseById(assignment.courseId) : undefined;

  // Find the current student's submission
  const mySubmission: Submission | undefined = useMemo(() => {
    if (!assignment?.submissions) return undefined;
    return assignment.submissions.find((s) => s.studentId === userId);
  }, [assignment, userId]);

  const isGraded = assignment?.status === "graded" && mySubmission?.grade != null;
  const overdue = assignment ? isOverdue(assignment.dueDate) : false;
  const statusConfig = assignment ? getStatusConfig(assignment.status) : null;

  // Handle mock submit
  const handleSubmit = () => {
    if (!content.trim() && !fileName) return;
    setSubmitted(true);
  };

  // Handle mock file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setFileName("assignment-submission.pdf");
  };

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState type="card" count={1} className="grid-cols-1" />
        <LoadingState type="card" count={1} className="grid-cols-1" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <EmptyState
        title="Assignment not found"
        description="The assignment you are looking for does not exist."
        action={{
          label: "Back to Assignments",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/student/assignments">
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Assignments
        </Button>
      </Link>

      {/* Assignment Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {assignment.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {/* Course badge */}
              {course && (
                <Badge variant="secondary">{course.name}</Badge>
              )}

              {/* Type badge */}
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 border-transparent",
                  getTypeColor(assignment.type)
                )}
              >
                {getTypeIcon(assignment.type)}
                <span className="capitalize">{assignment.type}</span>
              </Badge>

              {/* Status badge */}
              {statusConfig && (
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1 border-transparent",
                    statusConfig.color,
                    statusConfig.bg
                  )}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Award className="size-4" />
            {assignment.points} points
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              overdue && "text-red-600 dark:text-red-400 font-medium"
            )}
          >
            {overdue ? (
              <AlertTriangle className="size-4" />
            ) : (
              <Calendar className="size-4" />
            )}
            {overdue ? "Overdue - " : "Due "}
            {formatDateTime(assignment.dueDate)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {assignment.description}
          </p>
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-foreground">
                Attachments
              </p>
              {assignment.attachments.map((attachment, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <FileText className="size-3" />
                  {attachment.split("/").pop()}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Graded Section */}
      {isGraded && mySubmission && (
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
              Grade & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Score */}
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Score
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {mySubmission.grade}/{assignment.points}
                </p>
              </div>

              {/* Percentage */}
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Percentage
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {calculatePercentage(mySubmission.grade!, assignment.points)}%
                </p>
              </div>

              {/* Letter Grade */}
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Letter Grade
                </p>
                <div className="mt-2 flex justify-center">
                  <GradeBadge
                    grade={
                      calculatePercentage(mySubmission.grade!, assignment.points) >= 90
                        ? "A"
                        : calculatePercentage(mySubmission.grade!, assignment.points) >= 80
                        ? "B"
                        : calculatePercentage(mySubmission.grade!, assignment.points) >= 70
                        ? "C"
                        : calculatePercentage(mySubmission.grade!, assignment.points) >= 60
                        ? "D"
                        : "F"
                    }
                    className="text-lg px-3 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Feedback */}
            {mySubmission.feedback && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">
                  Instructor Feedback
                </p>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {mySubmission.feedback}
                  </p>
                </div>
              </div>
            )}

            {/* Submission info */}
            {mySubmission.submittedAt && (
              <p className="text-xs text-muted-foreground">
                <Clock className="mr-1 inline size-3" />
                Submitted {formatDateTime(mySubmission.submittedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Form (when not graded) */}
      {!isGraded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Submit Your Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted ? (
              /* Success feedback */
              <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 py-8 dark:border-emerald-800 dark:bg-emerald-950/50">
                <CheckCircle2 className="size-10 text-emerald-500" />
                <div className="text-center">
                  <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                    Assignment Submitted Successfully
                  </p>
                  <p className="mt-1 text-sm text-emerald-600/80 dark:text-emerald-400/80">
                    Your submission has been received. You will be notified when
                    it is graded.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Already submitted indicator */}
                {mySubmission && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                    <Clock className="mr-1.5 inline size-3.5" />
                    You already submitted on{" "}
                    {formatDateTime(mySubmission.submittedAt)}. You can
                    resubmit below.
                  </div>
                )}

                {/* Text content */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Response
                  </label>
                  <Textarea
                    placeholder="Type your response here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* File upload drop zone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Attachments
                  </label>
                  <div
                    className={cn(
                      "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => setFileName("assignment-submission.pdf")}
                  >
                    <FileUp className="size-8 text-muted-foreground/50" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Drag and drop your file here, or{" "}
                        <span className="text-primary underline underline-offset-2">
                          browse
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground/70">
                        PDF, DOCX, or images up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* File name display */}
                  {fileName && (
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="flex-1 truncate text-foreground">
                        {fileName}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileName(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() && !fileName}
                    className="gap-2"
                  >
                    <Send className="size-4" />
                    Submit Assignment
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
