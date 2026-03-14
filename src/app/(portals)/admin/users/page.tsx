"use client";

import { useMemo, useState } from "react";
import {
  UserPlus,
  Upload,
  Search,
  Pencil,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { User, UserRole } from "@/types";
import { useUsers } from "@/lib/services/hooks";
import { cn, getInitials } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import LoadingState from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// Role badge colors
// ---------------------------------------------------------------------------

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  student:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  teacher:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  parent:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  admin:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
};

// ---------------------------------------------------------------------------
// Mock CSV import data
// ---------------------------------------------------------------------------

const MOCK_CSV_PREVIEW = [
  { name: "Alex Rivera", email: "alex.rivera@school.edu", role: "student", grade: "10" },
  { name: "Taylor Morgan", email: "taylor.morgan@school.edu", role: "student", grade: "11" },
  { name: "Jordan Casey", email: "jordan.casey@school.edu", role: "student", grade: "12" },
  { name: "Dr. Kim Park", email: "kim.park@school.edu", role: "teacher", department: "Art" },
  { name: "Casey Wilson", email: "casey.wilson@email.com", role: "parent", children: "Alex Rivera" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UserManagementPage() {
  const { data: users, isLoading } = useUsers();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Add User dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    department: "",
    phone: "",
  });

  // Edit User dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    department: "",
    phone: "",
  });

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Import CSV dialog
  const [importOpen, setImportOpen] = useState(false);
  const [importStep, setImportStep] = useState<"upload" | "preview">("upload");

  // Success/error alerts
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Users by role counts
  const roleCounts = useMemo(() => {
    if (!users) return { all: 0, student: 0, teacher: 0, parent: 0, admin: 0 };
    const counts = { all: users.length, student: 0, teacher: 0, parent: 0, admin: 0 };
    for (const u of users) {
      counts[u.role]++;
    }
    return counts;
  }, [users]);

  // Filter by tab and search
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let filtered = users;
    if (activeTab !== "all") {
      filtered = filtered.filter((u) => u.role === activeTab);
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [users, activeTab, search]);

  // Bulk selection
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
    }
  }

  // Open edit dialog
  function openEdit(user: User) {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department ?? user.grade ?? "",
      phone: user.phone ?? "",
    });
    setEditOpen(true);
  }

  // Open delete dialog
  function openDelete(user: User) {
    setDeleteTarget(user);
    setDeleteOpen(true);
  }

  // Handle add user
  function handleAddUser() {
    setAlert({ type: "success", message: `User "${addForm.name}" created successfully.` });
    setAddForm({ name: "", email: "", role: "student", department: "", phone: "" });
    setAddOpen(false);
    setTimeout(() => setAlert(null), 4000);
  }

  // Handle edit user
  function handleEditUser() {
    setAlert({
      type: "success",
      message: `User "${editForm.name}" updated successfully.`,
    });
    setEditOpen(false);
    setEditUser(null);
    setTimeout(() => setAlert(null), 4000);
  }

  // Handle delete user
  function handleDeleteUser() {
    setAlert({
      type: "success",
      message: `User "${deleteTarget?.name}" deleted successfully.`,
    });
    setDeleteOpen(false);
    setDeleteTarget(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (deleteTarget) next.delete(deleteTarget.id);
      return next;
    });
    setTimeout(() => setAlert(null), 4000);
  }

  // Handle import
  function handleImport() {
    setAlert({
      type: "success",
      message: `${MOCK_CSV_PREVIEW.length} users imported successfully.`,
    });
    setImportOpen(false);
    setImportStep("upload");
    setTimeout(() => setAlert(null), 4000);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Management" />
        <LoadingState type="table" count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="User Management" description="Manage all school user accounts">
        {/* Add User Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <UserPlus className="size-4" />
                Add User
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={addForm.role}
                  onValueChange={(val) =>
                    setAddForm((f) => ({ ...f, role: val as UserRole }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  {addForm.role === "student" ? "Grade" : "Department"}
                </Label>
                <Input
                  placeholder={
                    addForm.role === "student"
                      ? "Enter grade level (e.g. 10)"
                      : "Enter department"
                  }
                  value={addForm.department}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="(555) 000-0000"
                  value={addForm.phone}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddUser} disabled={!addForm.name || !addForm.email}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import CSV Dialog */}
        <Dialog
          open={importOpen}
          onOpenChange={(open) => {
            setImportOpen(open);
            if (!open) setImportStep("upload");
          }}
        >
          <DialogTrigger
            render={
              <Button variant="outline" className="gap-2">
                <Upload className="size-4" />
                Import CSV
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Import Users from CSV</DialogTitle>
            </DialogHeader>

            {importStep === "upload" ? (
              <div className="space-y-4">
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => setImportStep("preview")}
                >
                  <FileSpreadsheet className="size-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV file with columns: Name, Email, Role, Department/Grade
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">CSV Format:</p>
                  <p>name,email,role,department_or_grade,phone</p>
                  <p className="mt-1">
                    Example: &quot;John Doe,john@school.edu,student,10,(555) 123-4567&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>
                    {MOCK_CSV_PREVIEW.length} records parsed successfully
                  </span>
                </div>
                <div className="max-h-60 overflow-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Dept/Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_CSV_PREVIEW.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {row.name}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] capitalize",
                                ROLE_BADGE_STYLES[row.role as UserRole]
                              )}
                            >
                              {row.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {row.grade ?? row.department ?? row.children ?? "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportStep("upload")}>
                    Back
                  </Button>
                  <Button onClick={handleImport}>
                    Import {MOCK_CSV_PREVIEW.length} Users
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Alert */}
      {alert && (
        <Alert
          className={cn(
            alert.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          )}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Role filter tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? "all")}>
        <TabsList>
          <TabsTrigger value="all">All ({roleCounts.all})</TabsTrigger>
          <TabsTrigger value="student">
            Students ({roleCounts.student})
          </TabsTrigger>
          <TabsTrigger value="teacher">
            Teachers ({roleCounts.teacher})
          </TabsTrigger>
          <TabsTrigger value="parent">
            Parents ({roleCounts.parent})
          </TabsTrigger>
          <TabsTrigger value="admin">Admins ({roleCounts.admin})</TabsTrigger>
        </TabsList>

        {/* Shared content for all tabs */}
        {["all", "student", "teacher", "parent", "admin"].map((tabVal) => (
          <TabsContent key={tabVal} value={tabVal}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {tabVal === "all" ? "All Users" : `${tabVal.charAt(0).toUpperCase() + tabVal.slice(1)}s`}
                  </span>
                  {selectedIds.size > 0 && (
                    <Badge variant="secondary">
                      {selectedIds.size} selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Table */}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={
                              filteredUsers.length > 0 &&
                              selectedIds.size === filteredUsers.length
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Dept / Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.has(user.id)}
                                onCheckedChange={() => toggleSelect(user.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar size="sm">
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] capitalize",
                                  ROLE_BADGE_STYLES[user.role]
                                )}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.department ??
                                (user.grade
                                  ? `Grade ${user.grade}`
                                  : "-")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px]"
                              >
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openEdit(user)}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openDelete(user)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(val) =>
                  setEditForm((f) => ({ ...f, role: val as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {editForm.role === "student" ? "Grade" : "Department"}
              </Label>
              <Input
                value={editForm.department}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, department: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {deleteTarget?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
