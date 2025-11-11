import { Request, Response, NextFunction } from "express";

const SUPPORTED_LANGUAGES = new Set(["en", "it", "fr", "de"]);
const SUPPORTED_CEFR_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const SUPPORTED_MODELS = new Set([
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4o",
  "gpt-4o-mini",
]);

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

  const { cefrLevel } = req.body;
  if (cefrLevel && !SUPPORTED_CEFR_LEVELS.has(cefrLevel)) {
    res.status(400).json({
      error: `Invalid CEFR level '${cefrLevel}'. Supported levels are: ${Array.from(SUPPORTED_CEFR_LEVELS).join(", ")}`,
    });
    return;
  }

  const { model } = req.body;
  if (model && !SUPPORTED_MODELS.has(model)) {
    res.status(400).json({
      error: `Invalid model '${model}'. Supported models are: ${Array.from(SUPPORTED_MODELS).join(", ")}`,
    });
    return;
  }

  next();
}
