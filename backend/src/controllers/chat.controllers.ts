import { Request, Response, NextFunction } from "express";
import { processUserMessage } from "../services/chat.service";

export async function sendUserMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userMessage, language = "en", cefrLevel = "B1", model } = req.body;

    const aiReply = await processUserMessage(userMessage, language, cefrLevel, model);
    res.status(200).json({ response: aiReply });
  } catch (error) {
    next(error);
  }
}
