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

/** Creates a prompt and fetches a response from OpenAI. */
export async function getAIResponse(
  userMessage: string,
  language: string = "en",
  cefrLevel: string = "B1"
): Promise<string> {
  try {
    const languageName = languageNames[language] || language;
    const cefrGuidance = cefrDescriptions[cefrLevel] || cefrDescriptions["B1"];

    const systemPrompt =
      language === "en"
        ? `You are a helpful language learning assistant. AContinue the conversation with the user wth level ${cefrLevel}. ${cefrGuidance}`
        : `You are a language learning assistant. Respond in ${languageName}. Adapt the complexity to the level ${cefrLevel}. ${cefrGuidance}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userMessage },
      ],
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
