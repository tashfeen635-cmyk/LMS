import type { User, UserRole } from '@/types';

// ============================================================================
// Mock Users Data
// ============================================================================

export const users: User[] = [
  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------
  {
    id: 's1',
    name: 'Sarah Chen',
    email: 'sarah.chen@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    grade: '10',
    phone: '(555) 201-1001',
  },
  {
    id: 's2',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    grade: '10',
    phone: '(555) 201-1002',
  },
  {
    id: 's3',
    name: 'Aisha Patel',
    email: 'aisha.patel@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    grade: '11',
    phone: '(555) 201-1003',
  },
  {
    id: 's4',
    name: 'Jake Williams',
    email: 'jake.williams@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
    grade: '11',
    phone: '(555) 201-1004',
  },
  {
    id: 's5',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    grade: '12',
    phone: '(555) 201-1005',
  },

  // -------------------------------------------------------------------------
  // Teachers
  // -------------------------------------------------------------------------
  {
    id: 't1',
    name: 'Dr. Robert Smith',
    email: 'robert.smith@school.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    department: 'Mathematics',
    phone: '(555) 302-2001',
  },
  {
    id: 't2',
    name: 'Prof. Lisa Wang',
    email: 'lisa.wang@school.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    department: 'English',
    phone: '(555) 302-2002',
  },
  {
    id: 't3',
    name: 'Mr. James Brown',
    email: 'james.brown@school.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    department: 'Science',
    phone: '(555) 302-2003',
  },
  {
    id: 't4',
    name: 'Ms. Maria Garcia',
    email: 'maria.garcia@school.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    department: 'History',
    phone: '(555) 302-2004',
  },

  // -------------------------------------------------------------------------
  // Parents
  // -------------------------------------------------------------------------
  {
    id: 'p1',
    name: 'David Chen',
    email: 'david.chen@email.com',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    children: ['s1'],
    phone: '(555) 403-3001',
  },
  {
    id: 'p2',
    name: 'Patricia Johnson',
    email: 'patricia.johnson@email.com',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia',
    children: ['s2'],
    phone: '(555) 403-3002',
  },
  {
    id: 'p3',
    name: 'Raj Patel',
    email: 'raj.patel@email.com',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
    children: ['s3'],
    phone: '(555) 403-3003',
  },
  {
    id: 'p4',
    name: 'Karen Williams',
    email: 'karen.williams@email.com',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karen',
    children: ['s4'],
    phone: '(555) 403-3004',
  },

  // -------------------------------------------------------------------------
  // Admins
  // -------------------------------------------------------------------------
  {
    id: 'a1',
    name: 'Principal Tom Henderson',
    email: 'tom.henderson@school.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    department: 'Administration',
    phone: '(555) 100-4001',
  },
  {
    id: 'a2',
    name: 'Vice Principal Diana Foster',
    email: 'diana.foster@school.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    department: 'Administration',
    phone: '(555) 100-4002',
  },
  {
    id: 'a3',
    name: 'IT Admin Alex Kim',
    email: 'alex.kim@school.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    department: 'IT',
    phone: '(555) 100-4003',
  },

  // -------------------------------------------------------------------------
  // Additional Students (to reach 20+ total users)
  // -------------------------------------------------------------------------
  {
    id: 's6',
    name: 'Liam O\'Brien',
    email: 'liam.obrien@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    grade: '10',
    phone: '(555) 201-1006',
  },
  {
    id: 's7',
    name: 'Sophia Nguyen',
    email: 'sophia.nguyen@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    grade: '11',
    phone: '(555) 201-1007',
  },
  {
    id: 's8',
    name: 'Ethan Davis',
    email: 'ethan.davis@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    grade: '12',
    phone: '(555) 201-1008',
  },
  {
    id: 's9',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    grade: '10',
    phone: '(555) 201-1009',
  },
  {
    id: 's10',
    name: 'Noah Thompson',
    email: 'noah.thompson@school.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
    grade: '12',
    phone: '(555) 201-1010',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Look up a single user by their unique ID.
 * Returns `undefined` when no user matches.
 */
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

/**
 * Return every user that matches the given role.
 */
export function getUsersByRole(role: UserRole): User[] {
  return users.filter((user) => user.role === role);
}

// ============================================================================
// Mutators (session-only persistence)
// ============================================================================

export function addUser(user: User) {
  users.push(user);
}

export function updateUser(id: string, data: Partial<User>) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...data };
  }
}

export function deleteUser(id: string) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users.splice(idx, 1);
  }
}
