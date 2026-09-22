CREATE TYPE "public"."claim_status" AS ENUM('pending', 'accepted', 'rejected', 'closed');--> statement-breakpoint
CREATE TYPE "public"."report_category" AS ENUM('electronics', 'wallet-docs', 'keys', 'clothing', 'study', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_location" AS ENUM('H1', 'H2', 'H3', 'H6', 'parking', 'canteen', 'sports', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'pending', 'accepted', 'returned', 'closed');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('lost', 'found');--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"claimant_id" uuid NOT NULL,
	"proof" text NOT NULL,
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "report_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "report_category" NOT NULL,
	"location" "report_location" NOT NULL,
	"description" text NOT NULL,
	"event_date" date NOT NULL,
	"image_url" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_claimant_id_users_id_fk" FOREIGN KEY ("claimant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_accepted_claim_per_report" ON "claims" USING btree ("report_id") WHERE "claims"."status" = 'accepted';