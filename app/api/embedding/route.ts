import { NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST() {
  try {
    const embedding = fetch("https://api.openai.com/v1/embeddings");

    console.log("embedding", embedding);
    return NextResponse.json({
      embedding: embedding,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
