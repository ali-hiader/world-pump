// Lightweight helpers for cookie names used by middleware (Edge-safe)
// Keep this file free of any server-only imports.

export const ADMIN_COOKIE_NAME = 'admin_session'

export function getAdminCookieName(): string {
   return ADMIN_COOKIE_NAME
}

export const USER_SESSION_COOKIE_NAME = 'better-auth.session_token'

export function getUserSessionCookieName(): string {
   return USER_SESSION_COOKIE_NAME
}
