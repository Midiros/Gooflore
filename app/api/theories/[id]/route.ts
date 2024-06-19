import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await redis!.get(id);
    if (!data) {
      return NextResponse.json({ error: "Theory not found" }, { status: 404 });
    }

    const theory = JSON.parse(data);
    return NextResponse.json(theory);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching theory" },
      { status: 500 }
    );
  }
}
