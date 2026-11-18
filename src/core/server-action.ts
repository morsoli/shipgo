import { createServerFn } from "@tanstack/react-start"
import {
  actionAdminMiddleware,
  actionAuthMiddleware,
  demoReadonlyActionAdminMiddleware,
} from "@/shared/middleware/auth.middleware"

type ActionMethod = "GET" | "POST"

export function publicAction(method: ActionMethod = "POST") {
  return createServerFn({ method })
}

export function authenticatedAction(method: ActionMethod = "POST") {
  return createServerFn({ method }).middleware([actionAuthMiddleware])
}

export function adminAction(method: ActionMethod = "POST") {
  return createServerFn({ method }).middleware([actionAdminMiddleware])
}

export function demoReadonlyAdminAction(method: ActionMethod = "POST") {
  return createServerFn({ method }).middleware([demoReadonlyActionAdminMiddleware])
}
