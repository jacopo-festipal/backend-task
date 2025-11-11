import { Configuration, OpenAIApi } from "openai";

const openaiApiKey = process.env["OPENAI_API_KEY"] ?? "";

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

/** available languages that can be selected from the frontend **/
const languageNames: Record<string, string> = {
  en: "English",
  it: "Italian",
  fr: "French",
  de: "German",
};

const cefrDescriptions: Record<string, string> = {
  A1: "Use very simple words with short sentences.",
  A2: "Use simple vocabulary and common phrases.",
  B1: "Use everyday language with good grammar.",
  B2: "Use a vast vocabulary with complex structures.",
  C1: "Use a sophisticated language level with high precision.",
  C2: "Use full language range at native speaking level.",
};

type Message = {
  role: "user" | "assistant" | "system";
  text: string;
  language: string;
};

/** Creates a prompt and fetches a response from OpenAI. */
export async function getAIResponse(
  messages: Message[],
  language: string = "en",
  cefrLevel: string = "B1",
  conversationTopic: string | null = null
): Promise<string> {
  try {
    const languageName = languageNames[language] || language;
    const cefrGuidance = cefrDescriptions[cefrLevel] || cefrDescriptions["B1"];
    const isFirstMessage = messages.length === 1;

    let systemPrompt = "";
    if (language === "en") {
      systemPrompt = `You are a language learning assistant. Adapt your responses to CEFR level ${cefrLevel}. ${cefrGuidance}`;
    } else {
      systemPrompt = `You are a language learning assistant. Respond in ${languageName}. Adapt the language complexity to CEFR level ${cefrLevel}. ${cefrGuidance}`;
    }

    if (isFirstMessage) {
      systemPrompt += ` A user's first message indicates their preferred topic of interest. Ask them what specifically they'd like to discuss about this topic.`;
    } else if (conversationTopic) {
      systemPrompt += ` Keep the conversation focused on the topic: "${conversationTopic}" abd guide the discussion back if it strays.`;
    }

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.text,
      })),
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
    });

    return completion.data.choices[0]?.message?.content || "(No response)";
  } catch (error: any) {
    console.error("Error calling OpenAI:", error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || "Unknown error from OpenAI API";

      if (status === 401) {
        throw new Error(`OpenAI API authentication failed with ${status}.`);
      } else if (status >= 500) {
        throw new Error("OpenAI service is currently unavailable.");
      } else {
        throw new Error(`OpenAI API error: ${message}`);
      }
    }

    throw new Error("Failed to generate AI response. Please try again.");
  }
}
