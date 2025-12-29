import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    messages: await convertToModelMessages(messages),
  });

//   result?.usage?.then((usage) => {
//     console.log({
//         messageCount : messages.length,
//         inputTokens : usage.inputTokens,
//         outputTokens : usage.outputTokens,
//         totalTokens : usage.totalTokens,
//     });
//   });

  return result.toUIMessageStreamResponse();
}
