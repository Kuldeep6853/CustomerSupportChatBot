import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  // delete your auth cookie
  (await cookieStore).delete("access_token");

  // redirect to home
  return NextResponse.redirect(new URL("/", req.url));
}
