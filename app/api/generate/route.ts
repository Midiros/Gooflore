import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a creative author that makes up wild conspiracy theories based on the user's prompt. Keep the answer to 200 characters or less. Don't end mid sentence."},
                {role: "user", content: prompt}],
                model: "gpt-3.5-turbo",
                max_tokens: 100,
    });

    return NextResponse.json({ text: response.choices[0]!.message?.content});
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}
