import type { Announcement, UserRole } from '@/types';

// ============================================================================
// Mock Announcements Data
// ============================================================================

export const announcements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Spring Break Schedule',
    content:
      'Spring break will run from March 30 through April 3. Classes resume on Monday, April 6. All assignments due during break week have been extended to April 8. Please plan accordingly and enjoy the time off!',
    authorId: 'a1',
    priority: 'high',
    pinned: true,
    createdAt: '2026-03-10T08:00:00Z',
    expiresAt: '2026-04-06T08:00:00Z',
    targetRoles: ['student', 'teacher', 'parent', 'admin'],
  },
  {
    id: 'ann2',
    title: 'Parent-Teacher Conference — March 20',
    content:
      'Our spring parent-teacher conferences are scheduled for Thursday, March 20 from 4:00 PM to 8:00 PM in the main building. Parents can sign up for 15-minute slots with individual teachers through the LMS scheduling portal. Walk-ins are welcome but may experience longer wait times.',
    authorId: 'a1',
    priority: 'high',
    pinned: true,
    createdAt: '2026-03-05T09:00:00Z',
    expiresAt: '2026-03-21T00:00:00Z',
    targetRoles: ['parent', 'teacher'],
  },
  {
    id: 'ann3',
    title: 'Science Fair Registration Open',
    content:
      'Registration for the annual Science Fair is now open. Students in grades 10-12 are eligible to participate. Projects can be individual or in pairs. Submit your project proposal through the LMS by March 28. The fair will take place on April 18 in the gymnasium. Prizes will be awarded in three categories: Physical Sciences, Life Sciences, and Engineering.',
    authorId: 't3',
    priority: 'normal',
    pinned: false,
    createdAt: '2026-03-08T11:00:00Z',
    expiresAt: '2026-03-28T23:59:00Z',
    targetRoles: ['student', 'teacher', 'parent'],
  },
  {
    id: 'ann4',
    title: 'Library System Maintenance — March 15',
    content:
      'The online library catalog and digital resource portal will be unavailable on Saturday, March 15 from 2:00 AM to 5:00 AM for scheduled server upgrades. Please download any materials you need before then. The physical library will remain open during normal weekend hours.',
    authorId: 'a3',
    priority: 'low',
    pinned: false,
    createdAt: '2026-03-12T07:00:00Z',
    expiresAt: '2026-03-16T00:00:00Z',
    targetRoles: ['student', 'teacher', 'admin'],
  },
  {
    id: 'ann5',
    title: 'Updated Code of Conduct Policy',
    content:
      'The school board has approved several updates to the student code of conduct effective immediately. Key changes include revised guidelines for electronic device usage during class, updated dress code language, and a new restorative justice framework for disciplinary referrals. The full updated document is available on the school website. All students and parents are encouraged to review it.',
    authorId: 'a2',
    priority: 'urgent',
    pinned: true,
    createdAt: '2026-03-03T14:00:00Z',
    targetRoles: ['student', 'parent', 'teacher', 'admin'],
  },
  {
    id: 'ann6',
    title: 'Varsity Basketball — State Playoffs',
    content:
      'Congratulations to our varsity basketball team for qualifying for the state playoffs! The first game is Friday, March 14 at 7:00 PM at the downtown arena. Student tickets are available at a discounted rate of $5 at the front office. Let us show up and support our team!',
    authorId: 'a1',
    priority: 'normal',
    pinned: false,
    createdAt: '2026-03-11T12:00:00Z',
    expiresAt: '2026-03-15T00:00:00Z',
    targetRoles: ['student', 'teacher', 'parent'],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Return every announcement whose target roles include the given role.
 */
export function getAnnouncementsByRole(role: UserRole): Announcement[] {
  return announcements.filter((announcement) =>
    announcement.targetRoles.includes(role),
  );
}

/**
 * Return every announcement that is currently pinned.
 */
export function getPinnedAnnouncements(): Announcement[] {
  return announcements.filter((announcement) => announcement.pinned);
}
