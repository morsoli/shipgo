import { createServerFn } from "@tanstack/react-start"
import { type PublicConfig, publicConfig } from "@/config/public-config"

export const getConfigFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicConfig> => publicConfig
)
