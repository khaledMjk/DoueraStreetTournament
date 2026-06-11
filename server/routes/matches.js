import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

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

router.post("/", requireAuth, async (req, res) => {
  const matches = await readData("matches");
  const body = req.body || {};

  if (!body.date || !body.round) {
    return res.status(400).json({ error: "Date et round requis" });
  }

  const id = body.id || `m${Date.now()}`;
  if (matches.some((m) => m.id === id)) {
    return res.status(409).json({ error: "Identifiant de match déjà utilisé" });
  }

  const match = {
    id,
    group: body.group ?? null,
    round: body.round,
    roundAr: body.roundAr || "",
    date: body.date,
    time: body.time || "16:00",
    venue: body.venue || "",
    venueAr: body.venueAr || "",
    homeTeamId: body.homeTeamId ?? null,
    awayTeamId: body.awayTeamId ?? null,
    homeLabel: body.homeLabel || "",
    homeLabelAr: body.homeLabelAr || "",
    awayLabel: body.awayLabel || "",
    awayLabelAr: body.awayLabelAr || "",
    homeScore: body.homeScore ?? null,
    awayScore: body.awayScore ?? null,
    status: body.status || "scheduled",
    scorers: Array.isArray(body.scorers) ? body.scorers : [],
  };

  matches.push(match);
  await writeData("matches", matches);
  res.status(201).json(match);
});

router.put("/:id", requireAuth, async (req, res) => {
  const matches = await readData("matches");
  const index = matches.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Match introuvable" });

  const body = req.body || {};
  matches[index] = {
    ...matches[index],
    ...body,
    id: matches[index].id,
    scorers: Array.isArray(body.scorers) ? body.scorers : matches[index].scorers,
  };

  await writeData("matches", matches);
  res.json(matches[index]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const matches = await readData("matches");
  const index = matches.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Match introuvable" });

  const [removed] = matches.splice(index, 1);
  await writeData("matches", matches);
  res.json(removed);
});

export default router;
