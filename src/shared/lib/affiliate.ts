export function getAffiliateMetadata(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const affonso = localStorage.getItem("shipgo_affiliate")
  const promoteKit = localStorage.getItem("shipgo_promotekit")
  return {
    ...(affonso ? { affonso } : {}),
    ...(promoteKit ? { promoteKit } : {}),
  }
}
