import { createServerFn } from "@tanstack/react-start"

// 服务端同步检查（给 middleware、auth-server 等纯服务端代码使用）
export const isAuthConfigured = !!process.env.BETTER_AUTH_SECRET && !!process.env.DATABASE_URL

export function getPublicAuthConfig() {
  return {
    enabled: isAuthConfigured,
    credentialLogin: process.env.CREDENTIAL_AUTH_ENABLED !== "false",
    googleLogin:
      process.env.GOOGLE_AUTH_ENABLED !== "false" &&
      !!process.env.GOOGLE_CLIENT_ID &&
      !!process.env.GOOGLE_CLIENT_SECRET,
    githubLogin:
      process.env.GITHUB_AUTH_ENABLED !== "false" &&
      !!process.env.GITHUB_CLIENT_ID &&
      !!process.env.GITHUB_CLIENT_SECRET,
  }
}

// Server function: 通过 loader 传递给客户端
export const getIsAuthEnabled = createServerFn({ method: "GET" }).handler(() => {
  return isAuthConfigured
})

export const getAuthPageConfig = createServerFn({ method: "GET" }).handler(getPublicAuthConfig)
