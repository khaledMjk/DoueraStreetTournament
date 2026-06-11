import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const settings = await readData("settings");
  res.json(settings);
});

router.put("/", requireAuth, async (req, res) => {
  const settings = await readData("settings");
  const updated = { ...settings, ...(req.body || {}) };
  await writeData("settings", updated);
  res.json(updated);
});

export default router;
