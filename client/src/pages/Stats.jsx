import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import TeamBadge from "../components/TeamBadge";
import { useTopScorers } from "../hooks/useTopScorers";
import { useTeams } from "../hooks/useTeams";
import { useMatches } from "../hooks/useMatches";
import { findTeam, teamName } from "../utils/teams";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";

function TeamStatTable({ rows, teams, lang, valueLabel, valueKey, accent }) {
  const { t } = useTranslation();
  if (rows.length === 0) return <EmptyState message={t("stats.noData")} />;
  return (
    <div className="overflow-hidden rounded-2xl border border-pitch-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-pitch-900 text-white">
            <th className="px-3 py-3 text-center font-semibold">{t("stats.rank")}</th>
            <th className="px-3 py-3 text-start font-semibold">{t("stats.team")}</th>
            <th className="px-3 py-3 text-center font-semibold">{t("stats.played")}</th>
            <th className="px-3 py-3 text-center font-semibold">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const team = findTeam(teams, row.teamId);
            return (
              <tr key={row.teamId} className="border-t border-pitch-50">
                <td className="px-3 py-2.5 text-center font-extrabold text-pitch-700">{idx + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} label={team?.shortName} size="sm" />
                    <span className="font-semibold text-pitch-900">
                      {team ? teamName(team, lang) : row.teamId}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center text-pitch-600">{row.played}</td>
                <td className={`px-3 py-2.5 text-center font-extrabold ${accent}`}>{row[valueKey]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Stats() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { scorers, loading, error } = useTopScorers(20);
  const { teams, loading: teamsLoading } = useTeams();
  const { matches, loading: matchesLoading } = useMatches();

  // Aggregate goals scored / conceded per team across all finished matches.
  const { bestAttack, bestDefense } = useMemo(() => {
    const s = {};
    const ensure = (id) => (s[id] ||= { teamId: id, gf: 0, ga: 0, played: 0 });
    for (const m of matches) {
      if (m.status !== "finished" || m.homeScore == null || !m.homeTeamId || !m.awayTeamId) continue;
      const h = ensure(m.homeTeamId);
      const a = ensure(m.awayTeamId);
      h.gf += m.homeScore; h.ga += m.awayScore; h.played += 1;
      a.gf += m.awayScore; a.ga += m.homeScore; a.played += 1;
    }
    const all = Object.values(s);
    return {
      bestAttack: [...all].sort((a, b) => b.gf - a.gf || a.ga - b.ga).slice(0, 8),
      bestDefense: [...all].sort((a, b) => a.ga - b.ga || b.played - a.played || b.gf - a.gf).slice(0, 8),
    };
  }, [matches]);

  if (loading || teamsLoading || matchesLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader title={t("stats.title")} subtitle={t("stats.subtitle")} />
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-pitch-900">{t("stats.topScorers")}</h2>
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
                        <td className="px-3 py-2.5 text-center font-extrabold text-pitch-700">{idx + 1}</td>
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
                        <td className="px-3 py-2.5 text-center font-extrabold text-gold-600">{row.goals}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 text-xl font-extrabold text-pitch-900">⚽ {t("stats.bestAttack")}</h2>
            <TeamStatTable rows={bestAttack} teams={teams} lang={lang}
              valueLabel={t("stats.goalsFor")} valueKey="gf" accent="text-gold-600" />
          </section>
          <section>
            <h2 className="mb-4 text-xl font-extrabold text-pitch-900">🛡️ {t("stats.bestDefense")}</h2>
            <TeamStatTable rows={bestDefense} teams={teams} lang={lang}
              valueLabel={t("stats.goalsAgainst")} valueKey="ga" accent="text-pitch-900" />
          </section>
        </div>
      </div>
    </div>
  );
}
