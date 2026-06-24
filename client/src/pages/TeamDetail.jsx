import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";
import TeamBadge from "../components/TeamBadge";
import MatchCard from "../components/MatchCard";
import { teamName } from "../utils/teams";

export default function TeamDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const fetcher = useCallback(() => api.getTeam(id), [id]);
  const { data: team, loading, error } = useApi(fetcher, [id]);
  const { matches, loading: matchesLoading } = useMatches({ teamId: id });
  const { teams } = useTeams();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!team) return <EmptyState message={t("common.error")} />;

  // Team totals from finished matches (group stage + knockout).
  const stats = matches.reduce(
    (acc, m) => {
      if (m.status !== "finished" || m.homeScore == null) return acc;
      const home = m.homeTeamId === id;
      acc.played += 1;
      acc.scored += home ? m.homeScore : m.awayScore;
      acc.conceded += home ? m.awayScore : m.homeScore;
      return acc;
    },
    { played: 0, scored: 0, conceded: 0 }
  );
  const statCards = [
    { value: stats.played, label: t("teams.matchesPlayed"), color: "text-pitch-900" },
    { value: stats.scored, label: t("stats.goalsFor"), color: "text-gold-600" },
    { value: stats.conceded, label: t("stats.goalsAgainst"), color: "text-crimson-600" },
  ];

  return (
    <div>
      <div className="bg-pitch-900 pitch-texture text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link to="/teams" className="text-sm font-semibold text-white/60 hover:text-gold-300">
            ← {t("teams.backToTeams")}
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <TeamBadge team={team} label={team.shortName} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {teamName(team, lang)}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {t("teams.group")} {team.group ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {team.photo && (
          <section>
            <img
              src={`${import.meta.env.BASE_URL}${team.photo}`}
              alt={teamName(team, lang)}
              loading="lazy"
              className="w-full rounded-2xl border border-pitch-100 object-cover shadow-sm"
            />
          </section>
        )}

        <section>
          <div className="grid grid-cols-3 gap-3">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-2xl border border-pitch-100 bg-white p-4 text-center shadow-sm">
                <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-pitch-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-pitch-900">{t("nav.matches")}</h2>
          {matchesLoading ? (
            <Loading />
          ) : matches.length === 0 ? (
            <div className="mt-4">
              <EmptyState message={t("matches.noMatches")} />
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} teams={teams} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
