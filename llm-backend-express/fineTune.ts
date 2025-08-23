// fineTune.ts
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Не найден OPENAI_API_KEY в .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main(): Promise<void> {
  try {
    // Загружаем файл для fine-tune
    const file = await openai.files.create({
      file: fs.createReadStream("./tax_dataset_prepared.jsonl"),
      purpose: "fine-tune",
    });

    console.log("Файл загружен:", file.id);

    // Создаём fine-tune
    const fineTuneJob = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: "gpt-3.5-turbo",
    });

    console.log("Fine-tune создан:", fineTuneJob.id);
    console.log("Статус:", fineTuneJob.status);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Ошибка:", err.message);
    } else {
      console.error("Неизвестная ошибка:", err);
    }
  }
}

main();
