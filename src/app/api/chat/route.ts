import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDb from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();
    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "message and owner id are required" },
        { status: 400 },
      );
    }
    await connectDb();
    const setting = await Settings.findOne({ ownerId });
    if (!setting) {
      return NextResponse.json(
        { message: "chatbot is not configured yet" },
        { status: 400 },
      );
    }

    const KNOWLWDGE = `
        Business Name - ${setting.businessName || "not provided"} 
        Business Email - ${setting.businessEmail || "not provided"}
        knowledge - ${setting.knowledge || "not provided"}
        `;

    const prompt = `
         You are a professional customer support assistant for this business.

         Use ONLY the information provided below to answer the customer's question.
         You may rephrease, summerize, or interpret the information is needed.
         Do NOT invent any policies, prices, or promises.

         If the customer's question is completely unrelated to the information, 
         or cannot be reasonable answered from it , reply exactly with:
         "Please contact support. "

         --------------------------------
         BUSINESS INFORMATION
         --------------------------------
         ${KNOWLWDGE}

         --------------------------------
           CUSTOMER QUESTION
        ------------------------------
         ${message}
         --------------------------------
         ANSWER
        `;

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const response= NextResponse.json({reply:res.text});
    response.headers.set("Access-Control-Allow-Origin","*");
    
    response.headers.set("Access-Control-Allow-Methods","POST , OPTIONS");
    response.headers.set("Access-Control-Allow-Headers","Content-Type, Authorization");

   return response;
  } catch (error) {
    const response= NextResponse.json(
      { message: "Error generating response from AI" },
      { status: 500 },
    );

    response.headers.set("Access-Control-Allow-Origin","*");
    
    response.headers.set("Access-Control-Allow-Methods","POST , OPTIONS");
    response.headers.set("Access-Control-Allow-Headers","Content-Type, Authorization");

    return response;

  }
}

export const OPTIONS=async()=>{
  return NextResponse.json(null,{
    status:201,
    headers:{
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"POST, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type, Authorization"
    }
  })
}
