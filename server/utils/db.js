import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

function dataPath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readData(name) {
  const raw = await fs.readFile(dataPath(name), "utf-8");
  return JSON.parse(raw);
}

export async function writeData(name, data) {
  await fs.writeFile(dataPath(name), JSON.stringify(data, null, 2) + "\n", "utf-8");
}
