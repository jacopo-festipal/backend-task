interface Message {
  role: "user" | "assistant" | "system";
  text: string;
  language: string;
}

export const ChatDb = {
  messages: [] as Message[],
  conversationTopic: null as string | null,
  userMessageCount: 0,
};
