import { Router } from "express";
import { sendUserMessage } from "../controllers/chat.controllers";
import { validateChatRequest } from "../middlewares/validation";

const router = Router();

router.post("/", validateChatRequest, sendUserMessage);

export default router;
