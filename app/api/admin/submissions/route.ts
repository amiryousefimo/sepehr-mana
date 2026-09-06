import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {readContactSubmissions, readCollaborationSubmissions} from "@/lib/store";

export const runtime = "nodejs";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session")?.value ?? "";
  const secret = process.env.ADMIN_SECRET ?? "";
  return !!secret && session === secret;
}

export async function GET(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401});
  }

  const {searchParams} = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "contact") {
    const submissions = await readContactSubmissions();
    return NextResponse.json({submissions});
  }

  if (type === "collaboration") {
    const submissions = await readCollaborationSubmissions();
    return NextResponse.json({submissions});
  }

  return NextResponse.json({error: "Invalid type. Use ?type=contact or ?type=collaboration"}, {status: 400});
}
