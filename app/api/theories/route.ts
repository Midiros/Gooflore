import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  try {
    const keys = await redis!.keys("*");
    const theories = [];

    for (const key of keys) {
      const data = await redis!.get(key);
      if (data) {
        theories.push(JSON.parse(data));
      }
    }

    return NextResponse.json(theories);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching theories" },
      { status: 500 }
    );
  }
}
