import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { type ActionResult, actionFailure } from "@/core/action-result"
import { auth } from "@/shared/lib/auth/auth-server"
import { Resp } from "@/shared/lib/tools/response"
import { isAuthConfigured } from "../lib/auth/auth-config"

type Session = typeof auth extends null
  ? null
  : Awaited<ReturnType<NonNullable<typeof auth>["api"]["getSession"]>>

type ActionAccessSession = { user: { role?: string | null } } | null

export function evaluateActionAccess(
  session: ActionAccessSession,
  options: { authenticated?: boolean; admin?: boolean; demoReadonly?: boolean },
  demoMode = process.env.ADMIN_DEMO_MODE === "true"
): ActionResult<never> | null {
  if ((options.authenticated || options.admin) && !session) {
    return actionFailure("UNAUTHORIZED", "Authentication required")
  }
  if (options.admin && session?.user.role !== "admin") {
    return actionFailure("FORBIDDEN", "Administrator access required")
  }
  if (options.demoReadonly && demoMode) {
    return actionFailure("DEMO_READONLY", "Demo administration is read-only")
  }
  return null
}

/**
 * session middleware, pass session to handler context (can be null)
 */
export const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  if (!isAuthConfigured || !auth) {
    return await next({ context: { session: null } })
  }
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return await next({ context: { session } })
  } catch (error) {
    console.error("[sessionMiddleware] Failed to get session:", error)
    return await next({ context: { session: null } })
  }
})

export const actionAuthMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    const failure = evaluateActionAccess(context.session, { authenticated: true })
    if (failure) throw failure
    return await next({ context: { session: context.session as NonNullable<Session> } })
  })

export const actionAdminMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    const failure = evaluateActionAccess(context.session, { admin: true })
    if (failure) throw failure
    return await next({ context: { session: context.session as NonNullable<Session> } })
  })

export const demoReadonlyActionAdminMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    const failure = evaluateActionAccess(context.session, { admin: true, demoReadonly: true })
    if (failure) throw failure
    return await next({ context: { session: context.session as NonNullable<Session> } })
  })

/**
 * API auth middleware, require user to be logged in, returns HTTP error responses
 * Use this for API routes (/api/*)
 */
export const apiAuthMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!isAuthConfigured) {
      return Resp.error("Authentication is not configured", 503)
    }
    if (!context.session) {
      return Resp.error("Unauthorized", 401, "FORBIDDEN")
    }
    return await next({ context: { session: context.session as NonNullable<Session> } })
  })

/**
 * Page auth middleware, redirects to login page if user is not logged in
 * Use this for page routes
 */
export const pageAuthMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!isAuthConfigured) {
      throw redirect({ to: "/{-$locale}/404" })
    }
    if (!context.session) {
      throw redirect({ to: "/{-$locale}/login" })
    }
    if (process.env.EMAIL_VERIFICATION_ENABLED === "true" && !context.session.user.emailVerified) {
      throw redirect({ to: "/{-$locale}/verify-email" })
    }
    return await next({ context: { session: context.session as NonNullable<Session> } })
  })

/**
 * API admin middleware, requires admin role, returns HTTP error responses
 * Use this for admin API routes (/api/admin/*)
 */
export const apiAdminMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!isAuthConfigured) {
      return Resp.error("Authentication is not configured", 503)
    }
    if (!context.session) {
      return Resp.error("Unauthorized", 401, "FORBIDDEN")
    }

    if (context.session.user.role !== "admin") {
      return Resp.error("Forbidden", 403, "FORBIDDEN")
    }

    return await next()
  })

/**
 * Page admin middleware, requires admin role, redirects to 404 if not admin
 * Use this for admin page routes
 */
export const pageAdminMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!isAuthConfigured) {
      throw redirect({ to: "/{-$locale}/404" })
    }
    if (!context.session) {
      throw redirect({ to: "/{-$locale}/login" })
    }
    if (process.env.EMAIL_VERIFICATION_ENABLED === "true" && !context.session.user.emailVerified) {
      throw redirect({ to: "/{-$locale}/verify-email" })
    }

    if (context.session.user.role !== "admin") {
      throw redirect({ to: "/{-$locale}/404" })
    }

    return await next()
  })
