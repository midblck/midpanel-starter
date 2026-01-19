import type { Access } from 'payload';
import type { Admin, User } from '@/payload-types';

// Union type to handle different user types from PayloadCMS
export type UserWithRole =
  | (Admin & { collection: 'admins' })
  | (User & { collection: 'users' })
  | null;

// Core helper functions
const isAuthenticated = (user: UserWithRole): boolean => Boolean(user);

const isAdmin = (user: UserWithRole): boolean =>
  Boolean(
    user &&
      user.collection === 'admins' &&
      'role' in user &&
      (user.role === 'master' || user.role === 'staff')
  );

const isMaster = (user: UserWithRole): boolean =>
  Boolean(
    user &&
      user.collection === 'admins' &&
      'role' in user &&
      user.role === 'master'
  );

// Core access patterns
export const anyone: Access = () => true;

export const authenticated: Access = ({ req: { user } }) =>
  isAuthenticated(user);

export const admins: Access = ({ req: { user } }) => isAdmin(user);

export const masters: Access = ({ req: { user } }) => isMaster(user);

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return { id: { equals: user.id } };
};

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: 'published' } };
};

export const taskAccess: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (isAdmin(user)) return true; // Admins can see all tasks
  // For multi-tenancy, users can only see their own tasks
  // This ensures each user only manages their own tasks
  return { creator: { equals: user.id } };
};

export const statusAccess: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (isAdmin(user)) return true; // Admins can see all statuses
  // Regular users can only see statuses they created
  return { creator: { equals: user.id } };
};

// Role checking utility
export const checkRole = (roles: string[], user?: UserWithRole): boolean => {
  if (!user || !('role' in user)) return false;
  return roles.includes(user.role);
};

export { isAdmin };

// Reusable role-based access control factory
export const createRoleBasedAccess = (allowedRoles: string[]): Access => {
  return ({ req: { user } }) => {
    if (!user || !('role' in user) || typeof user.role !== 'string')
      return false;
    return allowedRoles.includes(user.role);
  };
};

// Predefined role-based access controls
export const masterOnlyAccess = createRoleBasedAccess(['master']);
export const staffAndMasterAccess = createRoleBasedAccess(['staff', 'master']);

/**
 * BASIC ACCESS CONTROL FUNCTIONS
 *
 * Available for use in collection configurations:
 *
 * Core Access Patterns:
 * - anyone: No restrictions
 * - authenticated: Any authenticated user
 * - admins: Staff and master roles
 * - masters: Only master role
 * - adminsOrSelf: Admins can access all, others only their own records
 * - authenticatedOrPublished: Authenticated users or published content
 *
 * Role-based Access:
 * - masterOnlyAccess: Only master role
 * - staffAndMasterAccess: Staff and master roles
 * - createRoleBasedAccess(['custom', 'roles']): Custom role combinations
 *
 * Usage Examples:
 *
 * // In collection config:
 * access: {
 *   read: staffAndMasterAccess,
 *   create: masterOnlyAccess,
 *   update: createRoleBasedAccess(['master']),
 * }
 */
