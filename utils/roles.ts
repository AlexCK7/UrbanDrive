export type UserRole = "user" | "driver" | "admin";

export function hasRole(userRole: UserRole | undefined, allowed: UserRole[]) {
  return !!userRole && allowed.includes(userRole);
}
