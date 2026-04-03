"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";
import type { Term, Course } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCourses, useUsers } from "@/lib/services/hooks";
import { getUserById, addCourse as addCourseToData } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// Mock terms data
// ---------------------------------------------------------------------------

const INITIAL_TERMS: Term[] = [
  {
    id: "term1",
    name: "Fall 2025",
    startDate: "2025-08-25T00:00:00Z",
    endDate: "2025-12-19T00:00:00Z",
    current: false,
  },
  {
    id: "term2",
    name: "Spring 2026",
    startDate: "2026-01-12T00:00:00Z",
    endDate: "2026-05-22T00:00:00Z",
    current: true,
  },
  {
    id: "term3",
    name: "Summer 2026",
    startDate: "2026-06-08T00:00:00Z",
    endDate: "2026-07-31T00:00:00Z",
    current: false,
  },
  {
    id: "term4",
    name: "Fall 2026",
    startDate: "2026-08-24T00:00:00Z",
    endDate: "2026-12-18T00:00:00Z",
    current: false,
  },
];

// ---------------------------------------------------------------------------
// Initial grading scale
// ---------------------------------------------------------------------------

interface GradeScaleRow {
  letter: string;
  minScore: number;
  maxScore: number;
  gpa: number;
}

const INITIAL_GRADING_SCALE: GradeScaleRow[] = [
  { letter: "A", minScore: 90, maxScore: 100, gpa: 4.0 },
  { letter: "B", minScore: 80, maxScore: 89, gpa: 3.0 },
  { letter: "C", minScore: 70, maxScore: 79, gpa: 2.0 },
  { letter: "D", minScore: 60, maxScore: 69, gpa: 1.0 },
  { letter: "F", minScore: 0, maxScore: 59, gpa: 0.0 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AcademicSetupPage() {
  const queryClient = useQueryClient();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: users, isLoading: usersLoading } = useUsers();

  const isLoading = coursesLoading || usersLoading;

  const [activeTab, setActiveTab] = useState("terms");

  // Terms state
  const [terms, setTerms] = useState<Term[]>(INITIAL_TERMS);
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [termForm, setTermForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Grading scale state
  const [gradingScale, setGradingScale] = useState<GradeScaleRow[]>(
    INITIAL_GRADING_SCALE
  );
  const [editingGradeIdx, setEditingGradeIdx] = useState<number | null>(null);
  const [gradeEditForm, setGradeEditForm] = useState<GradeScaleRow>({
    letter: "",
    minScore: 0,
    maxScore: 100,
    gpa: 0,
  });

  // Course dialog state
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    teacherId: "",
    description: "",
  });

  // Alert state
  const [alert, setAlert] = useState<string | null>(null);

  // Teachers list for select
  const teachers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => u.role === "teacher");
  }, [users]);

  // ---------------------
  // Term handlers
  // ---------------------

  function openAddTerm() {
    setEditingTerm(null);
    setTermForm({ name: "", startDate: "", endDate: "" });
    setTermDialogOpen(true);
  }

  function openEditTerm(term: Term) {
    setEditingTerm(term);
    setTermForm({
      name: term.name,
      startDate: term.startDate.split("T")[0],
      endDate: term.endDate.split("T")[0],
    });
    setTermDialogOpen(true);
  }

  function handleSaveTerm() {
    if (editingTerm) {
      setTerms((prev) =>
        prev.map((t) =>
          t.id === editingTerm.id
            ? {
                ...t,
                name: termForm.name,
                startDate: `${termForm.startDate}T00:00:00Z`,
                endDate: `${termForm.endDate}T00:00:00Z`,
              }
            : t
        )
      );
      showAlert(`Term "${termForm.name}" updated.`);
    } else {
      const newTerm: Term = {
        id: `term${Date.now()}`,
        name: termForm.name,
        startDate: `${termForm.startDate}T00:00:00Z`,
        endDate: `${termForm.endDate}T00:00:00Z`,
        current: false,
      };
      setTerms((prev) => [...prev, newTerm]);
      showAlert(`Term "${termForm.name}" created.`);
    }
    setTermDialogOpen(false);
  }

  function handleDeleteTerm(id: string) {
    setTerms((prev) => prev.filter((t) => t.id !== id));
    showAlert("Term deleted.");
  }

  // ---------------------
  // Grading scale handlers
  // ---------------------

  function startEditGrade(idx: number) {
    setEditingGradeIdx(idx);
    setGradeEditForm({ ...gradingScale[idx] });
  }

  function saveGradeEdit() {
    if (editingGradeIdx === null) return;
    setGradingScale((prev) =>
      prev.map((g, i) => (i === editingGradeIdx ? { ...gradeEditForm } : g))
    );
    setEditingGradeIdx(null);
    showAlert("Grading scale updated.");
  }

  function cancelGradeEdit() {
    setEditingGradeIdx(null);
  }

  // ---------------------
  // Course handlers
  // ---------------------

  function handleAddCourse() {
    const newCourse: Course = {
      id: `c${Date.now()}`,
      name: courseForm.name,
      code: courseForm.code,
      description: courseForm.description,
      teacherId: courseForm.teacherId,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      students: [],
      schedule: [],
    };
    addCourseToData(newCourse);
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    showAlert(`Course "${courseForm.name}" (${courseForm.code}) created.`);
    setCourseDialogOpen(false);
    setCourseForm({ name: "", code: "", teacherId: "", description: "" });
  }

  // ---------------------
  // Utility
  // ---------------------

  function showAlert(message: string) {
    setAlert(message);
    setTimeout(() => setAlert(null), 4000);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Academic Setup" />
        <LoadingState type="table" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Setup"
        description="Manage terms, grading scales, and courses"
      />

      {/* Alert */}
      {alert && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? "terms")}>
        <TabsList>
          <TabsTrigger value="terms">
            <Calendar className="mr-1.5 size-3.5" />
            Terms
          </TabsTrigger>
          <TabsTrigger value="grading">
            <GraduationCap className="mr-1.5 size-3.5" />
            Grading Scale
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="mr-1.5 size-3.5" />
            Courses
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* Terms Tab                                                      */}
        {/* ============================================================== */}
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Terms Management</span>
                <Button size="sm" className="gap-1.5" onClick={openAddTerm}>
                  <Plus className="size-3.5" />
                  Add Term
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {terms.map((term) => (
                      <TableRow key={term.id}>
                        <TableCell className="font-medium">
                          {term.name}
                        </TableCell>
                        <TableCell>{formatDate(term.startDate)}</TableCell>
                        <TableCell>{formatDate(term.endDate)}</TableCell>
                        <TableCell>
                          {term.current ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px]">
                              Current
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEditTerm(term)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteTerm(term.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Term Dialog */}
          <Dialog open={termDialogOpen} onOpenChange={setTermDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTerm ? "Edit Term" : "Add New Term"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Term Name</Label>
                  <Input
                    placeholder="e.g. Fall 2026"
                    value={termForm.name}
                    onChange={(e) =>
                      setTermForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={termForm.startDate}
                      onChange={(e) =>
                        setTermForm((f) => ({
                          ...f,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={termForm.endDate}
                      onChange={(e) =>
                        setTermForm((f) => ({
                          ...f,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTermDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTerm}
                  disabled={
                    !termForm.name || !termForm.startDate || !termForm.endDate
                  }
                >
                  {editingTerm ? "Save Changes" : "Create Term"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ============================================================== */}
        {/* Grading Scale Tab                                              */}
        {/* ============================================================== */}
        <TabsContent value="grading">
          <Card>
            <CardHeader>
              <CardTitle>Grading Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Letter Grade</TableHead>
                      <TableHead>Min Score</TableHead>
                      <TableHead>Max Score</TableHead>
                      <TableHead>GPA Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradingScale.map((row, idx) => (
                      <TableRow key={row.letter}>
                        {editingGradeIdx === idx ? (
                          <>
                            <TableCell>
                              <Input
                                value={gradeEditForm.letter}
                                onChange={(e) =>
                                  setGradeEditForm((f) => ({
                                    ...f,
                                    letter: e.target.value,
                                  }))
                                }
                                className="h-8 w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={gradeEditForm.minScore}
                                onChange={(e) =>
                                  setGradeEditForm((f) => ({
                                    ...f,
                                    minScore: Number(e.target.value),
                                  }))
                                }
                                className="h-8 w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={gradeEditForm.maxScore}
                                onChange={(e) =>
                                  setGradeEditForm((f) => ({
                                    ...f,
                                    maxScore: Number(e.target.value),
                                  }))
                                }
                                className="h-8 w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.1"
                                value={gradeEditForm.gpa}
                                onChange={(e) =>
                                  setGradeEditForm((f) => ({
                                    ...f,
                                    gpa: Number(e.target.value),
                                  }))
                                }
                                className="h-8 w-20"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="sm"
                                  onClick={saveGradeEdit}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelGradeEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-sm font-bold"
                              >
                                {row.letter}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.minScore}%</TableCell>
                            <TableCell>{row.maxScore}%</TableCell>
                            <TableCell>{row.gpa.toFixed(1)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => startEditGrade(idx)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* Courses Tab                                                    */}
        {/* ============================================================== */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Course Management</span>
                <Dialog
                  open={courseDialogOpen}
                  onOpenChange={setCourseDialogOpen}
                >
                  <DialogTrigger
                    render={
                      <Button size="sm" className="gap-1.5">
                        <Plus className="size-3.5" />
                        Add Course
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Course</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Course Name</Label>
                        <Input
                          placeholder="e.g. AP Computer Science"
                          value={courseForm.name}
                          onChange={(e) =>
                            setCourseForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Course Code</Label>
                        <Input
                          placeholder="e.g. CS-101"
                          value={courseForm.code}
                          onChange={(e) =>
                            setCourseForm((f) => ({
                              ...f,
                              code: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Assigned Teacher</Label>
                        <Select
                          value={courseForm.teacherId}
                          onValueChange={(val) =>
                            setCourseForm((f) => ({ ...f, teacherId: val ?? "" }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Brief course description"
                          value={courseForm.description}
                          onChange={(e) =>
                            setCourseForm((f) => ({
                              ...f,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCourseDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddCourse}
                        disabled={
                          !courseForm.name ||
                          !courseForm.code ||
                          !courseForm.teacherId
                        }
                      >
                        Create Course
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Schedule</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(courses ?? []).map((course) => {
                      const teacher = getUserById(course.teacherId);
                      const scheduleStr = course.schedule
                        .map(
                          (s) =>
                            `${s.day.slice(0, 3)} ${s.startTime}-${s.endTime}`
                        )
                        .join(", ");
                      return (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="size-3 shrink-0 rounded-full"
                                style={{ backgroundColor: course.color }}
                              />
                              <span className="font-medium">
                                {course.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {course.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {teacher?.name ?? "Unassigned"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="size-3.5" />
                              {course.students.length}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {scheduleStr}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
