interface Message {
  role: "user" | "assistant";
  text: string;
  language: string;
}

export const ChatDb = { messages: [] as Message[] };
