import { NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function POST(request: Request) {
    const { theory } = await request.json();

    if (!theory) {
        return NextResponse.json({ error: "Theory is required" }, { status: 400 });
    }

    try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: theory + "The image evidence should be very goofy and very funny.",
          n: 1,
          size: "1024x1024",
        });

        const imageUrl = response.data[0].url;
        return NextResponse.json({ imageUrl });
    } catch (error) {
        return NextResponse.json(
        { error: "Error generating image" },
        { status: 500 }
        );
    }
}
