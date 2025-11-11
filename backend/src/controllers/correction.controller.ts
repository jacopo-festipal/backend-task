import { Request, Response, NextFunction } from "express";
import { getAIResponse } from "../services/openai.service";

export async function correctUserMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userMessage, language = "en" } = req.body;

    const systemPrompt =
      language === "en"
        ? "You are a language correction assistant. Correct any grammar, spelling, or syntax errors in the user's message. If the message is already correct, respond with 'Perfect message!' Provide only the corrected text or the 'Perfect message!' message and nothing else."
        : `You are a language correction assistant. Correct any grammar, spelling, or syntax errors in the user's message written in ${language}. If the message is already correct, respond with 'Perfect message!' Provide only the corrected text or the 'Perfect message!' message and nothing else.`;

    const correction = await getAIResponse({
      messages: [{ role: "user", text: userMessage, language }],
      systemPrompt,
      model: "gpt-3.5-turbo",
      language,
    });

    res.status(200).json({ correction });
  } catch (error) {
    next(error);
  }
}
