// src/index.ts
import "dotenv/config";
import express, { Request, Response } from "express";
import OpenAI from "openai";
import { llmConfig } from "./config/llm";
import cors from "cors";

const app = express();
const port: number = 3001;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Разрешаем запросы с фронта
app.use(
  cors({
    origin: "*", // можно "*" если пока не критично
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Для работы с JSON в POST-запросах
app.use(express.json());

// Простой GET-запрос (дефолтный prompt)
app.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

// POST-запрос: передаём свой prompt в JSON
app.post("/chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send("Не передан prompt");
    }

    const response = await client.responses.create({
      // model: "gpt-5-nano",
      model: "ft:gpt-3.5-turbo-0125:personal::C7SiLid6",
      input: [
        { role: "system", content: llmConfig.systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    res.json({ answer: response.output_text });
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Ошибка при запросе к OpenAI");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
