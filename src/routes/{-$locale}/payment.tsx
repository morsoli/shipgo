import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { http } from "@/shared/lib/tools/http-client"
import { pageAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/{-$locale}/payment")({
  component: PaymentStatusPage,
  ssr: false,
  server: { middleware: [pageAuthMiddleware] },
})

function PaymentStatusPage() {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get("session_id")
  const requestedCallback = params.get("callback")
  const callback =
    requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//")
      ? requestedCallback
      : "/settings/billing"
  const query = useQuery({
    queryKey: ["payment-status", sessionId],
    queryFn: () =>
      http<{ paid: boolean; status: string | null }>(`/api/payment/status?sessionId=${sessionId}`),
    enabled: Boolean(sessionId),
    refetchInterval: (state) => (state.state.data?.paid ? false : 1500),
  })

  useEffect(() => {
    if (query.data?.paid) window.location.href = callback
  }, [query.data?.paid, callback])

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Confirming payment</h1>
      <p className="text-muted-foreground">
        {sessionId
          ? "Waiting for the payment provider to confirm your purchase."
          : "Missing payment session."}
      </p>
      {query.isError && <p className="text-sm text-destructive">Unable to confirm payment.</p>}
    </main>
  )
}
