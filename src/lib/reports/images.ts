import { IMAGE_BUCKET } from "./schemas";

export function imageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}
