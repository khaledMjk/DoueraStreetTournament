import { useTranslation } from "react-i18next";
import TeamBadge from "./TeamBadge";
import { findTeam, teamName } from "../utils/teams";

// How many third-placed teams advance to the knockout stage.
const QUALIFY_COUNT = 8;

// Same tiebreakers as the group standings: points, then goal difference,
// then goals scored, then name.
function compareRows(a, b) {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.name.localeCompare(b.name);
}

// Collect each group's third-placed team and rank them across all groups. The
// best QUALIFY_COUNT advance to the knockout round; the rest are shown too.
function bestThirds(groups) {
  return groups
    .map((group) => {
      const third = group.standings?.[2];
      return third ? { ...third, group: group.id } : null;
    })
    .filter(Boolean)
    .sort(compareRows);
}

export default function BestThirdsTable({ groups, teams }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const rows = bestThirds(groups);
  if (rows.length === 0) return null;

  const hideOnMobile = "hidden sm:table-cell";
  const cols = [
    { key: "pos", label: t("groups.pos") },
    { key: "grp", label: t("groups.grp") },
    { key: "team", label: t("groups.team") },
    { key: "played", label: t("groups.played") },
    { key: "won", label: t("groups.won"), cls: hideOnMobile },
    { key: "drawn", label: t("groups.drawn"), cls: hideOnMobile },
    { key: "lost", label: t("groups.lost"), cls: hideOnMobile },
    { key: "gf", label: t("groups.gf"), cls: hideOnMobile },
    { key: "ga", label: t("groups.ga"), cls: hideOnMobile },
    { key: "gd", label: t("groups.gd") },
    { key: "pts", label: t("groups.pts") },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-pitch-100 bg-white shadow-sm">
      <table className="w-full text-sm sm:min-w-[560px]">
        <thead>
          <tr className="bg-pitch-900 text-white">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-semibold ${
                  col.key === "team" ? "text-start" : "text-center"
                } ${col.cls || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const team = findTeam(teams, row.teamId);
            const isQualifying = idx < QUALIFY_COUNT;
            return (
              <tr
                key={row.teamId}
                className={`${
                  idx === QUALIFY_COUNT
                    ? "border-t-2 border-dashed border-gold-300"
                    : "border-t border-pitch-50"
                } ${isQualifying ? "bg-pitch-50/60" : "text-pitch-400"}`}
              >
                <td className="px-3 py-2.5 text-center font-bold text-pitch-700">
                  <span className="inline-flex items-center gap-1.5">
                    {isQualifying && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                    )}
                    {idx + 1}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold text-pitch-700">
                  {row.group}
                </td>
                <td className="px-2 py-2.5 sm:px-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} label={row.name} size="sm" />
                    <span className="max-w-[120px] truncate font-semibold text-pitch-900 sm:max-w-none">
                      {team ? teamName(team, lang) : (lang === "ar" ? row.nameAr : row.name)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">{row.played}</td>
                <td className={`px-3 py-2.5 text-center ${hideOnMobile}`}>{row.won}</td>
                <td className={`px-3 py-2.5 text-center ${hideOnMobile}`}>{row.drawn}</td>
                <td className={`px-3 py-2.5 text-center ${hideOnMobile}`}>{row.lost}</td>
                <td className={`px-3 py-2.5 text-center ${hideOnMobile}`}>{row.goalsFor}</td>
                <td className={`px-3 py-2.5 text-center ${hideOnMobile}`}>{row.goalsAgainst}</td>
                <td className="px-3 py-2.5 text-center font-semibold">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="px-3 py-2.5 text-center font-extrabold text-pitch-900">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
