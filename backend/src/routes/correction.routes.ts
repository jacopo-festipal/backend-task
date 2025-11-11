import { Router } from "express";
import { correctUserMessage } from "../controllers/correction.controller";
import { validateChatRequest } from "../middlewares/validation";

const router = Router();

router.post("/", validateChatRequest, correctUserMessage);

export default router;
