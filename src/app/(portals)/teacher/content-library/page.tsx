"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  Video,
  Link2,
  Presentation,
  File,
  FolderOpen,
  Calendar,
  HardDrive,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import EmptyState from "@/components/shared/empty-state";
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
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResourceType = "document" | "video" | "link" | "presentation";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  uploadDate: string;
  fileSize: string;
  tags: string[];
  description?: string;
}

// ---------------------------------------------------------------------------
// Mock Resources
// ---------------------------------------------------------------------------

const MOCK_RESOURCES: Resource[] = [
  {
    id: "r1",
    title: "Algebra Chapter 5 Notes",
    type: "document",
    uploadDate: "2026-02-10T10:00:00Z",
    fileSize: "2.4 MB",
    tags: ["Math", "Algebra II", "Chapter 5"],
    description: "Comprehensive notes covering systems of equations.",
  },
  {
    id: "r2",
    title: "Chemistry Lab Safety Video",
    type: "video",
    uploadDate: "2026-01-15T14:30:00Z",
    fileSize: "145 MB",
    tags: ["Chemistry", "Lab", "Safety"],
    description: "Mandatory safety training video for all lab sessions.",
  },
  {
    id: "r3",
    title: "World War II Timeline",
    type: "presentation",
    uploadDate: "2026-02-20T09:00:00Z",
    fileSize: "18.7 MB",
    tags: ["History", "WWII", "Timeline"],
    description: "Interactive timeline of major WWII events from 1939-1945.",
  },
  {
    id: "r4",
    title: "Shakespeare Analysis Guide",
    type: "document",
    uploadDate: "2026-02-28T11:00:00Z",
    fileSize: "1.1 MB",
    tags: ["English", "Shakespeare", "Essay Guide"],
    description: "Guide for analyzing Shakespeare plays with essay prompts.",
  },
  {
    id: "r5",
    title: "Physics Simulation - Newton's Laws",
    type: "link",
    uploadDate: "2026-03-01T08:30:00Z",
    fileSize: "--",
    tags: ["Physics", "Simulation", "Newton"],
    description: "Interactive PhET simulation for Newton's laws of motion.",
  },
  {
    id: "r6",
    title: "Periodic Table Study Sheet",
    type: "document",
    uploadDate: "2026-01-28T16:00:00Z",
    fileSize: "540 KB",
    tags: ["Chemistry", "Periodic Table", "Study Guide"],
    description: "Color-coded periodic table with trends and key properties.",
  },
  {
    id: "r7",
    title: "Calculus Derivatives Review",
    type: "presentation",
    uploadDate: "2026-03-05T10:15:00Z",
    fileSize: "8.3 MB",
    tags: ["Math", "Calculus", "Derivatives"],
    description: "Slide deck reviewing power, product, quotient, and chain rules.",
  },
  {
    id: "r8",
    title: "Creative Writing Workshop Recording",
    type: "video",
    uploadDate: "2026-02-14T13:00:00Z",
    fileSize: "320 MB",
    tags: ["English", "Creative Writing", "Workshop"],
    description: "Recording of the guest author workshop on narrative structure.",
  },
  {
    id: "r9",
    title: "US Constitution Primary Source",
    type: "link",
    uploadDate: "2026-03-08T07:45:00Z",
    fileSize: "--",
    tags: ["History", "Government", "Constitution"],
    description: "National Archives link to the original Constitution text.",
  },
  {
    id: "r10",
    title: "Wave Motion Problem Set Solutions",
    type: "document",
    uploadDate: "2026-03-10T15:30:00Z",
    fileSize: "3.2 MB",
    tags: ["Physics", "Waves", "Solutions"],
    description: "Detailed solutions for the wave motion problem set.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getResourceIcon(type: ResourceType) {
  switch (type) {
    case "document":
      return <FileText className="size-6 text-blue-500" />;
    case "video":
      return <Video className="size-6 text-red-500" />;
    case "link":
      return <Link2 className="size-6 text-emerald-500" />;
    case "presentation":
      return <Presentation className="size-6 text-amber-500" />;
  }
}

function getTypeBadgeColor(type: ResourceType): string {
  switch (type) {
    case "document":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "video":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    case "link":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    case "presentation":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeacherContentLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<ResourceType>("document");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");

  // Local resources (server mock + newly uploaded)
  const [localResources, setLocalResources] = useState<Resource[]>([]);

  const allResources = useMemo(
    () => [...MOCK_RESOURCES, ...localResources],
    [localResources]
  );

  // Filter by type and search
  const filteredResources = useMemo(() => {
    let resources = allResources;

    // Filter by tab/type
    if (activeTab !== "all") {
      const typeMap: Record<string, ResourceType> = {
        documents: "document",
        videos: "video",
        links: "link",
        presentations: "presentation",
      };
      const filterType = typeMap[activeTab];
      if (filterType) {
        resources = resources.filter((r) => r.type === filterType);
      }
    }

    // Filter by search
    const q = search.toLowerCase().trim();
    if (q) {
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sort by upload date (newest first)
    return [...resources].sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }, [allResources, activeTab, search]);

  // Type counts for tab badges
  const typeCounts = useMemo(() => {
    return {
      all: allResources.length,
      documents: allResources.filter((r) => r.type === "document").length,
      videos: allResources.filter((r) => r.type === "video").length,
      links: allResources.filter((r) => r.type === "link").length,
      presentations: allResources.filter((r) => r.type === "presentation")
        .length,
    };
  }, [allResources]);

  // Handle upload submit
  function handleUpload() {
    if (!uploadTitle.trim()) return;

    const newResource: Resource = {
      id: `local-${Date.now()}`,
      title: uploadTitle.trim(),
      type: uploadType,
      uploadDate: new Date().toISOString(),
      fileSize: "1.0 MB",
      tags: uploadTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: uploadDescription.trim() || undefined,
    };

    setLocalResources((prev) => [...prev, newResource]);

    // Reset form
    setUploadTitle("");
    setUploadType("document");
    setUploadDescription("");
    setUploadTags("");
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Content Library"
        description="Manage and organize your teaching resources"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Upload className="size-4" />
                Upload Resource
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
              <DialogDescription>
                Add a new resource to your content library
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="resource-title">Title</Label>
                <Input
                  id="resource-title"
                  placeholder="e.g. Chapter 6 Study Guide"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select
                  value={uploadType}
                  onValueChange={(val) =>
                    setUploadType(val as ResourceType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="resource-desc">Description</Label>
                <Textarea
                  id="resource-desc"
                  placeholder="Brief description of this resource..."
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              {/* File upload (mock) */}
              <div className="space-y-2">
                <Label>File</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-6">
                  <div className="text-center">
                    <Upload className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, PPTX, MP4 up to 500MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="resource-tags">
                  Tags{" "}
                  <span className="text-muted-foreground">(comma separated)</span>
                </Label>
                <Input
                  id="resource-tags"
                  placeholder="e.g. Math, Chapter 6, Study Guide"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleUpload}
                disabled={!uploadTitle.trim()}
              >
                Upload Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Type tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? "all")}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-1.5">
              {typeCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            <Badge variant="secondary" className="ml-1.5">
              {typeCounts.documents}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="videos">
            Videos
            <Badge variant="secondary" className="ml-1.5">
              {typeCounts.videos}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="links">
            Links
            <Badge variant="secondary" className="ml-1.5">
              {typeCounts.links}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="presentations">
            Presentations
            <Badge variant="secondary" className="ml-1.5">
              {typeCounts.presentations}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* All tabs share the same filtered grid content */}
        {["all", "documents", "videos", "links", "presentations"].map(
          (tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <div className="pt-4">
                {filteredResources.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className="size-6" />}
                    title={
                      search
                        ? "No matching resources"
                        : "No resources in this category"
                    }
                    description={
                      search
                        ? "Try a different search term."
                        : "Upload your first resource to get started."
                    }
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="transition-shadow hover:shadow-md"
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-sm">
                                {resource.title}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className={`mt-1 border-transparent text-[10px] capitalize ${getTypeBadgeColor(resource.type)}`}
                              >
                                {resource.type}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {resource.description && (
                            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                              {resource.description}
                            </p>
                          )}

                          {/* Meta info */}
                          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="size-3" />
                              {formatDate(resource.uploadDate)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <HardDrive className="size-3" />
                              {resource.fileSize}
                            </span>
                          </div>

                          {/* Tags */}
                          {resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
