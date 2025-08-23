const fs = require("fs");

const lines = fs
  .readFileSync("./tax_dataset_prepared.jsonl", "utf-8")
  .split("\n")
  .filter(Boolean);

lines.forEach((line, i) => {
  try {
    JSON.parse(line);
  } catch (e) {
    console.error(`Ошибка на строке ${i + 1}`, e);
  }
});
