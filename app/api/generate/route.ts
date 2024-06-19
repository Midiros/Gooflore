import { NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a creative author that makes up conspiracy theories based on the user's prompt."},
                {role: "user", content: prompt}],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
    });

    return NextResponse.json({ text: response.choices[0]!.message?.content});
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}
