"use client";

import { useQuery } from '@tanstack/react-query';
import * as api from './api';
import type { UserRole } from '@/types';

// ============================================================================
// Users
// ============================================================================

export function useCurrentUser(userId: string | null) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.fetchCurrentUser(userId!),
    enabled: !!userId,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.fetchUsers,
  });
}

export function useUsersByRole(role: UserRole) {
  return useQuery({
    queryKey: ['users', 'role', role],
    queryFn: () => api.fetchUsersByRole(role),
  });
}

// ============================================================================
// Courses
// ============================================================================

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: api.fetchCourses,
  });
}

export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => api.fetchCourseById(id!),
    enabled: !!id,
  });
}

export function useCoursesByTeacher(teacherId: string | null) {
  return useQuery({
    queryKey: ['courses', 'teacher', teacherId],
    queryFn: () => api.fetchCoursesByTeacher(teacherId!),
    enabled: !!teacherId,
  });
}

export function useCoursesByStudent(studentId: string | null) {
  return useQuery({
    queryKey: ['courses', 'student', studentId],
    queryFn: () => api.fetchCoursesByStudent(studentId!),
    enabled: !!studentId,
  });
}

// ============================================================================
// Assignments
// ============================================================================

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: api.fetchAssignments,
  });
}

export function useAssignment(id: string | null) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => api.fetchAssignmentById(id!),
    enabled: !!id,
  });
}

export function useAssignmentsByCourse(courseId: string | null) {
  return useQuery({
    queryKey: ['assignments', 'course', courseId],
    queryFn: () => api.fetchAssignmentsByCourse(courseId!),
    enabled: !!courseId,
  });
}

// ============================================================================
// Grades
// ============================================================================

export function useGradesByStudent(studentId: string | null) {
  return useQuery({
    queryKey: ['grades', 'student', studentId],
    queryFn: () => api.fetchGradesByStudent(studentId!),
    enabled: !!studentId,
  });
}

export function useGradesByCourse(courseId: string | null) {
  return useQuery({
    queryKey: ['grades', 'course', courseId],
    queryFn: () => api.fetchGradesByCourse(courseId!),
    enabled: !!courseId,
  });
}

export function useGradesByStudentAndCourse(studentId: string | null, courseId: string | null) {
  return useQuery({
    queryKey: ['grades', 'student', studentId, 'course', courseId],
    queryFn: () => api.fetchGradesByStudentAndCourse(studentId!, courseId!),
    enabled: !!studentId && !!courseId,
  });
}

// ============================================================================
// Attendance
// ============================================================================

export function useAttendanceByStudent(studentId: string | null) {
  return useQuery({
    queryKey: ['attendance', 'student', studentId],
    queryFn: () => api.fetchAttendanceByStudent(studentId!),
    enabled: !!studentId,
  });
}

export function useAttendanceByCourse(courseId: string | null) {
  return useQuery({
    queryKey: ['attendance', 'course', courseId],
    queryFn: () => api.fetchAttendanceByCourse(courseId!),
    enabled: !!courseId,
  });
}

// ============================================================================
// Messages
// ============================================================================

export function useThreadsByUser(userId: string | null) {
  return useQuery({
    queryKey: ['threads', userId],
    queryFn: () => api.fetchThreadsByUser(userId!),
    enabled: !!userId,
  });
}

export function useMessagesByThread(threadId: string | null) {
  return useQuery({
    queryKey: ['messages', 'thread', threadId],
    queryFn: () => api.fetchMessagesByThread(threadId!),
    enabled: !!threadId,
  });
}

// ============================================================================
// Notifications
// ============================================================================

export function useNotificationsByUser(userId: string | null) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => api.fetchNotificationsByUser(userId!),
    enabled: !!userId,
  });
}

// ============================================================================
// Announcements
// ============================================================================

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: api.fetchAnnouncements,
  });
}

export function useAnnouncementsByRole(role: UserRole | null) {
  return useQuery({
    queryKey: ['announcements', 'role', role],
    queryFn: () => api.fetchAnnouncementsByRole(role!),
    enabled: !!role,
  });
}
