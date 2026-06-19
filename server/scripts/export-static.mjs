// Export the JSON "database" as static API responses for a static (GitHub
// Pages) deployment of the client. Mirrors the read-only endpoints of the
// Express API. Run from the server/ directory: `node scripts/export-static.mjs`
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readData } from "../utils/db.js";
import { computeStandings, computeTopScorers } from "../utils/standings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "..", "client", "public", "data");

function sortMatches(matches) {
  return [...matches].sort((a, b) => {
    const dateA = `${a.date}T${a.time || "00:00"}`;
    const dateB = `${b.date}T${b.time || "00:00"}`;
    return dateA.localeCompare(dateB);
  });
}

async function writeJson(relativePath, data) {
  const filePath = path.join(OUT_DIR, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

async function main() {
  const [settings, teams, groups, matches, news] = await Promise.all([
    readData("settings"),
    readData("teams"),
    readData("groups"),
    readData("matches"),
    readData("news"),
  ]);

  await fs.rm(OUT_DIR, { recursive: true, force: true });

  const groupsWithStandings = groups.map((group) => ({
    ...group,
    standings: computeStandings(teams, matches, group.id),
  }));

  await Promise.all([
    writeJson("settings.json", settings),
    writeJson("teams.json", teams),
    writeJson("groups.json", groupsWithStandings),
    writeJson("matches.json", sortMatches(matches)),
    writeJson("news.json", [...news].sort((a, b) => b.date.localeCompare(a.date))),
    writeJson("topscorers.json", computeTopScorers(teams, matches, 100)),
    ...teams.map((team) => writeJson(path.join("teams", `${team.id}.json`), team)),
  ]);

  console.log(`Static data exported to ${OUT_DIR}`);
}

main();
