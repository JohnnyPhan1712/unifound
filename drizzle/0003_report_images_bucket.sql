-- CHG-015: bucket ảnh tin đăng. Giới hạn dung lượng/định dạng do Storage chặn ở server.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('report-images', 'report-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;--> statement-breakpoint

-- public.users bật RLS không policy, nên kiểm tra quyền admin qua hàm security definer.
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'active'
  );
$$;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;--> statement-breakpoint

-- Mỗi user chỉ tải ảnh vào thư mục <user_id>/ của mình.
DROP POLICY IF EXISTS "report_images_insert_own_folder" ON storage.objects;--> statement-breakpoint
CREATE POLICY "report_images_insert_own_folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'report-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);--> statement-breakpoint

-- Xóa ảnh (kèm SELECT mà Storage API cần khi xóa): chủ thư mục hoặc ADMIN.
DROP POLICY IF EXISTS "report_images_select_owner_or_admin" ON storage.objects;--> statement-breakpoint
CREATE POLICY "report_images_select_owner_or_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'report-images' AND ((storage.foldername(name))[1] = (SELECT auth.uid())::text OR (SELECT public.is_admin())));--> statement-breakpoint
DROP POLICY IF EXISTS "report_images_delete_owner_or_admin" ON storage.objects;--> statement-breakpoint
CREATE POLICY "report_images_delete_owner_or_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'report-images' AND ((storage.foldername(name))[1] = (SELECT auth.uid())::text OR (SELECT public.is_admin())));
