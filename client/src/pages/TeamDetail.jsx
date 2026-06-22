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
import { teamName, positionLabel } from "../utils/teams";

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
        <section>
          <h2 className="text-xl font-extrabold text-pitch-900">{t("teams.squad")}</h2>
          {!team.players || team.players.length === 0 ? (
            <div className="mt-4">
              <EmptyState message={t("teams.noPlayers")} />
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-pitch-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-pitch-900 text-white">
                    <th className="px-3 py-3 text-center font-semibold">#</th>
                    <th className="px-3 py-3 text-start font-semibold">{t("teams.playerName")}</th>
                    <th className="px-3 py-3 text-center font-semibold">{t("teams.position")}</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player) => (
                    <tr key={player.id} className="border-t border-pitch-50">
                      <td className="px-3 py-2.5 text-center font-extrabold text-pitch-700">
                        {player.number}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-pitch-900">
                        {lang === "ar" && player.nameAr ? player.nameAr : player.name}
                      </td>
                      <td className="px-3 py-2.5 text-center text-pitch-600">
                        {positionLabel(t, player.position)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
