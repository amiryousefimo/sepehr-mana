import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export const runtime = "nodejs";

function checkAdminCookie(): boolean {
  const session = cookies().get("admin_session")?.value ?? "";
  const secret = process.env.ADMIN_SECRET ?? "";
  return !!secret && session === secret;
}

export async function POST(request: Request) {
  const body = await request.json() as {password?: string};
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const adminSecret = process.env.ADMIN_SECRET ?? "";

  if (!adminPassword || !adminSecret) {
    return NextResponse.json(
      {error: "Admin credentials are not configured. Set ADMIN_PASSWORD and ADMIN_SECRET env vars."},
      {status: 503}
    );
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({error: "Invalid password."}, {status: 401});
  }

  cookies().set("admin_session", adminSecret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return NextResponse.json({ok: true});
}

export async function DELETE() {
  if (!checkAdminCookie()) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401});
  }

  cookies().delete("admin_session");
  return NextResponse.json({ok: true});
}
