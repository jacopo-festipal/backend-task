import { Configuration, OpenAIApi } from "openai";

const openaiApiKey = process.env["OPENAI_API_KEY"] ?? "";

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

/** Creates a prompt and fetches a response from OpenAI. */
export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Continue the conversation with the user. `,
        },
        { role: "user", content: userMessage },
      ],
    });

    const aiReply =
      completion.data.choices[0]?.message?.content || "(No response)";
    return aiReply;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("AI service error");
  }
}
