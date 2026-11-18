import { useState } from "react"
import { Button } from "@/shared/components/ui/button"

export const CommandTab = (props: { code: string }) => {
  const generateCommand = (command: string) => {
    return {
      npm: `npx ${command}`,
      pnpm: `pnpm dlx ${command}`,
      yarn: `yarn dlx ${command}`,
      bun: `bunx ${command}`,
    }
  }
  const commands = generateCommand(props.code)
  const [manager, setManager] = useState<keyof typeof commands>("pnpm")
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex gap-1 border-b bg-muted/40 p-2">
        {Object.keys(commands).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={manager === name ? "secondary" : "ghost"}
            onClick={() => setManager(name as keyof typeof commands)}
          >
            {name}
          </Button>
        ))}
      </div>
      <pre className="overflow-x-auto p-4">
        <code>{commands[manager]}</code>
      </pre>
    </div>
  )
}
