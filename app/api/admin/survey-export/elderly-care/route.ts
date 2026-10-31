import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {
  buildElderlyCareSurveyWorkbook,
  elderlyCareExportFilename
} from "@/lib/elderly-care-survey-export";
import {readElderlyCareSurveySubmissions} from "@/lib/store";

export const runtime = "nodejs";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session")?.value ?? "";
  const secret = process.env.ADMIN_SECRET ?? "";
  return !!secret && session === secret;
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401});
  }

  const records = await readElderlyCareSurveySubmissions();
  const buffer = buildElderlyCareSurveyWorkbook(records);
  const filename = elderlyCareExportFilename();

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store"
    }
  });
}
