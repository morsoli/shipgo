import { createFileRoute } from "@tanstack/react-router"
import { businessConfig } from "@/config/business-config"
import { Resp } from "@/shared/lib/tools/response"

export const Route = createFileRoute("/api/credit/packages")({
  server: {
    handlers: {
      GET: async () =>
        Resp.success(
          businessConfig.creditPackages
            .filter((item) => Boolean(item.priceId))
            .map((item) => ({
              id: item.id,
              name: item.id,
              description: null,
              creditAmount: item.amount,
              expireDays: item.expireDays,
              priceAmount: item.price * 100,
              currency: "USD",
              stripePriceId: item.priceId,
              sortOrder: 0,
              isActive: true,
              createdAt: new Date(0),
              updatedAt: null,
            }))
        ),
    },
  },
})
