import { Router } from "express";
import { readData } from "../utils/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const news = await readData("news");
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  res.json(sorted);
});

export default router;
