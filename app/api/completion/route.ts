import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }
  const { text } = await generateText({
    model: openai("gpt-4.1-nano"),
    prompt: prompt,
  });
  if (!text) {
    return Response.json(
      { error: "Failed to generate completion" },
      { status: 500 }
    );
  }
  return Response.json({ text });
}
