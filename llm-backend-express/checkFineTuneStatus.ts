// checkFineTuneStatus.ts
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Не найден OPENAI_API_KEY в .env");
  process.exit(1);
}

if (!process.env.FT_JOB_ID) {
  console.error("Не найден FT_JOB_ID в .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const jobId = process.env.FT_JOB_ID;

async function waitForFineTune() {
  let status = "";
  console.log(`⏳ Отслеживаем статус fine-tune: ${jobId}`);

  while (status !== "succeeded" && status !== "failed") {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    status = job.status;
    console.log(`Текущий статус: ${status}`);

    if (status === "succeeded") {
      console.log("✅ Fine-tune завершён!");
      console.log("MODEL_ID:", job.fine_tuned_model);
      break;
    }

    if (status === "failed") {
      console.error("❌ Fine-tune не удался!");
      break;
    }

    // Ждём 20 секунд перед следующей проверкой
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
}

waitForFineTune();
