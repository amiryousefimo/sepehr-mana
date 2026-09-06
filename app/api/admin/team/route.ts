import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {readTeam, writeTeam, type TeamMember} from "@/lib/store";

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

  const team = await readTeam();
  return NextResponse.json({team});
}

export async function PUT(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401});
  }

  const body = await request.json() as {team?: TeamMember[]};
  if (!Array.isArray(body.team)) {
    return NextResponse.json({error: "Invalid payload. Expected {team: TeamMember[]}."}, {status: 400});
  }

  await writeTeam(body.team);
  return NextResponse.json({ok: true});
}
