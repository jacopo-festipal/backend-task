import { ChatDb } from "../models/db";
import { getAIResponse } from "./openai.service";

export async function processUserMessage(
  userMessage: string,
  language: string = "en",
  cefrLevel: string = "B1",
  model: string = "gpt-3.5-turbo"
): Promise<string> {
  const isFirstMessage = ChatDb.messages.length === 0;

  if (isFirstMessage) {
    ChatDb.conversationTopic = userMessage;
  }

  ChatDb.messages.push({
    role: "user",
    text: userMessage,
    language: language,
  });

  const recentMessages = ChatDb.messages.slice(-4);

  const aiReply = await getAIResponse(
    recentMessages,
    language,
    cefrLevel,
    ChatDb.conversationTopic,
    model
  );

  ChatDb.messages.push({
    role: "assistant",
    text: aiReply,
    language: language,
  });

  return aiReply;
}
