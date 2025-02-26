import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("Prompt:", prompt);
  console.log(prompt);
  try {
    console.log("creating recommendations");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a music recommendation assistant.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });
    let recommendation = response.choices[0].message.content;
    recommendation = recommendation.replace(/```json|```/g, "").trim();
    return NextResponse.json({
      recommendation: recommendation,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
