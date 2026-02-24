import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "Code not found" }, { status: 400 });
    }

    const redirectUrl = `${process.env.APP_URL}/api/auth/callback`;

    const session = await scalekit.authenticateWithCode(code, redirectUrl);
    const response = NextResponse.redirect(`${process.env.APP_URL}`);

    response.cookies.set("access_token", session.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 1 day in seconds
      secure:false,
      sameSite:"lax",
      path: "/",
    });
    return response;

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ message: "Authentication failed" }, { status: 500 });
  }
}
