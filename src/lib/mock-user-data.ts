/**
 * Mock User Data - Different roles for testing RBAC
 */

import { User, ROLE_PERMISSIONS } from '../types/user';

export const mockUsers: User[] = [
  // Super Admin - Can access everything across all branches
  {
    id: 'user_super_1',
    email: 'admin@victorychapel.org',
    firstName: 'Emmanuel',
    lastName: 'Okafor',
    role: 'super_admin',
    organizationId: 'org1',
    assignedBranchIds: [], // Empty = all branches
    primaryBranchId: 'kubwa',
    permissions: ROLE_PERMISSIONS.super_admin,
    phone: '+234 803 123 4567',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Branch Admin - Kubwa Campus (HQ)
  {
    id: 'user_admin_kubwa',
    email: 'kubwa.admin@victorychapel.org',
    firstName: 'Chioma',
    lastName: 'Adekunle',
    role: 'branch_admin',
    organizationId: 'org1',
    assignedBranchIds: ['kubwa'],
    primaryBranchId: 'kubwa',
    permissions: ROLE_PERMISSIONS.branch_admin,
    phone: '+234 805 234 5678',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Branch Admin - Wuse 2 Campus
  {
    id: 'user_admin_wuse2',
    email: 'wuse2.admin@victorychapel.org',
    firstName: 'Abiodun',
    lastName: 'Ibrahim',
    role: 'branch_admin',
    organizationId: 'org1',
    assignedBranchIds: ['wuse2'],
    primaryBranchId: 'wuse2',
    permissions: ROLE_PERMISSIONS.branch_admin,
    phone: '+234 807 345 6789',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Multi-Branch Admin - Can manage both Kubwa and Wuse 2
  {
    id: 'user_admin_multi',
    email: 'regional.admin@victorychapel.org',
    firstName: 'Ngozi',
    lastName: 'Chukwu',
    role: 'branch_admin',
    organizationId: 'org1',
    assignedBranchIds: ['kubwa', 'wuse2'],
    primaryBranchId: 'kubwa',
    permissions: ROLE_PERMISSIONS.branch_admin,
    phone: '+234 809 456 7890',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Staff - Kubwa Campus
  {
    id: 'user_staff_kubwa',
    email: 'kubwa.staff@victorychapel.org',
    firstName: 'Oluwaseun',
    lastName: 'Bello',
    role: 'staff',
    organizationId: 'org1',
    assignedBranchIds: ['kubwa'],
    primaryBranchId: 'kubwa',
    permissions: ROLE_PERMISSIONS.staff,
    phone: '+234 810 567 8901',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Staff - Wuse 2 Campus
  {
    id: 'user_staff_wuse2',
    email: 'wuse2.staff@victorychapel.org',
    firstName: 'Fatima',
    lastName: 'Yusuf',
    role: 'staff',
    organizationId: 'org1',
    assignedBranchIds: ['wuse2'],
    primaryBranchId: 'wuse2',
    permissions: ROLE_PERMISSIONS.staff,
    phone: '+234 812 678 9012',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  
  // Volunteer - Kubwa Campus
  {
    id: 'user_volunteer_kubwa',
    email: 'volunteer@victorychapel.org',
    firstName: 'David',
    lastName: 'Okoro',
    role: 'volunteer',
    organizationId: 'org1',
    assignedBranchIds: ['kubwa'],
    primaryBranchId: 'kubwa',
    permissions: ROLE_PERMISSIONS.volunteer,
    phone: '+234 813 789 0123',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

// Helper to get user by role for quick testing
export function getUserByRole(role: User['role']): User {
  return mockUsers.find(u => u.role === role) || mockUsers[0];
}

// Helper to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}
