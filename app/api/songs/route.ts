import { NextResponse } from "next/server";
import OpenAI from "openai";

import connectDB from "../../lib/mongodb";
import Song from "../../models/Song";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req) {
  try {
    await connectDB();
    const songs = await Song.find({}).limit(10);
    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
// export async function GET() {
//   // let accessToken = localStorage.getItem('access_token');
//   const accessToken = process.env.SPOTIFY_CLIENT_SECRET;

//   try {
//     const repsonse = await fetch("https://api.spotify.com/v1/me", {
//       headers: {
//         Authorization: "Bearer " + accessToken,
//       },
//     });
//     return NextResponse.json({ repsonse });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch songs" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    const { userPreferences } = await req.json();
    const prompt = `Suggest 5 songs based on these preferences: ${userPreferences}`;
    const aiResponse = await openai.completions.create({
      model: "gpt-4",
      prompt,
      max_tokens: 100,
    });

    return NextResponse.json({
      recommendations: aiResponse.data.choices[0].text,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
