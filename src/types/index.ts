// ============================================================================
// School LMS - Domain Type Definitions
// ============================================================================
// All date fields are ISO 8601 strings (e.g. "2026-03-12T08:00:00Z").
// ============================================================================

// ---------------------------------------------------------------------------
// Enums & Literal Unions
// ---------------------------------------------------------------------------

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type AssignmentType = 'homework' | 'quiz' | 'test' | 'project' | 'essay';

export type AssignmentStatus = 'draft' | 'published' | 'graded';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

export type CalendarEventType =
  | 'class'
  | 'assignment'
  | 'exam'
  | 'event'
  | 'meeting'
  | 'holiday';

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  grade?: string;
  children?: string[];
  phone?: string;
}

export interface ScheduleSlot {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  schedule: ScheduleSlot[];
  students: string[];
  color: string;
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Assignments & Submissions
// ---------------------------------------------------------------------------

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  type: AssignmentType;
  points: number;
  status: AssignmentStatus;
  attachments?: string[];
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
}

// ---------------------------------------------------------------------------
// Grades
// ---------------------------------------------------------------------------

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assignmentId: string;
  score: number;
  maxScore: number;
  letterGrade: string;
  date: string;
  term: string;
}

export type GradingScale = {
  letter: string;
  minScore: number;
  maxScore: number;
  gpa: number;
}[];

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  threadId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  participants: string[];
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// ---------------------------------------------------------------------------
// Notifications & Announcements
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  priority: AnnouncementPriority;
  pinned: boolean;
  createdAt: string;
  expiresAt?: string;
  targetRoles: UserRole[];
}

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: CalendarEventType;
  courseId?: string;
  color?: string;
}

// ---------------------------------------------------------------------------
// Administration
// ---------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  current: boolean;
}
