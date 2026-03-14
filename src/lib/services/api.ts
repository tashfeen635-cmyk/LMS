import {
  users,
  getUserById,
  getUsersByRole,
  courses,
  getCourseById,
  getCoursesByTeacher,
  getCoursesByStudent,
  assignments,
  getAssignmentById,
  getAssignmentsByCourse,
  grades,
  getGradesByStudent,
  getGradesByCourse,
  getGradesByStudentAndCourse,
  getAttendanceByStudent,
  getAttendanceByCourse,
  getThreadsByUser,
  getMessagesByThread,
  getNotificationsByUser,
  announcements,
  getAnnouncementsByRole,
} from '@/lib/mock-data';

import type {
  User,
  UserRole,
  Course,
  Assignment,
  Grade,
  Attendance,
  MessageThread,
  Message,
  Notification,
  Announcement,
} from '@/types';

// ============================================================================
// Simulated network delay
// ============================================================================

function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 100));
}

// ============================================================================
// Users
// ============================================================================

export async function fetchCurrentUser(userId: string): Promise<User | undefined> {
  await delay();
  return getUserById(userId);
}

export async function fetchUsers(): Promise<User[]> {
  await delay();
  return users;
}

export async function fetchUsersByRole(role: UserRole): Promise<User[]> {
  await delay();
  return getUsersByRole(role);
}

// ============================================================================
// Courses
// ============================================================================

export async function fetchCourses(): Promise<Course[]> {
  await delay();
  return courses;
}

export async function fetchCourseById(id: string): Promise<Course | undefined> {
  await delay();
  return getCourseById(id);
}

export async function fetchCoursesByTeacher(teacherId: string): Promise<Course[]> {
  await delay();
  return getCoursesByTeacher(teacherId);
}

export async function fetchCoursesByStudent(studentId: string): Promise<Course[]> {
  await delay();
  return getCoursesByStudent(studentId);
}

// ============================================================================
// Assignments
// ============================================================================

export async function fetchAssignments(): Promise<Assignment[]> {
  await delay();
  return assignments;
}

export async function fetchAssignmentById(id: string): Promise<Assignment | undefined> {
  await delay();
  return getAssignmentById(id);
}

export async function fetchAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
  await delay();
  return getAssignmentsByCourse(courseId);
}

// ============================================================================
// Grades
// ============================================================================

export async function fetchGradesByStudent(studentId: string): Promise<Grade[]> {
  await delay();
  return getGradesByStudent(studentId);
}

export async function fetchGradesByCourse(courseId: string): Promise<Grade[]> {
  await delay();
  return getGradesByCourse(courseId);
}

export async function fetchGradesByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<Grade[]> {
  await delay();
  return getGradesByStudentAndCourse(studentId, courseId);
}

// ============================================================================
// Attendance
// ============================================================================

export async function fetchAttendanceByStudent(studentId: string): Promise<Attendance[]> {
  await delay();
  return getAttendanceByStudent(studentId);
}

export async function fetchAttendanceByCourse(courseId: string): Promise<Attendance[]> {
  await delay();
  return getAttendanceByCourse(courseId);
}

// ============================================================================
// Messages
// ============================================================================

export async function fetchThreadsByUser(userId: string): Promise<MessageThread[]> {
  await delay();
  return getThreadsByUser(userId);
}

export async function fetchMessagesByThread(threadId: string): Promise<Message[]> {
  await delay();
  return getMessagesByThread(threadId);
}

// ============================================================================
// Notifications
// ============================================================================

export async function fetchNotificationsByUser(userId: string): Promise<Notification[]> {
  await delay();
  return getNotificationsByUser(userId);
}

// ============================================================================
// Announcements
// ============================================================================

export async function fetchAnnouncements(): Promise<Announcement[]> {
  await delay();
  return announcements;
}

export async function fetchAnnouncementsByRole(role: UserRole): Promise<Announcement[]> {
  await delay();
  return getAnnouncementsByRole(role);
}
