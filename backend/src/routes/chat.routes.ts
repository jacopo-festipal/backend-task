import { Router } from "express";
import { sendUserMessage } from "../controllers/chat.controllers";

const router = Router();

// POST /api/chat
router.post("/", sendUserMessage);

export default router;
