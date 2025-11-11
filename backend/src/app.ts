import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);

// Fallback route (for unknown endpoints)
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global error handler
// app.use(errorHandler);

export default app;
