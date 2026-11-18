import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import type { CreditEntryType } from "@/core/credits/types"
import type {
  BillingMode,
  BillingOrderKind,
  PaymentProviderName,
  PaymentStatus,
  PlanInterval,
} from "@/core/payment/types"
import { user } from "./auth.schema"

export const billingOrder = pgTable(
  "shipgo_billing_order",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("stripe").$type<PaymentProviderName>(),
    priceId: text("price_id").notNull(),
    billingMode: text("billing_mode").notNull().$type<BillingMode>(),
    orderKind: text("order_kind").notNull().$type<BillingOrderKind>(),
    billingInterval: text("billing_interval").$type<PlanInterval>(),
    customerId: text("customer_id").notNull(),
    subscriptionId: text("subscription_id"),
    checkoutSessionId: text("checkout_session_id"),
    externalInvoiceId: text("external_invoice_id").unique(),
    status: text("status").notNull().$type<PaymentStatus>(),
    settled: boolean("settled").notNull().default(false),
    periodStartAt: timestamp("period_start_at"),
    periodEndAt: timestamp("period_end_at"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end"),
    trialStartAt: timestamp("trial_start_at"),
    trialEndAt: timestamp("trial_end_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("shipgo_billing_order_user_idx").on(table.userId),
    index("shipgo_billing_order_customer_idx").on(table.customerId),
    index("shipgo_billing_order_mode_idx").on(table.billingMode),
    index("shipgo_billing_order_kind_idx").on(table.orderKind),
    index("shipgo_billing_order_price_idx").on(table.priceId),
    index("shipgo_billing_order_status_idx").on(table.status),
    index("shipgo_billing_order_settled_idx").on(table.settled),
    index("shipgo_billing_order_subscription_idx").on(table.subscriptionId),
    index("shipgo_billing_order_session_idx").on(table.checkoutSessionId),
    index("shipgo_billing_order_invoice_idx").on(table.externalInvoiceId),
  ]
)

export const creditWallet = pgTable(
  "shipgo_credit_wallet",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("shipgo_credit_wallet_user_idx").on(table.userId)]
)

export const creditLedger = pgTable(
  "shipgo_credit_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entryType: text("entry_type").notNull().$type<CreditEntryType>(),
    summary: text("summary"),
    delta: integer("delta").notNull(),
    availableDelta: integer("available_delta"),
    billingOrderId: text("billing_order_id"),
    expiresAt: timestamp("expires_at"),
    expiredProcessedAt: timestamp("expired_processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("shipgo_credit_ledger_user_idx").on(table.userId),
    index("shipgo_credit_ledger_type_idx").on(table.entryType),
    index("shipgo_credit_ledger_expires_idx").on(table.expiresAt),
  ]
)
