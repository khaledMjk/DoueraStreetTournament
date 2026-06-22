import { Router } from "express";
import { readData } from "../utils/db.js";
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

export default router;
