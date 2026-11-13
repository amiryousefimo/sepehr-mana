import {cookies} from "next/headers";
import {readDidbanReport} from "@/lib/didban-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || cookies().get("admin_session")?.value !== secret) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }
  try {
    const report = await readDidbanReport();
    const download = new URL(request.url).searchParams.get("download") === "1";
    return Response.json(report, {headers: {
      "Cache-Control": "no-store",
      ...(download ? {"Content-Disposition": 'attachment; filename="didban-analysis.json"'} : {})
    }});
  } catch {
    return Response.json({error: "گزارش دیدبان موقتاً در دسترس نیست."}, {status: 503});
  }
}
