import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const redirectUrl=`${process.env.APP_URL}/api/auth/callback`
    const url=scalekit.getAuthorizationUrl(redirectUrl)
    return NextResponse.redirect(url)
}