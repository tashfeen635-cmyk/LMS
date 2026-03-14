import type { Notification } from '@/types';

// ============================================================================
// Mock Notifications Data
// ============================================================================

export const notifications: Notification[] = [
  {
    id: 'notif1',
    userId: 's1',
    title: 'Assignment Graded',
    message: 'Your Poetry Analysis in English Literature has been graded. You received 37/40.',
    type: 'success',
    read: true,
    createdAt: '2026-03-01T10:00:00Z',
    link: '/student/assignments/a7',
  },
  {
    id: 'notif2',
    userId: 's1',
    title: 'New Announcement',
    message: 'A new announcement has been posted: Spring Break Schedule.',
    type: 'info',
    read: false,
    createdAt: '2026-03-10T08:00:00Z',
    link: '/student/dashboard',
  },
  {
    id: 'notif3',
    userId: 's2',
    title: 'Attendance Alert',
    message: 'You were marked absent for AP Chemistry on Feb 4. Contact your teacher if this is an error.',
    type: 'warning',
    read: false,
    createdAt: '2026-02-04T16:00:00Z',
    link: '/student/dashboard',
  },
  {
    id: 'notif4',
    userId: 's3',
    title: 'Perfect Score!',
    message: 'Congratulations! You earned a perfect score on the Periodic Table Quiz.',
    type: 'success',
    read: true,
    createdAt: '2026-02-11T14:00:00Z',
    link: '/student/assignments/a8',
  },
  {
    id: 'notif5',
    userId: 't1',
    title: 'Submission Received',
    message: 'Sarah Chen submitted the Polynomial Functions worksheet for Algebra II.',
    type: 'info',
    read: true,
    createdAt: '2026-03-08T18:00:00Z',
    link: '/teacher/classes/c1/assignments',
  },
  {
    id: 'notif6',
    userId: 'p1',
    title: 'Grade Report Available',
    message: "Your child Sarah Chen's mid-semester grade report is now available for review.",
    type: 'info',
    read: false,
    createdAt: '2026-03-05T09:00:00Z',
    link: '/parent/children/s1/grades',
  },
  {
    id: 'notif7',
    userId: 's4',
    title: 'Assignment Due Soon',
    message: 'The WWII Timeline Project for World History is due in 3 days.',
    type: 'warning',
    read: false,
    createdAt: '2026-03-22T08:00:00Z',
    link: '/student/assignments/a5',
  },
  {
    id: 'notif8',
    userId: 'a1',
    title: 'System Maintenance Scheduled',
    message: 'The LMS will undergo scheduled maintenance on March 15 from 2:00 AM to 5:00 AM.',
    type: 'info',
    read: true,
    createdAt: '2026-03-12T07:00:00Z',
  },
  {
    id: 'notif9',
    userId: 's5',
    title: 'Low Grade Alert',
    message: 'Your score on the Derivatives Worksheet in Calculus I was below 70%. Consider visiting office hours.',
    type: 'error',
    read: false,
    createdAt: '2026-03-06T10:30:00Z',
    link: '/student/assignments/a9',
  },
  {
    id: 'notif10',
    userId: 't3',
    title: 'New Message from Parent',
    message: 'Patricia Johnson sent you a message regarding lab safety in AP Chemistry.',
    type: 'info',
    read: true,
    createdAt: '2026-03-10T20:05:00Z',
    link: '/teacher/messages',
  },
  {
    id: 'notif11',
    userId: 'p2',
    title: 'Attendance Update',
    message: 'Marcus Johnson was marked late for Physics on Feb 12 due to a delayed bus.',
    type: 'warning',
    read: true,
    createdAt: '2026-02-12T15:00:00Z',
    link: '/parent/children/s4/attendance',
  },
  {
    id: 'notif12',
    userId: 's2',
    title: 'Course Material Updated',
    message: 'Mr. James Brown uploaded new study materials for the upcoming AP Chemistry unit on thermodynamics.',
    type: 'info',
    read: false,
    createdAt: '2026-03-11T13:00:00Z',
    link: '/student/courses',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Return every notification for a given user.
 */
export function getNotificationsByUser(userId: string): Notification[] {
  return notifications.filter((notification) => notification.userId === userId);
}

/**
 * Return the number of unread notifications for a given user.
 */
export function getUnreadCount(userId: string): number {
  return notifications.filter(
    (notification) => notification.userId === userId && !notification.read,
  ).length;
}
