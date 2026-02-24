import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {ownerId,businessName,supportEmail,knowledge}=await req.json()
        if(!ownerId){
            return NextResponse.json({message:"owner id s required"},
                {status:400}
            )
        }
        await connectDb()
        const settings=await Settings.findOneAndUpdate(
          {ownerId:ownerId},
          {
            businessName,
            supportEmail,
            knowledge
          },
          {upsert:true,new:true}
        )
        return NextResponse.json({message:"settings updated",settings})
    } catch (error) {
        return NextResponse.json({message:"error updating settings"},{status:500})
    }
}
