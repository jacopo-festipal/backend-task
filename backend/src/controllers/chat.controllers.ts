import { Request, Response, NextFunction } from "express";
import { processUserMessage } from "../services/chat.service";

export async function sendUserMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userMessage, language = "en" } = req.body;
    const aiReply = await processUserMessage(userMessage, language);

    res.status(200).json({ response: aiReply });
  } catch (error) {
    next(error);
  }
}
