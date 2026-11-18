import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm"
import { requireDb } from "@/db"
import { user } from "@/db/auth.schema"

export type UserListQuery = {
  page: number
  pageSize: number
  search?: string
  banned?: boolean
  emailVerified?: boolean
  sortBy: "name" | "email" | "createdAt" | "updatedAt"
  sortOrder: "asc" | "desc"
}

function userFilters(query: UserListQuery): SQL[] {
  const filters: SQL[] = []
  if (query.search) {
    filters.push(or(ilike(user.name, `%${query.search}%`), ilike(user.email, `%${query.search}%`))!)
  }
  if (query.banned !== undefined) filters.push(eq(user.banned, query.banned))
  if (query.emailVerified !== undefined) filters.push(eq(user.emailVerified, query.emailVerified))
  return filters
}

export async function listUsers(query: UserListQuery) {
  const db = requireDb()
  const filters = userFilters(query)
  const where = filters.length > 0 ? and(...filters) : undefined
  const sortColumn = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }[query.sortBy]
  const orderBy = query.sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn)

  const [items, totalRows] = await Promise.all([
    db
      .select()
      .from(user)
      .where(where)
      .orderBy(orderBy)
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize),
    db.select({ total: count() }).from(user).where(where),
  ])

  return { items, total: totalRows[0]?.total ?? 0 }
}

export async function findUserById(userId: string) {
  const [record] = await requireDb().select().from(user).where(eq(user.id, userId)).limit(1)
  return record ?? null
}

export async function findUserByCustomerId(customerId: string) {
  const [record] = await requireDb()
    .select()
    .from(user)
    .where(eq(user.billingCustomerId, customerId))
    .limit(1)
  return record ?? null
}

export async function setUserCustomerId(userId: string, customerId: string) {
  const [record] = await requireDb()
    .update(user)
    .set({ billingCustomerId: customerId, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning()
  return record ?? null
}

export async function listAllUserIds() {
  return requireDb().select({ id: user.id }).from(user)
}

export async function banUser(input: { userId: string; reason?: string; expiresAt?: Date }) {
  const [record] = await requireDb()
    .update(user)
    .set({
      banned: true,
      banReason: input.reason ?? null,
      banExpires: input.expiresAt ?? null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, input.userId))
    .returning()
  return record ?? null
}

export async function unbanUser(userId: string) {
  const [record] = await requireDb()
    .update(user)
    .set({ banned: false, banReason: null, banExpires: null, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning()
  return record ?? null
}
