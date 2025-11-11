import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.routes";
import correctionRouter from "./routes/correction.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/correct", correctionRouter);

// Fallback route (for unknown endpoints)
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

app.use(errorHandler);

export default app;
