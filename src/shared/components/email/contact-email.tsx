import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export function ContactEmail({
  name,
  email,
  message,
  locale = "en",
}: {
  name: string
  email: string
  message: string
  locale?: string
}) {
  const title = locale === "zh" ? "新的联系表单消息" : "New contact form message"
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body
        style={{ backgroundColor: "#f6f7f9", fontFamily: "Arial, sans-serif", padding: "24px" }}
      >
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "28px" }}>
          <Heading>{title}</Heading>
          <Text>
            <strong>Name:</strong> {name}
          </Text>
          <Text>
            <strong>Email:</strong> {email}
          </Text>
          <Section style={{ whiteSpace: "pre-wrap" }}>{message}</Section>
        </Container>
      </Body>
    </Html>
  )
}
