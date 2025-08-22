// fineTune.js
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Не найден OPENAI_API_KEY в .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  try {
    // Загружаем файл для fine-tune
    const file = await openai.files.create({
      file: fs.createReadStream("./tax_dataset_prepared.jsonl"),
      purpose: "fine-tune",
    });

    console.log("Файл загружен:", file.id);

    // Создаём fine-tune
    const fineTune = await openai.fineTunes.create({
      training_file: file.id,
      model: "curie",
    });

    console.log("Fine-tune создан:", fineTune.id);
    console.log("Статус:", fineTune.status);
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

main();
