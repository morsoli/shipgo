import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/auth-error")({
  component: AuthErrorPage,
})

function AuthErrorPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Authentication failed</h1>
      <p className="text-muted-foreground">
        The sign-in request could not be completed. Try again or contact support.
      </p>
      <a
        href="./login"
        className="text-primary underline underline-offset-4"
      >
        Return to sign in
      </a>
    </main>
  )
}
