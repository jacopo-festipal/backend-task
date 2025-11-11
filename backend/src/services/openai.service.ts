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

const SUPPORTED_MODELS = [
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4o",
  "gpt-4o-mini",
] as const;

type SupportedModel = (typeof SUPPORTED_MODELS)[number];

type AIConfig = {
  messages: Message[];
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  language?: string;
  cefrLevel?: string;
  conversationTopic?: string | null;
  provideFeedback?: boolean;
};

export async function getAIResponse(config: AIConfig): Promise<string> {
  const {
    messages,
    systemPrompt: customSystemPrompt,
    model = "gpt-3.5-turbo",
    maxTokens,
    language = "en",
    cefrLevel = "B1",
    conversationTopic = null,
    provideFeedback = false,
  } = config;
  try {
    let systemPrompt: string;

    if (customSystemPrompt) {
      systemPrompt = customSystemPrompt;
    } else {
      const languageName = languageNames[language] || language;
      const cefrGuidance = cefrDescriptions[cefrLevel] || cefrDescriptions["B1"];
      const isFirstMessage = messages.length === 1;

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

      if (provideFeedback) {
        systemPrompt += `This is the user's 5th message. Please include the following in your response (always in ENGLISH): 1. A brief progress feedback on how they've been doing so far. 2. An interactive language learning exercise related to the conversation topic. This could be a multiple choice question, fill-in-the-blank, translation exercise. Make it engaging and relevant to what you've been discussing. Format your response like this: - First, continue the conversation naturally in ${languageName} - Then add: "📊 Progress Feedback (in English): [Your feedback here] - Interactive Exercise: [Your exercise here]"`;
      }
    }

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.text,
      })),
    ];

    const selectedModel = SUPPORTED_MODELS.includes(model as SupportedModel)
      ? (model as SupportedModel)
      : "gpt-3.5-turbo";

    const completionConfig: any = {
      model: selectedModel,
      messages: chatMessages,
    };

    if (maxTokens) {
      completionConfig.max_tokens = maxTokens;
    }

    const completion = await openai.createChatCompletion(completionConfig);

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
