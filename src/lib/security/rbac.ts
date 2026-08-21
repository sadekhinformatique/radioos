// Role-Based Access Control (RBAC) for RadioOS
// Strict matrix: who can do what, to which tenant

// Roles hierarchy (from highest to lowest)
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  RADIO_OWNER: 'radio_owner',
  RADIO_ADMIN: 'radio_admin',
  RADIO_MODERATOR: 'radio_moderator',
  RADIO_HOST: 'radio_host',
  RADIO_MEMBER: 'radio_member',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Role permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  [ROLES.SUPER_ADMIN]: new Set([
    // Platform-wide access
    'platform:manage',
    'platform:billing',
    'platform:analytics',
    
    // Can act on ANY tenant
    'tenant:read',
    'tenant:update',
    'tenant:delete',
    'tenant:billing',
    
    // User management
    'user:read',
    'user:update',
    'user:delete',
    'user:impersonate',
    
    // Can bypass all tenant restrictions
    '*',
  ]),

  [ROLES.RADIO_OWNER]: new Set([
    // Full control of own radio
    'radio:read',
    'radio:update',
    'radio:delete',
    'radio:billing',
    'radio:settings',
    
    // Member management
    'member:read',
    'member:invite',
    'member:update_role',
    'member:remove',
    
    // Content management
    'stream:read',
    'stream:create',
    'stream:update',
    'stream:delete',
    'podcast:read',
    'podcast:create',
    'podcast:update',
    'podcast:delete',
    'show:read',
    'show:create',
    'show:update',
    'show:delete',
    'program:read',
    'program:create',
    'program:update',
    'program:delete',
    
    // Interaction management
    'message:read',
    'message:send',
    'message:delete',
    'dedication:read',
    'dedication:approve',
    'dedication:delete',
    'poll:read',
    'poll:create',
    'poll:update',
    'poll:delete',
    
    // Analytics
    'analytics:read',
    'analytics:export',
    
    // Advertising
    'advertising:read',
    'advertising:create',
    'advertising:update',
    'advertising:delete',
    
    // API keys
    'api_key:read',
    'api_key:create',
    'api_key:delete',
    
    // Settings
    'settings:read',
    'settings:update',
    'notifications:read',
    'notifications:configure',
  ]),

  [ROLES.RADIO_ADMIN]: new Set([
    // Read radio info
    'radio:read',
    
    // Member management (except owner)
    'member:read',
    'member:invite',  // Can invite up to moderator role
    'member:update_role',  // Can update up to moderator role
    
    // Content management
    'stream:read',
    'stream:create',
    'stream:update',
    'stream:delete',
    'podcast:read',
    'podcast:create',
    'podcast:update',
    'podcast:delete',
    'show:read',
    'show:create',
    'show:update',
    'show:delete',
    'program:read',
    'program:create',
    'program:update',
    'program:delete',
    
    // Interaction management
    'message:read',
    'message:send',
    'message:delete',
    'dedication:read',
    'dedication:approve',
    'dedication:delete',
    'poll:read',
    'poll:create',
    'poll:update',
    'poll:delete',
    
    // Analytics (read only)
    'analytics:read',
    
    // Advertising
    'advertising:read',
    'advertising:create',
    'advertising:update',
    
    // Notifications
    'notifications:read',
  ]),

  [ROLES.RADIO_MODERATOR]: new Set([
    // Read radio info
    'radio:read',
    
    // Content management (limited)
    'stream:read',
    'podcast:read',
    'podcast:create',
    'podcast:update',
    'show:read',
    'show:create',
    'show:update',
    'program:read',
    
    // Interaction management
    'message:read',
    'message:send',
    'dedication:read',
    'dedication:approve',
    'poll:read',
    'poll:create',
    
    // Analytics (read only)
    'analytics:read',
  ]),

  [ROLES.RADIO_HOST]: new Set([
    // Read radio info
    'radio:read',
    
    // Content management (limited)
    'stream:read',
    'podcast:read',
    'podcast:create',
    'show:read',
    'program:read',
    
    // Interaction management
    'message:read',
    'message:send',
    'dedication:read',
    'poll:read',
    
    // Analytics (limited)
    'analytics:read',
  ]),

  [ROLES.RADIO_MEMBER]: new Set([
    // Read only
    'radio:read',
    'stream:read',
    'podcast:read',
    'show:read',
    'program:read',
    'message:read',
    'analytics:read',
  ]),
};

// Who can invite whom (and at what max role)
export const INVITE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [ROLES.SUPER_ADMIN]: [
    ROLES.SUPER_ADMIN,
    ROLES.RADIO_OWNER,
    ROLES.RADIO_ADMIN,
    ROLES.RADIO_MODERATOR,
    ROLES.RADIO_HOST,
    ROLES.RADIO_MEMBER,
  ],
  [ROLES.RADIO_OWNER]: [
    ROLES.RADIO_ADMIN,
    ROLES.RADIO_MODERATOR,
    ROLES.RADIO_HOST,
    ROLES.RADIO_MEMBER,
  ],
  [ROLES.RADIO_ADMIN]: [
    ROLES.RADIO_MODERATOR,
    ROLES.RADIO_HOST,
    ROLES.RADIO_MEMBER,
  ],
  [ROLES.RADIO_MODERATOR]: [
    ROLES.RADIO_HOST,
    ROLES.RADIO_MEMBER,
  ],
  [ROLES.RADIO_HOST]: [
    ROLES.RADIO_MEMBER,
  ],
  [ROLES.RADIO_MEMBER]: [],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userRole: UserRole,
  permission: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  
  // Super admin has all permissions
  if (permissions.has('*')) return true;
  
  // Check exact permission
  if (permissions.has(permission)) return true;
  
  // Check wildcard (e.g., 'stream:*' matches 'stream:read')
  const [resource] = permission.split(':');
  if (permissions.has(`${resource}:*`)) return true;
  
  return false;
}

/**
 * Check if a user can invite another user with a specific role
 */
export function canInviteRole(
  inviterRole: UserRole,
  inviteeRole: UserRole
): boolean {
  const allowedRoles = INVITE_HIERARCHY[inviterRole];
  return allowedRoles.includes(inviteeRole);
}

/**
 * Check if user can modify another user's role
 */
export function canModifyRole(
  modifierRole: UserRole,
  targetCurrentRole: UserRole,
  targetNewRole: UserRole
): boolean {
  // Can't escalate beyond your own level
  const modifierLevel = getRoleLevel(modifierRole);
  const targetNewLevel = getRoleLevel(targetNewRole);
  
  if (targetNewLevel >= modifierLevel) {
    return false;
  }
  
  // Can't modify someone with higher or equal role
  const targetCurrentLevel = getRoleLevel(targetCurrentRole);
  if (targetCurrentLevel >= modifierLevel) {
    return false;
  }
  
  return true;
}

/**
 * Check if user belongs to a specific radio
 */
export async function belongsToRadio(
  userId: string,
  radioId: string
): Promise<{ belongs: boolean; role?: UserRole }> {
  // This would query Supabase in production
  // For now, return a placeholder
  return { belongs: false };
}

/**
 * Get role hierarchy level (higher = more permissions)
 */
function getRoleLevel(role: UserRole): number {
  const levels: Record<UserRole, number> = {
    [ROLES.SUPER_ADMIN]: 100,
    [ROLES.RADIO_OWNER]: 80,
    [ROLES.RADIO_ADMIN]: 60,
    [ROLES.RADIO_MODERATOR]: 40,
    [ROLES.RADIO_HOST]: 20,
    [ROLES.RADIO_MEMBER]: 10,
  };
  return levels[role] || 0;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return Array.from(ROLE_PERMISSIONS[role] || []);
}

/**
 * Validate role transition
 */
export function validateRoleTransition(
  currentRole: UserRole,
  newRole: UserRole,
  targetRole: UserRole
): { valid: boolean; error?: string } {
  // Can't promote to super_admin via normal means
  if (newRole === ROLES.SUPER_ADMIN) {
    return { valid: false, error: 'Impossible de promouvoir en Super Admin via cette interface' };
  }

  // Can't modify super_admin
  if (targetRole === ROLES.SUPER_ADMIN) {
    return { valid: false, error: 'Impossible de modifier un Super Admin' };
  }

  // Check hierarchy
  if (!canModifyRole(currentRole, targetRole, newRole)) {
    return { valid: false, error: 'Vous ne pouvez pas attribuer ce rôle' };
  }

  return { valid: true };
}
