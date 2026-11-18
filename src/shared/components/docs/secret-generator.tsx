import { CheckIcon, CopyIcon, KeyIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"

interface SecretGeneratorProps {
  label?: string
}

/**
 * Generate a URL-safe random secret using Web Crypto.
 */
function generateShipGoSecret(byteLength = 32): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength))
  let binary = ""
  for (const byte of randomBytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function SecretGenerator({ label = "Generate" }: SecretGeneratorProps) {
  const [secret, setSecret] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setSecret(generateShipGoSecret(32))
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!secret) return
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose my-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!secret}
          onClick={handleGenerate}
        >
          <KeyIcon className="size-4" />
          {label}
        </Button>
      </div>
      {secret && (
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm break-all">
            {secret}
          </code>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={copyToClipboard}
            aria-label="Copy secret"
          >
            {copied ? (
              <CheckIcon className="size-4 text-green-500" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
