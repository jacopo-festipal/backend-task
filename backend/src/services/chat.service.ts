import { ChatDb } from "../models/db";
import { getAIResponse } from "./openai.service";

export async function processUserMessage(
  userMessage: string,
  language: string = "en"
): Promise<string> {
  ChatDb.messages.push({
    role: "user",
    text: userMessage,
    language: language,
  });

  const aiReply = await getAIResponse(userMessage, language);

  ChatDb.messages.push({
    role: "assistant",
    text: aiReply,
    language: language,
  });

  return aiReply;
}
