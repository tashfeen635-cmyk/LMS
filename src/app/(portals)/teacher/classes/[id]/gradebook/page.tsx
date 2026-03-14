"use client";

import { use, useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, BookOpen } from "lucide-react";
import {
  useCourse,
  useAssignmentsByCourse,
  useGradesByCourse,
} from "@/lib/services/hooks";
import { getUserById } from "@/lib/mock-data";
import { cn, calculatePercentage } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import EmptyState from "@/components/shared/empty-state";
import GradeBadge from "@/components/academic/grade-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function getGradeCellColor(score: number, maxScore: number): string {
  if (maxScore === 0) return "";
  const pct = (score / maxScore) * 100;
  if (pct >= 90) return "bg-emerald-50 dark:bg-emerald-950/40";
  if (pct >= 80) return "bg-blue-50 dark:bg-blue-950/40";
  if (pct >= 70) return "bg-yellow-50 dark:bg-yellow-950/40";
  if (pct >= 60) return "bg-orange-50 dark:bg-orange-950/40";
  return "bg-red-50 dark:bg-red-950/40";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherGradebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: assignments, isLoading: assignmentsLoading } =
    useAssignmentsByCourse(courseId);
  const { data: grades, isLoading: gradesLoading } =
    useGradesByCourse(courseId);

  const isLoading = courseLoading || assignmentsLoading || gradesLoading;

  // Local state to track edits: key is `${studentId}-${assignmentId}`, value is score
  const [editedGrades, setEditedGrades] = useState<Record<string, number>>({});

  // Active editing cell
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Save status indicator
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Graded assignments only (sorted by due date)
  const gradedAssignments = useMemo(
    () =>
      [...(assignments ?? [])]
        .filter((a) => a.status === "graded")
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ),
    [assignments]
  );

  // Student list
  const students = useMemo(() => {
    if (!course) return [];
    return course.students
      .map((sid) => {
        const user = getUserById(sid);
        return { id: sid, name: user?.name ?? "Unknown Student" };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [course]);

  // Build grade map: key is `${studentId}-${assignmentId}` -> { score, maxScore }
  const gradeMap = useMemo(() => {
    const map: Record<string, { score: number; maxScore: number }> = {};
    if (!grades) return map;
    for (const g of grades) {
      const key = `${g.studentId}-${g.assignmentId}`;
      map[key] = { score: g.score, maxScore: g.maxScore };
    }
    return map;
  }, [grades]);

  // Get effective score (edited or original)
  const getScore = useCallback(
    (studentId: string, assignmentId: string): number | null => {
      const key = `${studentId}-${assignmentId}`;
      if (key in editedGrades) return editedGrades[key];
      if (key in gradeMap) return gradeMap[key].score;
      return null;
    },
    [editedGrades, gradeMap]
  );

  // Get max score for an assignment
  const getMaxScore = useCallback(
    (assignmentId: string): number => {
      const assignment = gradedAssignments.find((a) => a.id === assignmentId);
      return assignment?.points ?? 100;
    },
    [gradedAssignments]
  );

  // Row averages (per student)
  const rowAverages = useMemo(() => {
    const avgs: Record<string, number | null> = {};
    for (const student of students) {
      let total = 0;
      let count = 0;
      for (const assignment of gradedAssignments) {
        const score = getScore(student.id, assignment.id);
        if (score !== null) {
          total += calculatePercentage(score, getMaxScore(assignment.id));
          count++;
        }
      }
      avgs[student.id] = count > 0 ? Math.round(total / count) : null;
    }
    return avgs;
  }, [students, gradedAssignments, getScore, getMaxScore]);

  // Column averages (per assignment)
  const colAverages = useMemo(() => {
    const avgs: Record<string, number | null> = {};
    for (const assignment of gradedAssignments) {
      let total = 0;
      let count = 0;
      for (const student of students) {
        const score = getScore(student.id, assignment.id);
        if (score !== null) {
          total += calculatePercentage(score, getMaxScore(assignment.id));
          count++;
        }
      }
      avgs[assignment.id] = count > 0 ? Math.round(total / count) : null;
    }
    return avgs;
  }, [students, gradedAssignments, getScore, getMaxScore]);

  // Handle starting edit
  function handleCellClick(studentId: string, assignmentId: string) {
    const key = `${studentId}-${assignmentId}`;
    const score = getScore(studentId, assignmentId);
    setEditingCell(key);
    setEditingValue(score !== null ? String(score) : "");
  }

  // Handle committing edit
  function handleEditCommit() {
    if (!editingCell) return;
    const numValue = parseFloat(editingValue);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedGrades((prev) => ({ ...prev, [editingCell]: numValue }));

      // Simulate auto-save
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        setSaveStatus("saved");
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }, 800);
    }
    setEditingCell(null);
    setEditingValue("");
  }

  // Focus input when editing cell changes
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState type="card" count={1} className="grid-cols-1" />
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

  const hasData = gradedAssignments.length > 0 && students.length > 0;

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

        <div className="flex items-center justify-between gap-4">
          <PageHeader
            title={`${course.name} - Gradebook`}
            description="Click any cell to edit a grade"
          />

          {/* Auto-save indicator */}
          <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="size-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  All changes saved
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gradebook Grid */}
      {!hasData ? (
        <EmptyState
          icon={<BookOpen className="size-6" />}
          title="No grades to display"
          description={
            gradedAssignments.length === 0
              ? "There are no graded assignments for this class yet."
              : "There are no students enrolled in this class."
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <div className="min-w-[600px]">
                <table className="w-full border-collapse text-sm">
                  {/* Header row: student name column + assignment columns + average */}
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="sticky left-0 z-10 min-w-[180px] border-r bg-muted/80 px-4 py-3 text-left font-semibold backdrop-blur-sm">
                        Student
                      </th>
                      {gradedAssignments.map((assignment) => (
                        <th
                          key={assignment.id}
                          className="min-w-[120px] px-3 py-3 text-center font-medium"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="truncate text-xs">
                              {assignment.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              /{assignment.points} pts
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className="min-w-[100px] border-l bg-muted/40 px-3 py-3 text-center font-semibold">
                        Average
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, rowIdx) => {
                      const avg = rowAverages[student.id];
                      return (
                        <tr
                          key={student.id}
                          className={cn(
                            "border-b transition-colors hover:bg-muted/30",
                            rowIdx % 2 === 0 ? "bg-background" : "bg-muted/10"
                          )}
                        >
                          {/* Student name (sticky) */}
                          <td className="sticky left-0 z-10 border-r bg-background px-4 py-2 font-medium backdrop-blur-sm">
                            {student.name}
                          </td>

                          {/* Grade cells */}
                          {gradedAssignments.map((assignment) => {
                            const key = `${student.id}-${assignment.id}`;
                            const score = getScore(student.id, assignment.id);
                            const maxScore = getMaxScore(assignment.id);
                            const isEditing = editingCell === key;

                            return (
                              <td
                                key={key}
                                className={cn(
                                  "px-1 py-1 text-center",
                                  score !== null &&
                                    getGradeCellColor(score, maxScore)
                                )}
                                onClick={() => {
                                  if (!isEditing) {
                                    handleCellClick(student.id, assignment.id);
                                  }
                                }}
                              >
                                {isEditing ? (
                                  <Input
                                    ref={inputRef}
                                    type="number"
                                    min={0}
                                    max={maxScore}
                                    value={editingValue}
                                    onChange={(e) =>
                                      setEditingValue(e.target.value)
                                    }
                                    onBlur={handleEditCommit}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleEditCommit();
                                      if (e.key === "Escape") {
                                        setEditingCell(null);
                                        setEditingValue("");
                                      }
                                    }}
                                    className="mx-auto h-7 w-16 text-center text-xs tabular-nums"
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    className="inline-flex h-7 w-full items-center justify-center rounded px-2 text-xs tabular-nums transition-colors hover:bg-muted/60"
                                  >
                                    {score !== null ? (
                                      <span className="font-medium">
                                        {score}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        --
                                      </span>
                                    )}
                                  </button>
                                )}
                              </td>
                            );
                          })}

                          {/* Row average */}
                          <td className="border-l bg-muted/20 px-3 py-2 text-center">
                            {avg !== null ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="tabular-nums font-semibold">
                                  {avg}%
                                </span>
                                <GradeBadge grade={percentToLetter(avg)} />
                              </span>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Column averages footer */}
                  <tfoot>
                    <tr className="border-t-2 bg-muted/50 font-semibold">
                      <td className="sticky left-0 z-10 border-r bg-muted/80 px-4 py-3 text-left backdrop-blur-sm">
                        Class Average
                      </td>
                      {gradedAssignments.map((assignment) => {
                        const avg = colAverages[assignment.id];
                        return (
                          <td
                            key={assignment.id}
                            className="px-3 py-3 text-center"
                          >
                            {avg !== null ? (
                              <span className="tabular-nums">{avg}%</span>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border-l bg-muted/40 px-3 py-3 text-center">
                        {(() => {
                          const allAvgs = Object.values(rowAverages).filter(
                            (v): v is number => v !== null
                          );
                          if (allAvgs.length === 0) return "--";
                          const classAvg = Math.round(
                            allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length
                          );
                          return (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="tabular-nums">{classAvg}%</span>
                              <GradeBadge grade={percentToLetter(classAvg)} />
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
