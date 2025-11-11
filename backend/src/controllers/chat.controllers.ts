import { Request, Response, NextFunction } from "express";
import { ChatDb } from "../models/db";
import { getAIResponse } from "../services/openai.service";

export async function sendUserMessage(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Save user message in the mock DB
  ChatDb.messages.push({
    role: "user",
    text: req.body.userMessage,
    language: "en",
  });

  // Get a response from OpenAI
  const aiReply = await getAIResponse(req.body.userMessage);

  // Save AI message in mock DB
  ChatDb.messages.push({
    role: "assistant",
    text: aiReply,
    language: "en",
  });

  return res.status(200).json({ response: aiReply });
}
