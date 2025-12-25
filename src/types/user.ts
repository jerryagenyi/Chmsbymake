/**
 * ChurchAfrica ChMS - User Types
 * User roles, permissions, and authentication
 */

export type UserRole = 
  | 'super_admin'      // Full access to entire organization
  | 'branch_admin'     // Full access to assigned branch(es)
  | 'staff'            // Limited access to assigned branch(es)
  | 'volunteer'        // Very limited access
  | 'member';          // Member portal access only

export type Permission = 
  // Member Management
  | 'members.view'
  | 'members.create'
  | 'members.edit'
  | 'members.delete'
  | 'members.import'
  | 'members.export'
  
  // Attendance
  | 'attendance.view'
  | 'attendance.checkin'
  | 'attendance.edit'
  | 'attendance.reports'
  
  // Services
  | 'services.view'
  | 'services.create'
  | 'services.edit'
  | 'services.delete'
  
  // Events
  | 'events.view'
  | 'events.create'
  | 'events.edit'
  | 'events.delete'
  
  // Giving
  | 'giving.view'
  | 'giving.record'
  | 'giving.edit'
  | 'giving.reports'
  | 'giving.campaigns'
  
  // Chat
  | 'chat.view'
  | 'chat.send'
  | 'chat.moderate'
  
  // Organization
  | 'organization.view'
  | 'organization.edit'
  | 'organization.branches.create'
  | 'organization.branches.edit'
  | 'organization.branches.delete'
  | 'organization.locations.create'
  | 'organization.locations.edit'
  | 'organization.locations.delete'
  
  // Analytics & Reports
  | 'analytics.view'
  | 'reports.view'
  | 'reports.export'
  
  // AI & Advanced
  | 'ai.view'
  | 'ai.configure'
  
  // Settings & Admin
  | 'settings.view'
  | 'settings.edit'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'roles.assign';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  
  // Branch assignments
  assignedBranchIds: string[];  // Empty array = all branches (for super_admin)
  primaryBranchId: string;       // Main branch for the user
  
  // Permissions
  permissions: Permission[];     // Explicit permissions (can override role defaults)
  
  // Profile
  phone?: string;
  avatar?: string;
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Role-based permission presets
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // All permissions
    'members.view', 'members.create', 'members.edit', 'members.delete', 'members.import', 'members.export',
    'attendance.view', 'attendance.checkin', 'attendance.edit', 'attendance.reports',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'events.view', 'events.create', 'events.edit', 'events.delete',
    'giving.view', 'giving.record', 'giving.edit', 'giving.reports', 'giving.campaigns',
    'chat.view', 'chat.send', 'chat.moderate',
    'organization.view', 'organization.edit', 'organization.branches.create', 'organization.branches.edit', 'organization.branches.delete',
    'organization.locations.create', 'organization.locations.edit', 'organization.locations.delete',
    'analytics.view', 'reports.view', 'reports.export',
    'ai.view', 'ai.configure',
    'settings.view', 'settings.edit',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'roles.assign',
  ],
  
  branch_admin: [
    // Full branch management
    'members.view', 'members.create', 'members.edit', 'members.delete', 'members.import', 'members.export',
    'attendance.view', 'attendance.checkin', 'attendance.edit', 'attendance.reports',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'events.view', 'events.create', 'events.edit', 'events.delete',
    'giving.view', 'giving.record', 'giving.edit', 'giving.reports', 'giving.campaigns',
    'chat.view', 'chat.send', 'chat.moderate',
    'organization.view', 'organization.locations.create', 'organization.locations.edit', 'organization.locations.delete',
    'analytics.view', 'reports.view', 'reports.export',
    'ai.view',
    'settings.view',
    'users.view', 'users.create', 'users.edit',
  ],
  
  staff: [
    // Basic operations
    'members.view', 'members.create', 'members.edit',
    'attendance.view', 'attendance.checkin',
    'services.view',
    'events.view', 'events.create', 'events.edit',
    'giving.view', 'giving.record',
    'chat.view', 'chat.send',
    'organization.view',
    'analytics.view', 'reports.view',
  ],
  
  volunteer: [
    // Very limited
    'members.view',
    'attendance.checkin',
    'services.view',
    'events.view',
    'chat.view', 'chat.send',
  ],
  
  member: [
    // Member portal only
    'chat.view', 'chat.send',
    'events.view',
    'giving.view',
  ],
};

// Helper function to check if user has permission
export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

// Helper function to check if user has any of the permissions
export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some(permission => user.permissions.includes(permission));
}

// Helper function to check if user has all permissions
export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every(permission => user.permissions.includes(permission));
}

// Helper function to check if user can access branch
export function canAccessBranch(user: User, branchId: string): boolean {
  // Super admin with no assigned branches = access all
  if (user.role === 'super_admin' && user.assignedBranchIds.length === 0) {
    return true;
  }
  
  // Check if branch is in assigned branches
  return user.assignedBranchIds.includes(branchId);
}

// Helper function to get accessible branch IDs
export function getAccessibleBranchIds(user: User, allBranchIds: string[]): string[] {
  // Super admin with no assigned branches = all branches
  if (user.role === 'super_admin' && user.assignedBranchIds.length === 0) {
    return allBranchIds;
  }
  
  return user.assignedBranchIds;
}

// Helper to get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Administrator',
    branch_admin: 'Branch Administrator',
    staff: 'Staff Member',
    volunteer: 'Volunteer',
    member: 'Member',
  };
  return names[role];
}

// Helper to get role color
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'text-[#1CE479]',
    branch_admin: 'text-blue-400',
    staff: 'text-purple-400',
    volunteer: 'text-orange-400',
    member: 'text-gray-400',
  };
  return colors[role];
}
