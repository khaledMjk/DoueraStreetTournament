import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import teamsRoutes from "./routes/teams.js";
import groupsRoutes from "./routes/groups.js";
import matchesRoutes from "./routes/matches.js";
import settingsRoutes from "./routes/settings.js";
import newsRoutes from "./routes/news.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/teams", teamsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/stats", statsRoutes);

// Serve the built frontend in production
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`Douera Tournament API running on http://localhost:${PORT}`);
});
