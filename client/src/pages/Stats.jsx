import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import TeamBadge from "../components/TeamBadge";
import { useTopScorers } from "../hooks/useTopScorers";
import { useTeams } from "../hooks/useTeams";
import { findTeam } from "../utils/teams";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";

export default function Stats() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { scorers, loading, error } = useTopScorers(20);
  const { teams, loading: teamsLoading } = useTeams();

  if (loading || teamsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader title={t("stats.title")} subtitle={t("stats.subtitle")} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-xl font-extrabold text-pitch-900 mb-4">{t("stats.topScorers")}</h2>
        {scorers.length === 0 ? (
          <EmptyState message={t("stats.noScorers")} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-pitch-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pitch-900 text-white">
                  <th className="px-3 py-3 text-center font-semibold">{t("stats.rank")}</th>
                  <th className="px-3 py-3 text-start font-semibold">{t("stats.player")}</th>
                  <th className="px-3 py-3 text-start font-semibold">{t("stats.team")}</th>
                  <th className="px-3 py-3 text-center font-semibold">{t("stats.goals")}</th>
                </tr>
              </thead>
              <tbody>
                {scorers.map((row, idx) => {
                  const team = findTeam(teams, row.teamId);
                  return (
                    <tr key={row.playerId} className="border-t border-pitch-50">
                      <td className="px-3 py-2.5 text-center font-extrabold text-pitch-700">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-pitch-900">
                        {lang === "ar" && row.nameAr ? row.nameAr : row.name}
                        <span className="ms-2 text-xs text-pitch-400">#{row.number}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <TeamBadge team={team} label={row.teamName} size="sm" />
                          <span className="text-pitch-700">
                            {lang === "ar" && row.teamNameAr ? row.teamNameAr : row.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-extrabold text-gold-600">
                        {row.goals}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
