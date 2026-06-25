// app/api/insights/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/server/insights";
import { formatRawInsights } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const rawInsights = await generateInsights(prompt);
    const formatted = formatRawInsights(rawInsights);

    return NextResponse.json({ insights: formatted });
  } catch (error: any) {
    console.error("Error in /api/insights/generate:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate insights." },
      { status: 500 }
    );
  }
}