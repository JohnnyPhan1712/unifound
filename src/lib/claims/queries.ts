import { db } from "@/db";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function getClaimsByReport(reportId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const report = await db.query.reports.findFirst({
    where: (reports, { eq }) => eq(reports.id, reportId),
  });

  if (!report || report.userId !== user.id) {
    return [];
  }

  return await db.query.claims.findMany({
    where: (claims, { eq }) => eq(claims.reportId, reportId),
    with: {
      claimant: true,
    },
    orderBy: (claims, { desc }) => [desc(claims.createdAt)],
  });
}
