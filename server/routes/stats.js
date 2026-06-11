import { Router } from "express";
import { readData } from "../utils/db.js";
import { computeTopScorers } from "../utils/standings.js";

const router = Router();

router.get("/topscorers", async (req, res) => {
  const teams = await readData("teams");
  const matches = await readData("matches");
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  res.json(computeTopScorers(teams, matches, limit));
});

export default router;
