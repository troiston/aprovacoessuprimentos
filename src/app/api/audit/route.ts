import { NextResponse } from "next/server";
import { requireEditorForApi } from "@/lib/api/route-auth";
import { listRecentAuditLogs } from "@/lib/services/audit-list";

export async function GET(request: Request) {
  const userOrRes = await requireEditorForApi();
  if (userOrRes instanceof NextResponse) {
    return userOrRes;
  }

  const { searchParams } = new URL(request.url);
  const takeRaw = searchParams.get("take");
  const take = Math.min(Math.max(Number(takeRaw) || 200, 1), 500);

  const logs = await listRecentAuditLogs(take);
  return NextResponse.json({ logs });
}
