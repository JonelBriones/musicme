import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
  store: true,
});

console.log(completion.choices[0].message);

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
      store: true,
    });
    const haiku = completion.choices[0].message;

    return NextResponse.json({
      haiku: haiku,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
// export async function POST(req) {
//   try {
//     const { userPreferences } = await req.json();
//     const prompt = `Suggest 5 songs based on these preferences: ${userPreferences}`;
//     const aiResponse = await openai.completions.create({
//       model: "gpt-4",
//       prompt,
//       max_tokens: 100,
//     });

//     return NextResponse.json({
//       recommendations: aiResponse.data.choices[0].text,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to generate recommendations" },
//       { status: 500 }
//     );
//   }
// }
