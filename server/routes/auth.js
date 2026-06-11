import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readData } from "../utils/db.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Identifiant et mot de passe requis" });
  }

  const admin = await readData("admin");

  if (username !== admin.username) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, username });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

export default router;
