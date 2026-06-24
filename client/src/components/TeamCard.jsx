import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TeamBadge from "./TeamBadge";
import { teamName } from "../utils/teams";

export default function TeamCard({ team }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Link
      to={`/teams/${team.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <TeamBadge team={team} label={team.shortName} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-pitch-900">{teamName(team, lang)}</p>
        <p className="text-xs text-pitch-500">
          {t("teams.group")} {team.group ?? "—"} · {team.players?.length || 0} {t("teams.players")}
        </p>
        {(lang === "ar" ? team.noteAr : team.note) && (
          <p className="mt-1 text-xs leading-snug text-crimson-600">
            <span aria-hidden="true">⚠ </span>{lang === "ar" ? team.noteAr : team.note}
          </p>
        )}
      </div>
      <span className="text-pitch-300 group-hover:text-gold-500 transition-colors rtl:rotate-180">→</span>
    </Link>
  );
}
