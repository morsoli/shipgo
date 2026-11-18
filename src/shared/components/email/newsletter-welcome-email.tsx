import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components"

export function NewsletterWelcomeEmail({ locale = "en" }: { locale?: string }) {
  const zh = locale === "zh"
  return (
    <Html>
      <Head />
      <Preview>{zh ? "欢迎订阅 ShipGo" : "Welcome to the ShipGo newsletter"}</Preview>
      <Body
        style={{ backgroundColor: "#f6f7f9", fontFamily: "Arial, sans-serif", padding: "24px" }}
      >
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "28px" }}>
          <Heading>{zh ? "订阅成功" : "You are subscribed"}</Heading>
          <Text>
            {zh
              ? "你将收到产品更新、实用指南和重要服务通知。"
              : "You will receive product updates, practical guides, and important service notices."}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
