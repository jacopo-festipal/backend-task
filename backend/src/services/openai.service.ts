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

/** Creates a prompt and fetches a response from OpenAI. */
export async function getAIResponse(
  userMessage: string,
  language: string = "en"
): Promise<string> {
  try {
    const languageName = languageNames[language] || language;
    const systemPrompt =
      language === "en"
        ? `You are a helpful assistant. Continue the conversation with the user.`
        : `You are a language assistant. Respond in ${languageName}.`;

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
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("AI service error");
  }
}
