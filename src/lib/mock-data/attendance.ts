import type { Attendance } from '@/types';

// ============================================================================
// Mock Attendance Data
// ============================================================================
// Attendance records for students s1–s5 across courses c1–c8.
// Dates span February–March 2026.
// ============================================================================

export const attendance: Attendance[] = [
  // ---------------------------------------------------------------------------
  // February 2026
  // ---------------------------------------------------------------------------
  {
    id: 'att1',
    studentId: 's1',
    courseId: 'c1',
    date: '2026-02-02',
    status: 'present',
  },
  {
    id: 'att2',
    studentId: 's2',
    courseId: 'c1',
    date: '2026-02-02',
    status: 'present',
  },
  {
    id: 'att3',
    studentId: 's3',
    courseId: 'c1',
    date: '2026-02-02',
    status: 'late',
    note: 'Arrived 10 minutes after class started.',
  },
  {
    id: 'att4',
    studentId: 's4',
    courseId: 'c3',
    date: '2026-02-04',
    status: 'present',
  },
  {
    id: 'att5',
    studentId: 's2',
    courseId: 'c3',
    date: '2026-02-04',
    status: 'absent',
    note: 'No notification received.',
  },
  {
    id: 'att6',
    studentId: 's5',
    courseId: 'c2',
    date: '2026-02-06',
    status: 'present',
  },
  {
    id: 'att7',
    studentId: 's1',
    courseId: 'c2',
    date: '2026-02-06',
    status: 'present',
  },
  {
    id: 'att8',
    studentId: 's3',
    courseId: 'c5',
    date: '2026-02-10',
    status: 'present',
  },
  {
    id: 'att9',
    studentId: 's5',
    courseId: 'c4',
    date: '2026-02-11',
    status: 'excused',
    note: 'Family emergency — parent contacted the office.',
  },
  {
    id: 'att10',
    studentId: 's1',
    courseId: 'c7',
    date: '2026-02-12',
    status: 'present',
  },
  {
    id: 'att11',
    studentId: 's2',
    courseId: 'c7',
    date: '2026-02-12',
    status: 'late',
    note: 'Bus arrived late due to weather.',
  },
  {
    id: 'att12',
    studentId: 's3',
    courseId: 'c7',
    date: '2026-02-12',
    status: 'present',
  },
  {
    id: 'att13',
    studentId: 's4',
    courseId: 'c6',
    date: '2026-02-17',
    status: 'present',
  },
  {
    id: 'att14',
    studentId: 's1',
    courseId: 'c6',
    date: '2026-02-17',
    status: 'absent',
    note: 'Sick — email from parent received.',
  },
  {
    id: 'att15',
    studentId: 's4',
    courseId: 'c8',
    date: '2026-02-18',
    status: 'present',
  },
  {
    id: 'att16',
    studentId: 's2',
    courseId: 'c8',
    date: '2026-02-18',
    status: 'present',
  },
  {
    id: 'att17',
    studentId: 's5',
    courseId: 'c8',
    date: '2026-02-18',
    status: 'late',
    note: 'Arrived 5 minutes late from previous class.',
  },
  {
    id: 'att18',
    studentId: 's3',
    courseId: 'c3',
    date: '2026-02-24',
    status: 'present',
  },
  {
    id: 'att19',
    studentId: 's4',
    courseId: 'c4',
    date: '2026-02-25',
    status: 'excused',
    note: 'Doctor appointment — note on file.',
  },
  {
    id: 'att20',
    studentId: 's1',
    courseId: 'c4',
    date: '2026-02-25',
    status: 'present',
  },

  // ---------------------------------------------------------------------------
  // March 2026
  // ---------------------------------------------------------------------------
  {
    id: 'att21',
    studentId: 's2',
    courseId: 'c4',
    date: '2026-03-03',
    status: 'present',
  },
  {
    id: 'att22',
    studentId: 's5',
    courseId: 'c7',
    date: '2026-03-04',
    status: 'absent',
    note: 'Unexcused absence.',
  },
  {
    id: 'att23',
    studentId: 's1',
    courseId: 'c1',
    date: '2026-03-05',
    status: 'present',
  },
  {
    id: 'att24',
    studentId: 's3',
    courseId: 'c2',
    date: '2026-03-06',
    status: 'present',
  },
  {
    id: 'att25',
    studentId: 's4',
    courseId: 'c1',
    date: '2026-03-05',
    status: 'late',
    note: 'Tardy bell — 2 minutes late.',
  },
  {
    id: 'att26',
    studentId: 's2',
    courseId: 'c1',
    date: '2026-03-05',
    status: 'present',
  },
  {
    id: 'att27',
    studentId: 's5',
    courseId: 'c5',
    date: '2026-03-10',
    status: 'present',
  },
  {
    id: 'att28',
    studentId: 's3',
    courseId: 'c3',
    date: '2026-03-10',
    status: 'excused',
    note: 'Field trip with history class.',
  },
  {
    id: 'att29',
    studentId: 's1',
    courseId: 'c7',
    date: '2026-03-11',
    status: 'present',
  },
  {
    id: 'att30',
    studentId: 's4',
    courseId: 'c3',
    date: '2026-03-10',
    status: 'absent',
    note: 'No call or email received.',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Return every attendance record for a given student.
 */
export function getAttendanceByStudent(studentId: string): Attendance[] {
  return attendance.filter((record) => record.studentId === studentId);
}

/**
 * Return every attendance record for a given course.
 */
export function getAttendanceByCourse(courseId: string): Attendance[] {
  return attendance.filter((record) => record.courseId === courseId);
}

/**
 * Return every attendance record for a given date (ISO date string, e.g. "2026-03-05").
 */
export function getAttendanceByDate(date: string): Attendance[] {
  return attendance.filter((record) => record.date === date);
}
