import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const news = await readData("news");
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  res.json(sorted);
});

router.post("/", requireAuth, async (req, res) => {
  const news = await readData("news");
  const body = req.body || {};

  if (!body.title || !body.date) {
    return res.status(400).json({ error: "Titre et date requis" });
  }

  const item = {
    id: body.id || `n${Date.now()}`,
    date: body.date,
    title: body.title,
    titleAr: body.titleAr || "",
    body: body.body || "",
    bodyAr: body.bodyAr || "",
  };

  news.push(item);
  await writeData("news", news);
  res.status(201).json(item);
});

router.put("/:id", requireAuth, async (req, res) => {
  const news = await readData("news");
  const index = news.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Annonce introuvable" });

  news[index] = { ...news[index], ...(req.body || {}), id: news[index].id };
  await writeData("news", news);
  res.json(news[index]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const news = await readData("news");
  const index = news.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Annonce introuvable" });

  const [removed] = news.splice(index, 1);
  await writeData("news", news);
  res.json(removed);
});

export default router;
