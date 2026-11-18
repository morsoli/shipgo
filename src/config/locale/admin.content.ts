import { type Dictionary, t } from "intlayer"

export default {
  key: "admin",
  content: {
    title: t({ en: "Admin Dashboard", zh: "管理后台" }),
    welcome: t({ en: "Welcome to the admin panel", zh: "欢迎来到管理面板" }),
    sidebar: {
      management: t({ en: "Management", zh: "管理" }),
      users: t({ en: "Users", zh: "用户管理" }),
      logout: t({ en: "Logout", zh: "退出登录" }),
    },
    users: {
      title: t({ en: "User Management", zh: "用户管理" }),
      description: t({
        en: "View and manage all registered users",
        zh: "查看和管理所有注册用户",
      }),
      count: t({ en: "users", zh: "位用户" }),
      empty: t({ en: "No users yet", zh: "暂无用户" }),
      emptyDesc: t({
        en: "Users will appear here once they sign up",
        zh: "用户注册后将显示在这里",
      }),
      verified: t({ en: "Verified", zh: "已验证" }),
      unverified: t({ en: "Unverified", zh: "未验证" }),
      role: t({ en: "Role", zh: "角色" }),
      banned: t({ en: "Banned", zh: "已禁用" }),
      actions: t({ en: "Actions", zh: "操作" }),
      viewDetail: t({ en: "View Details", zh: "查看详情" }),
      filter: {
        search: t({ en: "Search users...", zh: "搜索用户..." }),
        banned: t({ en: "Ban Status", zh: "封禁状态" }),
        all: t({ en: "All", zh: "全部" }),
        bannedOnly: t({ en: "Banned", zh: "已封禁" }),
        notBanned: t({ en: "Not Banned", zh: "未封禁" }),
        sortBy: t({ en: "Sort by", zh: "排序" }),
        createdAt: t({ en: "Created At", zh: "注册时间" }),
        name: t({ en: "Name", zh: "用户名" }),
        email: t({ en: "Email", zh: "邮箱" }),
        asc: t({ en: "Ascending", zh: "升序" }),
        desc: t({ en: "Descending", zh: "降序" }),
        reset: t({ en: "Reset", zh: "重置" }),
      },
      table: {
        name: t({ en: "Name", zh: "用户名" }),
        email: t({ en: "Email", zh: "邮箱" }),
        status: t({ en: "Status", zh: "状态" }),
        createdAt: t({ en: "Created At", zh: "注册时间" }),
      },
      detail: {
        title: t({ en: "User Details", zh: "用户详情" }),
        basicInfo: t({ en: "Basic Info", zh: "基本信息" }),
        actions: t({ en: "Actions", zh: "操作" }),
        ban: t({ en: "Ban User", zh: "禁用用户" }),
        unban: t({ en: "Unban User", zh: "解除禁用" }),
      },
    },
  },
} satisfies Dictionary
