import { Router } from "express";
import { readData } from "../utils/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const matches = await readData("matches");
  const { group, status, teamId } = req.query;

  let result = matches;
  if (group) result = result.filter((m) => m.group === group);
  if (status) result = result.filter((m) => m.status === status);
  if (teamId) {
    result = result.filter(
      (m) => m.homeTeamId === teamId || m.awayTeamId === teamId
    );
  }

  result = [...result].sort((a, b) => {
    const dateA = `${a.date}T${a.time || "00:00"}`;
    const dateB = `${b.date}T${b.time || "00:00"}`;
    return dateA.localeCompare(dateB);
  });

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const matches = await readData("matches");
  const match = matches.find((m) => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: "Match introuvable" });
  res.json(match);
});

export default router;
