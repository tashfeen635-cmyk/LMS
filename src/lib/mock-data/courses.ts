import { Course } from '@/types';

export const courses: Course[] = [
  {
    id: 'c1',
    name: 'Algebra II',
    code: 'MATH-201',
    description:
      'A continuation of Algebra I, this course covers advanced algebraic concepts including polynomial functions, rational expressions, logarithmic and exponential equations, sequences and series, and an introduction to conic sections. Students will develop strong problem-solving skills and build the analytical foundation needed for pre-calculus.',
    teacherId: 't1',
    color: '#3b82f6',
    students: ['s1', 's2', 's3', 's4', 's5'],
    schedule: [
      { day: 'Monday', startTime: '08:00', endTime: '08:50', room: 'Room 201' },
      { day: 'Wednesday', startTime: '08:00', endTime: '08:50', room: 'Room 201' },
      { day: 'Friday', startTime: '08:00', endTime: '08:50', room: 'Room 201' },
    ],
  },
  {
    id: 'c2',
    name: 'English Literature',
    code: 'ENG-301',
    description:
      'An in-depth survey of British and American literature from the Renaissance to the modern era. Students will read and analyze major works of fiction, poetry, and drama, exploring themes of identity, social justice, and the human condition. Emphasis is placed on critical reading, literary analysis essays, and seminar-style discussion.',
    teacherId: 't2',
    color: '#8b5cf6',
    students: ['s1', 's3', 's5'],
    schedule: [
      { day: 'Tuesday', startTime: '09:00', endTime: '10:15', room: 'Room 105' },
      { day: 'Thursday', startTime: '09:00', endTime: '10:15', room: 'Room 105' },
    ],
  },
  {
    id: 'c3',
    name: 'AP Chemistry',
    code: 'SCI-401',
    description:
      'This college-level chemistry course prepares students for the AP Chemistry exam. Topics include atomic structure, intermolecular forces, chemical kinetics, thermodynamics, equilibrium, and electrochemistry. The course features weekly laboratory investigations that reinforce theoretical concepts and develop scientific inquiry skills.',
    teacherId: 't3',
    color: '#10b981',
    students: ['s2', 's3', 's4'],
    schedule: [
      { day: 'Monday', startTime: '10:00', endTime: '11:15', room: 'Room 302' },
      { day: 'Wednesday', startTime: '10:00', endTime: '11:15', room: 'Room 302' },
    ],
  },
  {
    id: 'c4',
    name: 'World History',
    code: 'HIST-201',
    description:
      'A comprehensive study of world civilizations from ancient Mesopotamia through the contemporary era. Students examine the political, economic, social, and cultural developments that have shaped the modern world, with particular attention to cross-cultural interactions, the rise and fall of empires, and the forces driving global change.',
    teacherId: 't4',
    color: '#f59e0b',
    students: ['s1', 's2', 's4', 's5'],
    schedule: [
      { day: 'Tuesday', startTime: '11:00', endTime: '11:50', room: 'Room 210' },
      { day: 'Thursday', startTime: '11:00', endTime: '11:50', room: 'Room 210' },
    ],
  },
  {
    id: 'c5',
    name: 'Calculus I',
    code: 'MATH-301',
    description:
      'An introductory calculus course covering limits, continuity, derivatives, and integrals of single-variable functions. Students explore real-world applications of differentiation and integration including rate-of-change problems, optimization, and area under curves. This course is ideal for students pursuing STEM fields in college.',
    teacherId: 't1',
    color: '#6366f1',
    students: ['s3', 's5'],
    schedule: [
      { day: 'Tuesday', startTime: '08:00', endTime: '09:15', room: 'Room 201' },
      { day: 'Thursday', startTime: '08:00', endTime: '09:15', room: 'Room 201' },
    ],
  },
  {
    id: 'c6',
    name: 'Creative Writing',
    code: 'ENG-201',
    description:
      'A workshop-based course designed to help students find and refine their unique voice as writers. Students experiment with multiple genres including short fiction, personal essays, poetry, and creative nonfiction. Peer review sessions, writing exercises, and author studies provide a supportive environment for developing craft and storytelling techniques.',
    teacherId: 't2',
    color: '#ec4899',
    students: ['s1', 's4'],
    schedule: [
      { day: 'Monday', startTime: '13:00', endTime: '13:50', room: 'Room 105' },
      { day: 'Wednesday', startTime: '13:00', endTime: '13:50', room: 'Room 105' },
    ],
  },
  {
    id: 'c7',
    name: 'Physics',
    code: 'SCI-301',
    description:
      'A rigorous introduction to classical mechanics, waves, and thermodynamics. Through a combination of lectures, problem sets, and hands-on laboratory experiments, students learn to model physical systems using Newton\'s laws, conservation principles, and energy analysis. Strong algebra and trigonometry skills are recommended.',
    teacherId: 't3',
    color: '#14b8a6',
    students: ['s1', 's2', 's3', 's5'],
    schedule: [
      { day: 'Monday', startTime: '14:00', endTime: '14:50', room: 'Room 303' },
      { day: 'Wednesday', startTime: '14:00', endTime: '14:50', room: 'Room 303' },
      { day: 'Friday', startTime: '14:00', endTime: '14:50', room: 'Room 303' },
    ],
  },
  {
    id: 'c8',
    name: 'US Government',
    code: 'HIST-301',
    description:
      'An exploration of the principles, institutions, and processes of American government. Students study the Constitution, federalism, the three branches of government, civil liberties, and the role of political parties and elections. Current events and landmark Supreme Court cases are woven throughout the curriculum to connect theory with practice.',
    teacherId: 't4',
    color: '#f97316',
    students: ['s2', 's4', 's5'],
    schedule: [
      { day: 'Tuesday', startTime: '13:00', endTime: '14:15', room: 'Room 211' },
      { day: 'Thursday', startTime: '13:00', endTime: '14:15', room: 'Room 211' },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getCoursesByTeacher(teacherId: string): Course[] {
  return courses.filter((course) => course.teacherId === teacherId);
}

export function getCoursesByStudent(studentId: string): Course[] {
  return courses.filter((course) => course.students.includes(studentId));
}
