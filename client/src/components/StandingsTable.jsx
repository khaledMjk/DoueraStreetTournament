import { useTranslation } from "react-i18next";
import TeamBadge from "./TeamBadge";
import { findTeam, teamName } from "../utils/teams";

export default function StandingsTable({ standings, teams }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const cols = [
    { key: "pos", label: t("groups.pos") },
    { key: "team", label: t("groups.team") },
    { key: "played", label: t("groups.played") },
    { key: "won", label: t("groups.won") },
    { key: "drawn", label: t("groups.drawn") },
    { key: "lost", label: t("groups.lost") },
    { key: "gf", label: t("groups.gf") },
    { key: "ga", label: t("groups.ga") },
    { key: "gd", label: t("groups.gd") },
    { key: "pts", label: t("groups.pts") },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-pitch-100 bg-white shadow-sm">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="bg-pitch-900 text-white">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-semibold ${
                  col.key === "team" ? "text-start" : "text-center"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => {
            const team = findTeam(teams, row.teamId);
            const isQualifying = idx < 2;
            return (
              <tr
                key={row.teamId}
                className={`border-t border-pitch-50 ${
                  isQualifying ? "bg-pitch-50/60" : ""
                }`}
              >
                <td className="px-3 py-2.5 text-center font-bold text-pitch-700">
                  <span className="inline-flex items-center gap-1.5">
                    {isQualifying && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                    )}
                    {idx + 1}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} label={row.name} size="sm" />
                    <span className="font-semibold text-pitch-900 truncate">
                      {team ? teamName(team, lang) : (lang === "ar" ? row.nameAr : row.name)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">{row.played}</td>
                <td className="px-3 py-2.5 text-center">{row.won}</td>
                <td className="px-3 py-2.5 text-center">{row.drawn}</td>
                <td className="px-3 py-2.5 text-center">{row.lost}</td>
                <td className="px-3 py-2.5 text-center">{row.goalsFor}</td>
                <td className="px-3 py-2.5 text-center">{row.goalsAgainst}</td>
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
