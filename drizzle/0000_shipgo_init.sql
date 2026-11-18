CREATE TABLE "shipgo_billing_order" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text DEFAULT 'stripe' NOT NULL,
	"price_id" text NOT NULL,
	"billing_mode" text NOT NULL,
	"order_kind" text NOT NULL,
	"billing_interval" text,
	"customer_id" text NOT NULL,
	"subscription_id" text,
	"checkout_session_id" text,
	"external_invoice_id" text,
	"status" text NOT NULL,
	"settled" boolean DEFAULT false NOT NULL,
	"period_start_at" timestamp,
	"period_end_at" timestamp,
	"cancel_at_period_end" boolean,
	"trial_start_at" timestamp,
	"trial_end_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipgo_billing_order_external_invoice_id_unique" UNIQUE("external_invoice_id")
);
--> statement-breakpoint
CREATE TABLE "shipgo_credit_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entry_type" text NOT NULL,
	"summary" text,
	"delta" integer NOT NULL,
	"available_delta" integer,
	"billing_order_id" text,
	"expires_at" timestamp,
	"expired_processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipgo_credit_wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipgo_credit_wallet_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apikey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true,
	"rate_limit_enabled" boolean DEFAULT true,
	"rate_limit_time_window" integer DEFAULT 86400000,
	"rate_limit_max" integer DEFAULT 10,
	"request_count" integer DEFAULT 0,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"normalized_email" text,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"billing_customer_id" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_normalized_email_unique" UNIQUE("normalized_email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "shipgo_billing_order" ADD CONSTRAINT "shipgo_billing_order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipgo_credit_ledger" ADD CONSTRAINT "shipgo_credit_ledger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipgo_credit_wallet" ADD CONSTRAINT "shipgo_credit_wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_user_idx" ON "shipgo_billing_order" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_customer_idx" ON "shipgo_billing_order" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_mode_idx" ON "shipgo_billing_order" USING btree ("billing_mode");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_kind_idx" ON "shipgo_billing_order" USING btree ("order_kind");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_price_idx" ON "shipgo_billing_order" USING btree ("price_id");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_status_idx" ON "shipgo_billing_order" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_settled_idx" ON "shipgo_billing_order" USING btree ("settled");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_subscription_idx" ON "shipgo_billing_order" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_session_idx" ON "shipgo_billing_order" USING btree ("checkout_session_id");--> statement-breakpoint
CREATE INDEX "shipgo_billing_order_invoice_idx" ON "shipgo_billing_order" USING btree ("external_invoice_id");--> statement-breakpoint
CREATE INDEX "shipgo_credit_ledger_user_idx" ON "shipgo_credit_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_credit_ledger_type_idx" ON "shipgo_credit_ledger" USING btree ("entry_type");--> statement-breakpoint
CREATE INDEX "shipgo_credit_ledger_expires_idx" ON "shipgo_credit_ledger" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "shipgo_credit_wallet_user_idx" ON "shipgo_credit_wallet" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_account_external_idx" ON "account" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "shipgo_account_provider_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "shipgo_apikey_key_idx" ON "apikey" USING btree ("key");--> statement-breakpoint
CREATE INDEX "shipgo_apikey_user_idx" ON "apikey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "shipgo_session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipgo_user_id_idx" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX "shipgo_user_billing_customer_idx" ON "user" USING btree ("billing_customer_id");--> statement-breakpoint
CREATE INDEX "shipgo_user_role_idx" ON "user" USING btree ("role");