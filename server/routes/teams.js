import { Router } from "express";
import { readData } from "../utils/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const teams = await readData("teams");
  res.json(teams);
});

router.get("/:id", async (req, res) => {
  const teams = await readData("teams");
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Équipe introuvable" });
  res.json(team);
});

export default router;
