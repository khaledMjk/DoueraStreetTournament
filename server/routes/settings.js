import { Router } from "express";
import { readData } from "../utils/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const settings = await readData("settings");
  res.json(settings);
});

export default router;
