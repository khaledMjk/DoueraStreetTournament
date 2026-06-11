import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";
import { computeStandings } from "../utils/standings.js";

const router = Router();

router.get("/", async (req, res) => {
  const groups = await readData("groups");
  const teams = await readData("teams");
  const matches = await readData("matches");

  const result = groups.map((group) => ({
    ...group,
    standings: computeStandings(teams, matches, group.id),
  }));

  res.json(result);
});

router.post("/", requireAuth, async (req, res) => {
  const groups = await readData("groups");
  const body = req.body || {};

  if (!body.id || !body.name) {
    return res.status(400).json({ error: "Identifiant et nom requis" });
  }
  if (groups.some((g) => g.id === body.id)) {
    return res.status(409).json({ error: "Identifiant de groupe déjà utilisé" });
  }

  const group = { id: body.id, name: body.name, nameAr: body.nameAr || "" };
  groups.push(group);
  await writeData("groups", groups);
  res.status(201).json(group);
});

router.put("/:id", requireAuth, async (req, res) => {
  const groups = await readData("groups");
  const index = groups.findIndex((g) => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Groupe introuvable" });

  const body = req.body || {};
  groups[index] = { ...groups[index], ...body, id: groups[index].id };
  await writeData("groups", groups);
  res.json(groups[index]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const groups = await readData("groups");
  const index = groups.findIndex((g) => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Groupe introuvable" });

  const [removed] = groups.splice(index, 1);
  await writeData("groups", groups);
  res.json(removed);
});

export default router;
