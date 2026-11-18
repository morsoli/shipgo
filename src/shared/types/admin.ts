export type AdminUserListItem = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: "admin" | "user"
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

export type AdminUserDetail = AdminUserListItem

export type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
