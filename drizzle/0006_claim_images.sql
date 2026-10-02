CREATE TABLE "claim_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid NOT NULL,
	"image_path" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "claim_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "claim_images" ADD CONSTRAINT "claim_images_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claim_images_claim_idx" ON "claim_images" USING btree ("claim_id");--> statement-breakpoint

-- CHG-028: bucket RIÊNG TƯ cho ảnh minh chứng của yêu cầu nhận lại (không public như report-images).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('claim-images', 'claim-images', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;--> statement-breakpoint

-- Người nhặt (chủ tin FOUND) đọc ảnh của người gửi yêu cầu. public.* bật RLS không policy nên kiểm tra qua hàm security definer.
CREATE OR REPLACE FUNCTION public.can_read_claim_image(p_name text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.claim_images ci
    JOIN public.claims c ON c.id = ci.claim_id
    JOIN public.reports r ON r.id = c.report_id
    WHERE ci.image_path = p_name AND r.user_id = auth.uid()
  );
$$;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.can_read_claim_image(text) FROM public, anon;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.can_read_claim_image(text) TO authenticated;--> statement-breakpoint

-- Mỗi user chỉ tải ảnh vào thư mục <user_id>/ của mình.
DROP POLICY IF EXISTS "claim_images_insert_own_folder" ON storage.objects;--> statement-breakpoint
CREATE POLICY "claim_images_insert_own_folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'claim-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);--> statement-breakpoint

-- Đọc (và tạo signed URL): người gửi (chủ thư mục), người nhặt của tin đó hoặc ADMIN.
DROP POLICY IF EXISTS "claim_images_select_parties_or_admin" ON storage.objects;--> statement-breakpoint
CREATE POLICY "claim_images_select_parties_or_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'claim-images'
    AND ((storage.foldername(name))[1] = (SELECT auth.uid())::text OR (SELECT public.can_read_claim_image(name)) OR (SELECT public.is_admin()))
  );
