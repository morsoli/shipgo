import { z } from "zod"
import {
  banUser,
  findUserById,
  listUsers,
  type UserListQuery,
  unbanUser,
} from "@/repositories/user.repository"
import type { AdminUserDetail, AdminUserListItem, PaginatedResponse } from "@/shared/types/admin"

export const adminUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
  banned: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  emailVerified: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const banUserSchema = z.object({
  reason: z.string().trim().max(500).optional(),
  expiresAt: z.coerce.date().optional(),
})

export const isAdminDemoMode = () => process.env.ADMIN_DEMO_MODE === "true"

export function toAdminUser(
  record: Awaited<ReturnType<typeof findUserById>> extends infer T ? NonNullable<T> : never
): AdminUserDetail {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    emailVerified: record.emailVerified,
    image: record.image,
    role: record.role === "admin" ? "admin" : "user",
    banned: Boolean(record.banned),
    banReason: record.banReason,
    banExpires: record.banExpires,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

export function sanitizeDemoUser(user: AdminUserDetail, index = 0): AdminUserDetail {
  return {
    ...user,
    id: `demo-user-${index + 1}`,
    name: `Demo User ${index + 1}`,
    email: `demo-user-${index + 1}@example.com`,
    image: null,
    banReason: user.banned ? "Demo account restriction" : null,
  }
}

function demoUsers(): AdminUserDetail[] {
  const now = new Date("2026-01-01T00:00:00.000Z")
  return [
    {
      id: "demo-user-1",
      name: "Demo User 1",
      email: "demo-user-1@example.com",
      emailVerified: true,
      image: null,
      role: "admin",
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-user-2",
      name: "Demo User 2",
      email: "demo-user-2@example.com",
      emailVerified: false,
      image: null,
      role: "user",
      banned: true,
      banReason: "Demo account restriction",
      banExpires: null,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export async function getAdminUsers(
  query: UserListQuery
): Promise<PaginatedResponse<AdminUserListItem>> {
  if (isAdminDemoMode()) {
    const items = demoUsers()
    return {
      items,
      pagination: { page: 1, pageSize: query.pageSize, total: items.length, totalPages: 1 },
    }
  }

  const result = await listUsers(query)
  return {
    items: result.items.map((item) => toAdminUser(item)),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total: result.total,
      totalPages: Math.ceil(result.total / query.pageSize),
    },
  }
}

export async function getAdminUser(userId: string): Promise<AdminUserDetail | null> {
  if (isAdminDemoMode()) {
    return demoUsers().find((item) => item.id === userId) ?? demoUsers()[0] ?? null
  }
  const record = await findUserById(userId)
  return record ? toAdminUser(record) : null
}

export function assertAdminWriteAllowed() {
  if (isAdminDemoMode()) {
    throw new Error("Demo administration is read-only")
  }
}

export async function setUserBan(
  userId: string,
  input: z.infer<typeof banUserSchema> | null
): Promise<AdminUserDetail | null> {
  assertAdminWriteAllowed()
  const record = input ? await banUser({ userId, ...input }) : await unbanUser(userId)
  return record ? toAdminUser(record) : null
}
