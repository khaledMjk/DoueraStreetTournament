import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import MatchCard from "../components/MatchCard";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { useGroups } from "../hooks/useGroups";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";

const selectClass =
  "rounded-lg border border-pitch-200 bg-white px-3 py-2 text-sm font-semibold text-pitch-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

const standingsBtnClass =
  "inline-flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2 text-sm font-bold text-pitch-900 shadow-sm transition-colors hover:bg-gold-300 ms-auto";

export default function Matches() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [group, setGroup] = useState("");
  const [round, setRound] = useState("");
  const [status, setStatus] = useState("");

  const { matches, loading, error } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();
  const { groups, loading: groupsLoading } = useGroups();

  // Distinct rounds, ordered by when they first occur (Journées then knockout).
  const rounds = useMemo(() => {
    const seen = new Map();
    for (const m of matches) {
      if (!seen.has(m.round)) seen.set(m.round, { round: m.round, roundAr: m.roundAr, date: m.date });
    }
    return [...seen.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (group === "none" && m.group) return false;
      if (group && group !== "none" && m.group !== group) return false;
      if (round && m.round !== round) return false;
      if (status && m.status !== status) return false;
      return true;
    });
  }, [matches, group, round, status]);

  if (loading || teamsLoading || groupsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader title={t("matches.title")} subtitle={t("matches.subtitle")} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <select className={selectClass} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">{t("matches.allGroups")}</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {lang === "ar" ? g.nameAr : g.name}
              </option>
            ))}
            <option value="none">{t("common.noGroup")}</option>
          </select>

          <select className={selectClass} value={round} onChange={(e) => setRound(e.target.value)}>
            <option value="">{t("matches.allRounds")}</option>
            {rounds.map((r) => (
              <option key={r.round} value={r.round}>
                {lang === "ar" && r.roundAr ? r.roundAr : r.round}
              </option>
            ))}
          </select>

          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t("matches.allStatuses")}</option>
            <option value="finished">{t("common.finished")}</option>
            <option value="scheduled">{t("common.scheduled")}</option>
            <option value="cancelled">{t("common.cancelled")}</option>
          </select>

          <Link to="/groups" className={standingsBtnClass}>
            <span aria-hidden="true">📊</span>
            {t("groups.viewStandings")}
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState message={t("matches.noMatches")} />
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MatchCard key={m.id} match={m} teams={teams} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
