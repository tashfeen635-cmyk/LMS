import type { UserRole } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  badge?: number;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Courses', href: '/student/courses', icon: 'BookOpen' },
  { label: 'Assignments', href: '/student/assignments', icon: 'FileText' },
  { label: 'Grades', href: '/student/grades', icon: 'GraduationCap' },
  { label: 'Calendar', href: '/student/calendar', icon: 'Calendar' },
  { label: 'Messages', href: '/student/messages', icon: 'MessageSquare' },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Classes', href: '/teacher/classes', icon: 'Users' },
  { label: 'Content Library', href: '/teacher/content-library', icon: 'Library' },
  { label: 'Analytics', href: '/teacher/analytics', icon: 'BarChart3' },
  { label: 'Messages', href: '/teacher/messages', icon: 'MessageSquare' },
];

const parentNav: NavItem[] = [
  { label: 'Dashboard', href: '/parent/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Children', href: '/parent/children', icon: 'Users' },
  { label: 'Communications', href: '/parent/communications', icon: 'MessageSquare' },
  { label: 'Calendar', href: '/parent/calendar', icon: 'Calendar' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users', href: '/admin/users', icon: 'UserCog' },
  { label: 'Academic Setup', href: '/admin/academic-setup', icon: 'Settings2' },
  { label: 'Reports', href: '/admin/reports', icon: 'FileBarChart' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

const navMap: Record<UserRole, NavItem[]> = {
  student: studentNav,
  teacher: teacherNav,
  parent: parentNav,
  admin: adminNav,
};

export function getNavItems(role: UserRole): NavItem[] {
  return navMap[role] ?? [];
}
