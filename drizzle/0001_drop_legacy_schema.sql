-- CHG-014: schema cũ (CHG-007, enum chữ thường) không khớp ERD mới; dữ liệu chỉ là dữ liệu test, đã được chủ dự án đồng ý xóa.
DROP TABLE IF EXISTS "claims" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "reports" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "users" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."claim_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."report_category";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."report_location";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."report_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."report_type";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."user_role";
