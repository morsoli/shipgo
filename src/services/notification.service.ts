export type NotificationEvent = {
  title: string
  description: string
  fields?: Record<string, string | number | boolean | null | undefined>
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Notification request failed with status ${response.status}`)
}

export async function sendNotification(event: NotificationEvent): Promise<void> {
  const tasks: Promise<unknown>[] = []
  const fields = Object.entries(event.fields ?? {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([name, value]) => ({ name, value: String(value), inline: true }))

  if (process.env.DISCORD_WEBHOOK_URL) {
    tasks.push(
      postJson(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [{ title: event.title, description: event.description, fields }],
      })
    )
  }
  if (process.env.FEISHU_WEBHOOK_URL) {
    const details = fields.map((item) => `${item.name}: ${item.value}`).join("\n")
    tasks.push(
      postJson(process.env.FEISHU_WEBHOOK_URL, {
        msg_type: "text",
        content: { text: `${event.title}\n${event.description}${details ? `\n${details}` : ""}` },
      })
    )
  }

  const results = await Promise.allSettled(tasks)
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notification] Delivery failed", result.reason)
    }
  }
}
