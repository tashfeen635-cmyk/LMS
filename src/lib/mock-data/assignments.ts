import type { Assignment, AssignmentStatus, Submission } from '@/types';

// ============================================================================
// Mock Assignments Data
// ============================================================================

export const assignments: Assignment[] = [
  // ---------------------------------------------------------------------------
  // Course c1 – Algebra II
  // ---------------------------------------------------------------------------
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Quadratic Equations Practice',
    description:
      'Complete problems 1-30 on quadratic equations. Show all work including factoring, completing the square, and the quadratic formula. Graphs should be drawn on graph paper or created digitally.',
    dueDate: '2026-02-15T23:59:00Z',
    type: 'homework',
    points: 50,
    status: 'graded',
    submissions: [
      {
        id: 'sub1',
        assignmentId: 'a1',
        studentId: 's1',
        submittedAt: '2026-02-14T18:30:00Z',
        content: 'Completed all 30 problems with work shown.',
        grade: 45,
        feedback: 'Great work! Minor error on problem 22 — check your sign when factoring.',
      },
      {
        id: 'sub2',
        assignmentId: 'a1',
        studentId: 's2',
        submittedAt: '2026-02-15T21:10:00Z',
        content: 'All problems attempted.',
        grade: 38,
        feedback: 'Good effort. Review the quadratic formula — several computational errors in Section C.',
      },
      {
        id: 'sub3',
        assignmentId: 'a1',
        studentId: 's3',
        submittedAt: '2026-02-13T16:45:00Z',
        content: 'Problems 1-30 completed with all steps.',
        grade: 50,
        feedback: 'Perfect score. Excellent and thorough work throughout.',
      },
    ],
  },
  {
    id: 'a2',
    courseId: 'c1',
    title: 'Chapter 5 Quiz',
    description:
      'Timed quiz covering Chapter 5 topics: systems of linear equations, substitution method, and elimination method. 15 multiple-choice questions and 5 short-answer problems. You will have 40 minutes to complete the quiz.',
    dueDate: '2026-02-20T23:59:00Z',
    type: 'quiz',
    points: 30,
    status: 'graded',
    submissions: [
      {
        id: 'sub4',
        assignmentId: 'a2',
        studentId: 's1',
        submittedAt: '2026-02-20T09:35:00Z',
        grade: 28,
        feedback: 'Excellent understanding of elimination. One careless error on question 18.',
      },
      {
        id: 'sub5',
        assignmentId: 'a2',
        studentId: 's4',
        submittedAt: '2026-02-20T09:38:00Z',
        grade: 22,
        feedback: 'Substitution method needs more practice. See me during office hours.',
      },
    ],
  },
  {
    id: 'a6',
    courseId: 'c1',
    title: 'Polynomial Functions Test',
    description:
      'Comprehensive test on polynomial functions including end behavior, zeros and multiplicity, the Rational Root Theorem, synthetic division, and graphing. The test contains 10 multiple-choice, 5 short-answer, and 3 extended-response questions.',
    dueDate: '2026-03-18T23:59:00Z',
    type: 'test',
    points: 100,
    status: 'published',
  },

  // ---------------------------------------------------------------------------
  // Course c2 – English Literature
  // ---------------------------------------------------------------------------
  {
    id: 'a3',
    courseId: 'c2',
    title: 'Shakespeare Essay',
    description:
      'Write a 1,500-2,000 word analytical essay on one of the following topics: the role of fate in Romeo and Juliet, the nature of ambition in Macbeth, or the concept of justice in The Merchant of Venice. Must include a clear thesis, at least four textual citations, and a works-cited page in MLA format.',
    dueDate: '2026-03-20T23:59:00Z',
    type: 'essay',
    points: 100,
    status: 'published',
  },
  {
    id: 'a7',
    courseId: 'c2',
    title: 'Poetry Analysis',
    description:
      'Read the assigned poems by Emily Dickinson and Robert Frost. For each poem, identify the meter, rhyme scheme, and at least two literary devices. Write a one-paragraph analysis (150-200 words) explaining how the form supports the theme.',
    dueDate: '2026-02-28T23:59:00Z',
    type: 'homework',
    points: 40,
    status: 'graded',
    submissions: [
      {
        id: 'sub6',
        assignmentId: 'a7',
        studentId: 's1',
        submittedAt: '2026-02-27T20:00:00Z',
        content: 'Analysis of "Because I could not stop for Death" and "The Road Not Taken".',
        grade: 37,
        feedback: 'Strong analysis of Dickinson. Your Frost paragraph could dig deeper into the irony.',
      },
      {
        id: 'sub7',
        assignmentId: 'a7',
        studentId: 's3',
        submittedAt: '2026-02-28T14:22:00Z',
        content: 'Completed analyses for both poems with literary device identification.',
        grade: 40,
        feedback: 'Outstanding close reading. Your observation about the slant rhyme was insightful.',
      },
      {
        id: 'sub8',
        assignmentId: 'a7',
        studentId: 's5',
        submittedAt: '2026-02-28T23:01:00Z',
        content: 'Poetry analysis submitted.',
        grade: 34,
        feedback: 'Good identification of devices but the analysis needs more depth. Connect form to meaning.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Course c3 – AP Chemistry
  // ---------------------------------------------------------------------------
  {
    id: 'a4',
    courseId: 'c3',
    title: 'Lab Report: Titration',
    description:
      'Write a formal lab report for the acid-base titration experiment performed in class. Include an abstract, introduction with background research, detailed procedure, data tables, calculations (including percent error), discussion of results, and a conclusion. Follow the ACS lab report format guide distributed in class.',
    dueDate: '2026-02-25T23:59:00Z',
    type: 'project',
    points: 75,
    status: 'graded',
    submissions: [
      {
        id: 'sub9',
        assignmentId: 'a4',
        studentId: 's2',
        submittedAt: '2026-02-24T19:15:00Z',
        fileUrl: '/uploads/s2-titration-report.pdf',
        grade: 68,
        feedback: 'Good data analysis. Percent error calculation was correct but the discussion section needs to address sources of error more thoroughly.',
      },
      {
        id: 'sub10',
        assignmentId: 'a4',
        studentId: 's3',
        submittedAt: '2026-02-23T22:30:00Z',
        fileUrl: '/uploads/s3-titration-report.pdf',
        grade: 74,
        feedback: 'Excellent report. Very thorough error analysis and well-written conclusion.',
      },
      {
        id: 'sub11',
        assignmentId: 'a4',
        studentId: 's4',
        submittedAt: '2026-02-25T17:45:00Z',
        fileUrl: '/uploads/s4-titration-report.pdf',
        grade: 60,
        feedback: 'Procedure section is incomplete and missing two data tables. Please review the format guide.',
      },
    ],
  },
  {
    id: 'a8',
    courseId: 'c3',
    title: 'Periodic Table Quiz',
    description:
      'Short quiz on periodic table trends including atomic radius, ionization energy, electronegativity, and electron affinity. Be able to explain why each trend occurs based on nuclear charge and shielding. 10 multiple-choice and 5 fill-in-the-blank questions.',
    dueDate: '2026-02-10T23:59:00Z',
    type: 'quiz',
    points: 25,
    status: 'graded',
    submissions: [
      {
        id: 'sub12',
        assignmentId: 'a8',
        studentId: 's2',
        submittedAt: '2026-02-10T10:20:00Z',
        grade: 23,
        feedback: 'Very good. Review the exception for electron affinity in Group 2.',
      },
      {
        id: 'sub13',
        assignmentId: 'a8',
        studentId: 's3',
        submittedAt: '2026-02-10T10:18:00Z',
        grade: 25,
        feedback: 'Perfect score!',
      },
      {
        id: 'sub14',
        assignmentId: 'a8',
        studentId: 's4',
        submittedAt: '2026-02-10T10:25:00Z',
        grade: 19,
        feedback: 'Study the relationship between shielding and ionization energy more carefully.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Course c4 – World History
  // ---------------------------------------------------------------------------
  {
    id: 'a5',
    courseId: 'c4',
    title: 'WWII Timeline Project',
    description:
      'Create a detailed, illustrated timeline of World War II covering 1939-1945. Include at least 20 key events with dates, brief descriptions, and images or maps. The timeline should cover both the European and Pacific theaters. You may use digital tools (Google Slides, Canva, etc.) or create a physical poster.',
    dueDate: '2026-03-25T23:59:00Z',
    type: 'project',
    points: 100,
    status: 'published',
  },
  {
    id: 'a13',
    courseId: 'c4',
    title: 'Map Quiz: Europe',
    description:
      'Identify all 44 European countries and their capitals on a blank map. You will be given 30 minutes during class. Study the political map provided in the textbook (pages 112-113) and the online practice tool linked on the course page.',
    dueDate: '2026-02-18T23:59:00Z',
    type: 'quiz',
    points: 20,
    status: 'graded',
    submissions: [
      {
        id: 'sub15',
        assignmentId: 'a13',
        studentId: 's1',
        submittedAt: '2026-02-18T11:30:00Z',
        grade: 18,
        feedback: 'Missed Moldova and its capital. Otherwise excellent.',
      },
      {
        id: 'sub16',
        assignmentId: 'a13',
        studentId: 's2',
        submittedAt: '2026-02-18T11:28:00Z',
        grade: 16,
        feedback: 'Confused the Baltic states. Review Estonia, Latvia, and Lithuania.',
      },
      {
        id: 'sub17',
        assignmentId: 'a13',
        studentId: 's4',
        submittedAt: '2026-02-18T11:32:00Z',
        grade: 20,
        feedback: 'Perfect! Every country and capital correct.',
      },
      {
        id: 'sub18',
        assignmentId: 'a13',
        studentId: 's5',
        submittedAt: '2026-02-18T11:29:00Z',
        grade: 17,
        feedback: 'Mixed up Slovakia and Slovenia. Common mistake — review the differences.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Course c5 – Calculus I
  // ---------------------------------------------------------------------------
  {
    id: 'a9',
    courseId: 'c5',
    title: 'Derivatives Worksheet',
    description:
      'Complete the derivatives worksheet covering the power rule, product rule, quotient rule, and chain rule. Problems 1-15 are basic differentiation, 16-25 require the product and quotient rules, and 26-30 involve the chain rule with composite functions. Show all work for full credit.',
    dueDate: '2026-03-15T23:59:00Z',
    type: 'homework',
    points: 50,
    status: 'published',
  },
  {
    id: 'a15',
    courseId: 'c5',
    title: 'Integration Techniques Test',
    description:
      'Comprehensive test on integration techniques including u-substitution, integration by parts, partial fractions, and trigonometric integrals. The test will consist of 8 free-response problems and 12 multiple-choice questions. Calculators are not permitted.',
    dueDate: '2026-04-05T23:59:00Z',
    type: 'test',
    points: 100,
    status: 'draft',
  },

  // ---------------------------------------------------------------------------
  // Course c6 – Creative Writing
  // ---------------------------------------------------------------------------
  {
    id: 'a10',
    courseId: 'c6',
    title: 'Short Story Draft',
    description:
      'Write a complete short story draft of 2,000-3,500 words. Your story should include a clear narrative arc (exposition, rising action, climax, falling action, resolution), at least two developed characters, and a consistent point of view. Any genre is acceptable. This draft will go through peer review before the final submission.',
    dueDate: '2026-03-22T23:59:00Z',
    type: 'essay',
    points: 80,
    status: 'published',
  },
  {
    id: 'a16',
    courseId: 'c6',
    title: 'Peer Review Workshop',
    description:
      'Read and provide constructive feedback on two classmates\u2019 short story drafts. For each draft, complete the peer review rubric and write a 200-300 word response addressing strengths, areas for improvement, and specific suggestions for revision. Be respectful and specific in your comments.',
    dueDate: '2026-04-10T23:59:00Z',
    type: 'homework',
    points: 30,
    status: 'draft',
  },

  // ---------------------------------------------------------------------------
  // Course c7 – Physics
  // ---------------------------------------------------------------------------
  {
    id: 'a11',
    courseId: 'c7',
    title: "Newton's Laws Lab",
    description:
      'Conduct the three-part laboratory experiment on Newton\'s Laws of Motion. Part 1: demonstrate inertia using the tablecloth pull. Part 2: measure acceleration vs. force using a dynamics cart and force sensor. Part 3: verify action-reaction pairs with two spring scales. Submit a complete lab report with data tables, graphs, and analysis.',
    dueDate: '2026-02-20T23:59:00Z',
    type: 'project',
    points: 75,
    status: 'graded',
    submissions: [
      {
        id: 'sub19',
        assignmentId: 'a11',
        studentId: 's1',
        submittedAt: '2026-02-19T17:00:00Z',
        fileUrl: '/uploads/s1-newtons-laws-lab.pdf',
        grade: 70,
        feedback: 'Good experimental design. Your Part 2 graph needs error bars and a line of best fit.',
      },
      {
        id: 'sub20',
        assignmentId: 'a11',
        studentId: 's2',
        submittedAt: '2026-02-20T15:45:00Z',
        fileUrl: '/uploads/s2-newtons-laws-lab.pdf',
        grade: 72,
        feedback: 'Strong analysis section. The conclusion could be more concise.',
      },
      {
        id: 'sub21',
        assignmentId: 'a11',
        studentId: 's3',
        submittedAt: '2026-02-18T20:10:00Z',
        fileUrl: '/uploads/s3-newtons-laws-lab.pdf',
        grade: 75,
        feedback: 'Excellent work across all three parts. Clear graphs and thorough error analysis.',
      },
      {
        id: 'sub22',
        assignmentId: 'a11',
        studentId: 's5',
        submittedAt: '2026-02-20T22:30:00Z',
        fileUrl: '/uploads/s5-newtons-laws-lab.pdf',
        grade: 65,
        feedback: 'Part 3 data is incomplete — only one trial recorded. Two trials minimum are required.',
      },
    ],
  },
  {
    id: 'a14',
    courseId: 'c7',
    title: 'Wave Motion Problem Set',
    description:
      'Solve problems 1-20 from the Wave Motion chapter. Topics include transverse and longitudinal waves, wave speed, frequency, wavelength, the wave equation, superposition, and standing waves. Problems 15-20 are challenge problems worth extra credit.',
    dueDate: '2026-03-14T23:59:00Z',
    type: 'homework',
    points: 40,
    status: 'published',
  },

  // ---------------------------------------------------------------------------
  // Course c8 – US Government
  // ---------------------------------------------------------------------------
  {
    id: 'a12',
    courseId: 'c8',
    title: 'Constitutional Analysis',
    description:
      'Choose one of the first ten amendments (the Bill of Rights) and write a 1,000-1,200 word analysis. Discuss the historical context in which the amendment was written, at least two landmark Supreme Court cases that interpreted it, and its relevance to a current event or debate. Use at least three credible sources cited in Chicago style.',
    dueDate: '2026-03-28T23:59:00Z',
    type: 'essay',
    points: 60,
    status: 'published',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Look up a single assignment by its unique ID.
 * Returns `undefined` when no assignment matches.
 */
export function getAssignmentById(id: string): Assignment | undefined {
  return assignments.find((assignment) => assignment.id === id);
}

/**
 * Return every assignment that belongs to the given course.
 */
export function getAssignmentsByCourse(courseId: string): Assignment[] {
  return assignments.filter((assignment) => assignment.courseId === courseId);
}

/**
 * Return every assignment that matches the given status.
 */
export function getAssignmentsByStatus(status: string): Assignment[] {
  return assignments.filter((assignment) => assignment.status === status);
}

// ============================================================================
// Mutators (session-only persistence)
// ============================================================================

export function addSubmission(assignmentId: string, submission: Submission) {
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (assignment) {
    if (!assignment.submissions) {
      assignment.submissions = [];
    }
    assignment.submissions.push(submission);
  }
}
