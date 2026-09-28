import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// Temporary until CHG-008 ships the shared auth boundary; replace this call with that helper.
export async function getSignedInUserId(): Promise<string | null> {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
