import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        { message: "ownerId is required" },
        { status: 400 }
      );
    }

    const setting = await Settings.findOne({ ownerId });

    return NextResponse.json(setting || {}, { status: 200 });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json(
      { message: "get error settings" },
      { status: 500 }
    );
  }
}
