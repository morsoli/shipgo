import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

export function ResetPasswordEmail({
  resetLink,
  locale = "en",
}: {
  resetLink: string
  locale?: string
}) {
  const zh = locale === "zh"
  return (
    <Html>
      <Head />
      <Preview>{zh ? "重置你的 ShipGo 密码" : "Reset your ShipGo password"}</Preview>
      <Body
        style={{ backgroundColor: "#f6f7f9", fontFamily: "Arial, sans-serif", padding: "24px" }}
      >
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "28px" }}>
          <Heading>{zh ? "重置密码" : "Reset your password"}</Heading>
          <Text>
            {zh
              ? "点击下方按钮设置新密码。如果你没有发起请求，请忽略此邮件。"
              : "Use the button below to set a new password. Ignore this email if you did not request it."}
          </Text>
          <Button
            href={resetLink}
            style={{
              backgroundColor: "#111827",
              borderRadius: "6px",
              color: "#ffffff",
              padding: "12px 18px",
            }}
          >
            {zh ? "重置密码" : "Reset password"}
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
