import { randomUUID } from "node:crypto"

export type ShipGoIdScope = "ord" | "wal" | "ldg" | "req"

/**
 * Generate a scoped, URL-safe identifier owned by ShipGo.
 */
export function createShipGoId(scope: ShipGoIdScope): string {
  return `sg_${scope}_${randomUUID().replace(/-/g, "")}`
}
