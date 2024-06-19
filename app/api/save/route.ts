import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const { prompt, theory, author } = await request.json();

  if (!prompt || !theory || !author) {
    return NextResponse.json(
      { error: "Prompt, theory, and author are required" },
      { status: 400 }
    );
  }

  try {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const item = {
      uuid: id,
      prompt,
      theory,
      author,
      created_at: createdAt,
    };
    await redis!.set(id, JSON.stringify(item)); // Uloz zaznam s vygenerovanym UUIDckem
    return NextResponse.json({ message: "Theory saved successfully", id, data: item });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed saving theory." },
      { status: 500 }
    );
  }
}
