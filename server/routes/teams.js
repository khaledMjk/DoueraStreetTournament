import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

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

router.post("/", requireAuth, async (req, res) => {
  const teams = await readData("teams");
  const body = req.body || {};

  if (!body.name || !body.group) {
    return res.status(400).json({ error: "Nom et groupe requis" });
  }

  const id = body.id || `t${Date.now()}`;
  if (teams.some((t) => t.id === id)) {
    return res.status(409).json({ error: "Identifiant d'équipe déjà utilisé" });
  }

  const team = {
    id,
    name: body.name,
    nameAr: body.nameAr || "",
    shortName: body.shortName || body.name.slice(0, 3).toUpperCase(),
    group: body.group,
    color: body.color || "#1f7a3d",
    players: Array.isArray(body.players) ? body.players : [],
  };

  teams.push(team);
  await writeData("teams", teams);
  res.status(201).json(team);
});

router.put("/:id", requireAuth, async (req, res) => {
  const teams = await readData("teams");
  const index = teams.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Équipe introuvable" });

  const body = req.body || {};
  teams[index] = {
    ...teams[index],
    ...body,
    id: teams[index].id,
    players: Array.isArray(body.players) ? body.players : teams[index].players,
  };

  await writeData("teams", teams);
  res.json(teams[index]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const teams = await readData("teams");
  const index = teams.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Équipe introuvable" });

  const [removed] = teams.splice(index, 1);
  await writeData("teams", teams);
  res.json(removed);
});

export default router;
