import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }
  try {
    const result = await streamText({
      model: openai("gpt-4.1-nano"),
      prompt: prompt,
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Failed to stram text", { status: 500 });
  }
}
