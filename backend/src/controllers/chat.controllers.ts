import { Request, Response, NextFunction } from "express";
import { ChatDb } from "../models/db";
import { getAIResponse } from "../services/openai.service";

export async function sendUserMessage(
  req: Request,
  res: Response,
  _next: NextFunction
) {

  const language = req.body.language ? req.body.language : "en";
  // Save user message in the mock DB
  ChatDb.messages.push({
    role: "user",
    text: req.body.userMessage,
    language: language,
  });

  // Get a response from OpenAI
  const aiReply = await getAIResponse(req.body.userMessage, language);

  // Save AI message in mock DB
  ChatDb.messages.push({
    role: "assistant",
    text: aiReply,
    language: language,
  });

  return res.status(200).json({ response: aiReply });
}
