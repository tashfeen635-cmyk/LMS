import type { Grade } from '@/types';

// ============================================================================
// Mock Grades Data
// ============================================================================
// Grade records for students s1–s5 across their enrolled courses.
// Letter-grade scale: A (90–100), B (80–89), C (70–79), D (60–69), F (<60).
// ============================================================================

export const grades: Grade[] = [
  // ---------------------------------------------------------------------------
  // Student s1 – Sarah Chen
  // Courses: c1, c2, c4, c6, c7
  // ---------------------------------------------------------------------------
  {
    id: 'g1',
    studentId: 's1',
    courseId: 'c1',
    assignmentId: 'a1',
    score: 45,
    maxScore: 50,
    letterGrade: 'A',
    date: '2026-02-16',
    term: 'Spring 2026',
  },
  {
    id: 'g2',
    studentId: 's1',
    courseId: 'c1',
    assignmentId: 'a2',
    score: 28,
    maxScore: 30,
    letterGrade: 'A',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g3',
    studentId: 's1',
    courseId: 'c2',
    assignmentId: 'a7',
    score: 37,
    maxScore: 40,
    letterGrade: 'A',
    date: '2026-03-01',
    term: 'Spring 2026',
  },
  {
    id: 'g4',
    studentId: 's1',
    courseId: 'c4',
    assignmentId: 'a13',
    score: 18,
    maxScore: 20,
    letterGrade: 'A',
    date: '2026-02-19',
    term: 'Spring 2026',
  },
  {
    id: 'g5',
    studentId: 's1',
    courseId: 'c7',
    assignmentId: 'a11',
    score: 70,
    maxScore: 75,
    letterGrade: 'A',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g6',
    studentId: 's1',
    courseId: 'c1',
    assignmentId: 'a6',
    score: 82,
    maxScore: 100,
    letterGrade: 'B',
    date: '2025-11-15',
    term: 'Fall 2025',
  },
  {
    id: 'g7',
    studentId: 's1',
    courseId: 'c6',
    assignmentId: 'a10',
    score: 68,
    maxScore: 80,
    letterGrade: 'B',
    date: '2025-12-01',
    term: 'Fall 2025',
  },
  {
    id: 'g8',
    studentId: 's1',
    courseId: 'c7',
    assignmentId: 'a14',
    score: 35,
    maxScore: 40,
    letterGrade: 'B',
    date: '2025-11-20',
    term: 'Fall 2025',
  },

  // ---------------------------------------------------------------------------
  // Student s2 – Marcus Johnson
  // Courses: c1, c3, c4, c7, c8
  // ---------------------------------------------------------------------------
  {
    id: 'g9',
    studentId: 's2',
    courseId: 'c1',
    assignmentId: 'a1',
    score: 38,
    maxScore: 50,
    letterGrade: 'C',
    date: '2026-02-16',
    term: 'Spring 2026',
  },
  {
    id: 'g10',
    studentId: 's2',
    courseId: 'c3',
    assignmentId: 'a4',
    score: 68,
    maxScore: 75,
    letterGrade: 'A',
    date: '2026-02-26',
    term: 'Spring 2026',
  },
  {
    id: 'g11',
    studentId: 's2',
    courseId: 'c3',
    assignmentId: 'a8',
    score: 23,
    maxScore: 25,
    letterGrade: 'A',
    date: '2026-02-11',
    term: 'Spring 2026',
  },
  {
    id: 'g12',
    studentId: 's2',
    courseId: 'c4',
    assignmentId: 'a13',
    score: 16,
    maxScore: 20,
    letterGrade: 'B',
    date: '2026-02-19',
    term: 'Spring 2026',
  },
  {
    id: 'g13',
    studentId: 's2',
    courseId: 'c7',
    assignmentId: 'a11',
    score: 72,
    maxScore: 75,
    letterGrade: 'A',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g14',
    studentId: 's2',
    courseId: 'c1',
    assignmentId: 'a6',
    score: 71,
    maxScore: 100,
    letterGrade: 'C',
    date: '2025-11-15',
    term: 'Fall 2025',
  },
  {
    id: 'g15',
    studentId: 's2',
    courseId: 'c8',
    assignmentId: 'a12',
    score: 48,
    maxScore: 60,
    letterGrade: 'B',
    date: '2025-12-05',
    term: 'Fall 2025',
  },
  {
    id: 'g16',
    studentId: 's2',
    courseId: 'c7',
    assignmentId: 'a14',
    score: 30,
    maxScore: 40,
    letterGrade: 'C',
    date: '2025-11-20',
    term: 'Fall 2025',
  },

  // ---------------------------------------------------------------------------
  // Student s3 – Aisha Patel
  // Courses: c1, c2, c3, c5, c7
  // ---------------------------------------------------------------------------
  {
    id: 'g17',
    studentId: 's3',
    courseId: 'c1',
    assignmentId: 'a1',
    score: 50,
    maxScore: 50,
    letterGrade: 'A',
    date: '2026-02-16',
    term: 'Spring 2026',
  },
  {
    id: 'g18',
    studentId: 's3',
    courseId: 'c2',
    assignmentId: 'a7',
    score: 40,
    maxScore: 40,
    letterGrade: 'A',
    date: '2026-03-01',
    term: 'Spring 2026',
  },
  {
    id: 'g19',
    studentId: 's3',
    courseId: 'c3',
    assignmentId: 'a4',
    score: 74,
    maxScore: 75,
    letterGrade: 'A',
    date: '2026-02-26',
    term: 'Spring 2026',
  },
  {
    id: 'g20',
    studentId: 's3',
    courseId: 'c3',
    assignmentId: 'a8',
    score: 25,
    maxScore: 25,
    letterGrade: 'A',
    date: '2026-02-11',
    term: 'Spring 2026',
  },
  {
    id: 'g21',
    studentId: 's3',
    courseId: 'c7',
    assignmentId: 'a11',
    score: 75,
    maxScore: 75,
    letterGrade: 'A',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g22',
    studentId: 's3',
    courseId: 'c5',
    assignmentId: 'a9',
    score: 47,
    maxScore: 50,
    letterGrade: 'A',
    date: '2025-11-10',
    term: 'Fall 2025',
  },
  {
    id: 'g23',
    studentId: 's3',
    courseId: 'c1',
    assignmentId: 'a6',
    score: 95,
    maxScore: 100,
    letterGrade: 'A',
    date: '2025-11-15',
    term: 'Fall 2025',
  },
  {
    id: 'g24',
    studentId: 's3',
    courseId: 'c7',
    assignmentId: 'a14',
    score: 38,
    maxScore: 40,
    letterGrade: 'A',
    date: '2025-11-20',
    term: 'Fall 2025',
  },
  {
    id: 'g25',
    studentId: 's3',
    courseId: 'c2',
    assignmentId: 'a3',
    score: 92,
    maxScore: 100,
    letterGrade: 'A',
    date: '2025-12-10',
    term: 'Fall 2025',
  },

  // ---------------------------------------------------------------------------
  // Student s4 – Jake Williams
  // Courses: c1, c3, c4, c6, c8
  // ---------------------------------------------------------------------------
  {
    id: 'g26',
    studentId: 's4',
    courseId: 'c1',
    assignmentId: 'a2',
    score: 22,
    maxScore: 30,
    letterGrade: 'C',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g27',
    studentId: 's4',
    courseId: 'c3',
    assignmentId: 'a4',
    score: 60,
    maxScore: 75,
    letterGrade: 'B',
    date: '2026-02-26',
    term: 'Spring 2026',
  },
  {
    id: 'g28',
    studentId: 's4',
    courseId: 'c3',
    assignmentId: 'a8',
    score: 19,
    maxScore: 25,
    letterGrade: 'C',
    date: '2026-02-11',
    term: 'Spring 2026',
  },
  {
    id: 'g29',
    studentId: 's4',
    courseId: 'c4',
    assignmentId: 'a13',
    score: 20,
    maxScore: 20,
    letterGrade: 'A',
    date: '2026-02-19',
    term: 'Spring 2026',
  },
  {
    id: 'g30',
    studentId: 's4',
    courseId: 'c8',
    assignmentId: 'a12',
    score: 42,
    maxScore: 60,
    letterGrade: 'C',
    date: '2026-03-10',
    term: 'Spring 2026',
  },
  {
    id: 'g31',
    studentId: 's4',
    courseId: 'c1',
    assignmentId: 'a6',
    score: 64,
    maxScore: 100,
    letterGrade: 'D',
    date: '2025-11-15',
    term: 'Fall 2025',
  },
  {
    id: 'g32',
    studentId: 's4',
    courseId: 'c6',
    assignmentId: 'a10',
    score: 72,
    maxScore: 80,
    letterGrade: 'A',
    date: '2025-12-01',
    term: 'Fall 2025',
  },
  {
    id: 'g33',
    studentId: 's4',
    courseId: 'c4',
    assignmentId: 'a5',
    score: 85,
    maxScore: 100,
    letterGrade: 'B',
    date: '2025-12-15',
    term: 'Fall 2025',
  },

  // ---------------------------------------------------------------------------
  // Student s5 – Emma Rodriguez
  // Courses: c1, c2, c4, c5, c7, c8
  // ---------------------------------------------------------------------------
  {
    id: 'g34',
    studentId: 's5',
    courseId: 'c2',
    assignmentId: 'a7',
    score: 34,
    maxScore: 40,
    letterGrade: 'B',
    date: '2026-03-01',
    term: 'Spring 2026',
  },
  {
    id: 'g35',
    studentId: 's5',
    courseId: 'c4',
    assignmentId: 'a13',
    score: 17,
    maxScore: 20,
    letterGrade: 'B',
    date: '2026-02-19',
    term: 'Spring 2026',
  },
  {
    id: 'g36',
    studentId: 's5',
    courseId: 'c7',
    assignmentId: 'a11',
    score: 65,
    maxScore: 75,
    letterGrade: 'B',
    date: '2026-02-21',
    term: 'Spring 2026',
  },
  {
    id: 'g37',
    studentId: 's5',
    courseId: 'c1',
    assignmentId: 'a1',
    score: 41,
    maxScore: 50,
    letterGrade: 'B',
    date: '2026-02-16',
    term: 'Spring 2026',
  },
  {
    id: 'g38',
    studentId: 's5',
    courseId: 'c5',
    assignmentId: 'a9',
    score: 32,
    maxScore: 50,
    letterGrade: 'D',
    date: '2026-03-05',
    term: 'Spring 2026',
  },
  {
    id: 'g39',
    studentId: 's5',
    courseId: 'c8',
    assignmentId: 'a12',
    score: 55,
    maxScore: 60,
    letterGrade: 'A',
    date: '2025-12-05',
    term: 'Fall 2025',
  },
  {
    id: 'g40',
    studentId: 's5',
    courseId: 'c1',
    assignmentId: 'a6',
    score: 77,
    maxScore: 100,
    letterGrade: 'C',
    date: '2025-11-15',
    term: 'Fall 2025',
  },
  {
    id: 'g41',
    studentId: 's5',
    courseId: 'c7',
    assignmentId: 'a14',
    score: 28,
    maxScore: 40,
    letterGrade: 'C',
    date: '2025-11-20',
    term: 'Fall 2025',
  },
  {
    id: 'g42',
    studentId: 's5',
    courseId: 'c2',
    assignmentId: 'a3',
    score: 78,
    maxScore: 100,
    letterGrade: 'C',
    date: '2025-12-10',
    term: 'Fall 2025',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Return every grade record for a given student.
 */
export function getGradesByStudent(studentId: string): Grade[] {
  return grades.filter((grade) => grade.studentId === studentId);
}

/**
 * Return every grade record for a given course.
 */
export function getGradesByCourse(courseId: string): Grade[] {
  return grades.filter((grade) => grade.courseId === courseId);
}

/**
 * Return every grade record for a specific student in a specific course.
 */
export function getGradesByStudentAndCourse(
  studentId: string,
  courseId: string,
): Grade[] {
  return grades.filter(
    (grade) => grade.studentId === studentId && grade.courseId === courseId,
  );
}

/**
 * Calculate GPA on a 4.0 scale from an array of grade records.
 *
 * Conversion:
 *   A  = 4.0
 *   B  = 3.0
 *   C  = 2.0
 *   D  = 1.0
 *   F  = 0.0
 *
 * Returns 0 when the input array is empty.
 */
export function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;

  const scaleMap: Record<string, number> = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };

  const totalPoints = grades.reduce((sum, grade) => {
    const points = scaleMap[grade.letterGrade] ?? 0;
    return sum + points;
  }, 0);

  return Math.round((totalPoints / grades.length) * 100) / 100;
}
