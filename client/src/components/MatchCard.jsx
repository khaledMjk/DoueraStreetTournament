import { useTranslation } from "react-i18next";
import TeamBadge from "./TeamBadge";
import StatusBadge from "./StatusBadge";
import { findTeam, matchSideLabel } from "../utils/teams";
import { formatDate } from "../utils/format";

export default function MatchCard({ match, teams }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isFinished = match.status === "finished";

  const homeTeam = findTeam(teams, match.homeTeamId);
  const awayTeam = findTeam(teams, match.awayTeamId);
  const homeName = matchSideLabel(match, "home", teams, lang);
  const awayName = matchSideLabel(match, "away", teams, lang);
  const round = lang === "ar" && match.roundAr ? match.roundAr : match.round;
  const venue = lang === "ar" && match.venueAr ? match.venueAr : match.venue;

  return (
    <div className="rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 text-xs text-pitch-600">
        <span className="font-semibold">{round}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center gap-2 justify-end text-end">
          <span className="font-bold text-pitch-900 truncate">{homeName}</span>
          <TeamBadge team={homeTeam} label={homeName} />
        </div>

        <div className="px-2 text-center">
          {isFinished ? (
            <span className="rounded-lg bg-pitch-900 px-3 py-1 text-lg font-extrabold text-white tabular-nums">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="rounded-lg bg-sand-100 px-3 py-1 text-sm font-bold text-pitch-700">
              {t("common.vs")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 justify-start text-start">
          <TeamBadge team={awayTeam} label={awayName} />
          <span className="font-bold text-pitch-900 truncate">{awayName}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-pitch-500">
        <span>{formatDate(match.date, lang)}</span>
        {match.time && <span>· {match.time}</span>}
        {venue && <span>· {venue}</span>}
      </div>
    </div>
  );
}
