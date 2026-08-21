import type { UserRole } from "@/types/database";

type Permission =
  | "radio:read"
  | "radio:write"
  | "radio:delete"
  | "radio:admin"
  | "stream:read"
  | "stream:write"
  | "stream:monitor"
  | "program:read"
  | "program:write"
  | "program:delete"
  | "show:read"
  | "show:write"
  | "show:delete"
  | "podcast:read"
  | "podcast:write"
  | "podcast:delete"
  | "podcast:publish"
  | "message:read"
  | "message:write"
  | "message:archive"
  | "dedication:read"
  | "dedication:write"
  | "dedication:moderate"
  | "poll:read"
  | "poll:write"
  | "poll:delete"
  | "analytics:read"
  | "analytics:export"
  | "advertiser:read"
  | "advertiser:write"
  | "campaign:read"
  | "campaign:write"
  | "campaign:delete"
  | "user:read"
  | "user:write"
  | "user:delete"
  | "user:invite"
  | "billing:read"
  | "billing:manage"
  | "settings:read"
  | "settings:write"
  | "notification:read"
  | "notification:write"
  | "ticket:read"
  | "ticket:write"
  | "ticket:assign"
  | "audit:read"
  | "super:admin";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "super:admin",
    "radio:read",
    "radio:write",
    "radio:delete",
    "radio:admin",
    "stream:read",
    "stream:write",
    "stream:monitor",
    "program:read",
    "program:write",
    "program:delete",
    "show:read",
    "show:write",
    "show:delete",
    "podcast:read",
    "podcast:write",
    "podcast:delete",
    "podcast:publish",
    "message:read",
    "message:write",
    "message:archive",
    "dedication:read",
    "dedication:write",
    "dedication:moderate",
    "poll:read",
    "poll:write",
    "poll:delete",
    "analytics:read",
    "analytics:export",
    "advertiser:read",
    "advertiser:write",
    "campaign:read",
    "campaign:write",
    "campaign:delete",
    "user:read",
    "user:write",
    "user:delete",
    "user:invite",
    "billing:read",
    "billing:manage",
    "settings:read",
    "settings:write",
    "notification:read",
    "notification:write",
    "ticket:read",
    "ticket:write",
    "ticket:assign",
    "audit:read",
  ],
  RADIO_OWNER: [
    "radio:read",
    "radio:write",
    "radio:admin",
    "stream:read",
    "stream:write",
    "stream:monitor",
    "program:read",
    "program:write",
    "program:delete",
    "show:read",
    "show:write",
    "show:delete",
    "podcast:read",
    "podcast:write",
    "podcast:delete",
    "podcast:publish",
    "message:read",
    "message:write",
    "message:archive",
    "dedication:read",
    "dedication:write",
    "dedication:moderate",
    "poll:read",
    "poll:write",
    "poll:delete",
    "analytics:read",
    "analytics:export",
    "advertiser:read",
    "advertiser:write",
    "campaign:read",
    "campaign:write",
    "campaign:delete",
    "user:read",
    "user:write",
    "user:invite",
    "billing:read",
    "billing:manage",
    "settings:read",
    "settings:write",
    "notification:read",
    "notification:write",
    "ticket:read",
    "ticket:write",
    "audit:read",
  ],
  RADIO_ADMIN: [
    "radio:read",
    "radio:write",
    "stream:read",
    "stream:write",
    "stream:monitor",
    "program:read",
    "program:write",
    "program:delete",
    "show:read",
    "show:write",
    "show:delete",
    "podcast:read",
    "podcast:write",
    "podcast:delete",
    "podcast:publish",
    "message:read",
    "message:write",
    "message:archive",
    "dedication:read",
    "dedication:write",
    "dedication:moderate",
    "poll:read",
    "poll:write",
    "poll:delete",
    "analytics:read",
    "advertiser:read",
    "advertiser:write",
    "campaign:read",
    "campaign:write",
    "user:read",
    "user:invite",
    "settings:read",
    "settings:write",
    "notification:read",
    "notification:write",
    "ticket:read",
    "ticket:write",
    "audit:read",
  ],
  EDITOR: [
    "radio:read",
    "stream:read",
    "program:read",
    "program:write",
    "show:read",
    "show:write",
    "podcast:read",
    "podcast:write",
    "podcast:publish",
    "message:read",
    "message:write",
    "dedication:read",
    "dedication:write",
    "dedication:moderate",
    "poll:read",
    "poll:write",
    "analytics:read",
    "notification:read",
  ],
  HOST: [
    "radio:read",
    "stream:read",
    "program:read",
    "show:read",
    "podcast:read",
    "message:read",
    "message:write",
    "dedication:read",
    "poll:read",
    "analytics:read",
    "notification:read",
  ],
  ANALYST: [
    "radio:read",
    "stream:read",
    "analytics:read",
    "analytics:export",
    "campaign:read",
    "advertiser:read",
    "notification:read",
  ],
  ADVERTISER: [
    "radio:read",
    "campaign:read",
    "campaign:write",
    "advertiser:read",
    "analytics:read",
    "notification:read",
  ],
  SUPPORT: [
    "radio:read",
    "ticket:read",
    "ticket:write",
    "ticket:assign",
    "user:read",
    "audit:read",
    "notification:read",
  ],
  LISTENER: [
    "radio:read",
    "message:read",
    "message:write",
    "poll:read",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canManageRadio(role: UserRole): boolean {
  return ["SUPER_ADMIN", "RADIO_OWNER", "RADIO_ADMIN"].includes(role);
}

export function canEditContent(role: UserRole): boolean {
  return [
    "SUPER_ADMIN",
    "RADIO_OWNER",
    "RADIO_ADMIN",
    "EDITOR",
    "HOST",
  ].includes(role);
}

export function canViewAnalytics(role: UserRole): boolean {
  return [
    "SUPER_ADMIN",
    "RADIO_OWNER",
    "RADIO_ADMIN",
    "ANALYST",
  ].includes(role);
}

export function canManageBilling(role: UserRole): boolean {
  return ["SUPER_ADMIN", "RADIO_OWNER"].includes(role);
}
