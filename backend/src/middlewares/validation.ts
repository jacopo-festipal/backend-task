import { Request, Response, NextFunction } from "express";

const SUPPORTED_LANGUAGES = new Set(["en", "it", "fr", "de"]);

export function validateChatRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { userMessage, language } = req.body;

  if (!userMessage || typeof userMessage !== "string") {
    res.status(400).json({
      error: "Missing or invalid userMessage field. The string must not be empty.",
    });
    return;
  }

  if (userMessage.trim().length === 0) {
    res.status(400).json({
      error: "userMessage cannot be empty or whitespace only.",
    });
    return;
  }

  if (language && !SUPPORTED_LANGUAGES.has(language)) {
    res.status(400).json({
      error: `Invalid language '${language}'.`,
    });
    return;
  }

  next();
}
