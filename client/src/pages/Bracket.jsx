import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import TeamBadge from "../components/TeamBadge";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { findTeam, teamName } from "../utils/teams";
import { Loading, ErrorMessage } from "../components/StatusMessage";

// Static knockout structure (matches the official bracket). Each tie is keyed
// by its code; R32 ties carry the group-seed of each side, later rounds point
// at the feeding ties. Real teams/scores are pulled from matches.json by the
// matching `code`, so the tree fills in automatically as results are entered.
const TIES = {
  "R32-1": { round: "r32", a: { seed: "2A" }, b: { seed: "2B" } },
  "R32-2": { round: "r32", a: { seed: "1E" }, b: { seed: "3F" } },
  "R32-3": { round: "r32", a: { seed: "1F" }, b: { seed: "2C" } },
  "R32-4": { round: "r32", a: { seed: "1C" }, b: { seed: "2F" } },
  "R32-5": { round: "r32", a: { seed: "1I" }, b: { seed: "3H" } },
  "R32-6": { round: "r32", a: { seed: "2E" }, b: { seed: "2I" } },
  "R32-7": { round: "r32", a: { seed: "1A" }, b: { seed: "3E" } },
  "R32-8": { round: "r32", a: { seed: "1L" }, b: { seed: "3K" } },
  "R32-9": { round: "r32", a: { seed: "1D" }, b: { seed: "3I" } },
  "R32-10": { round: "r32", a: { seed: "1G" }, b: { seed: "3A" } },
  "R32-11": { round: "r32", a: { seed: "2K" }, b: { seed: "2L" } },
  "R32-12": { round: "r32", a: { seed: "1H" }, b: { seed: "2J" } },
  "R32-13": { round: "r32", a: { seed: "1B" }, b: { seed: "3G" } },
  "R32-14": { round: "r32", a: { seed: "1J" }, b: { seed: "2H" } },
  "R32-15": { round: "r32", a: { seed: "1K" }, b: { seed: "3L" } },
  "R32-16": { round: "r32", a: { seed: "2D" }, b: { seed: "2G" } },

  "R16-1": { round: "r16", a: { win: "R32-2" }, b: { win: "R32-5" } },
  "R16-2": { round: "r16", a: { win: "R32-1" }, b: { win: "R32-3" } },
  "R16-3": { round: "r16", a: { win: "R32-4" }, b: { win: "R32-6" } },
  "R16-4": { round: "r16", a: { win: "R32-7" }, b: { win: "R32-8" } },
  "R16-5": { round: "r16", a: { win: "R32-11" }, b: { win: "R32-12" } },
  "R16-6": { round: "r16", a: { win: "R32-9" }, b: { win: "R32-10" } },
  "R16-7": { round: "r16", a: { win: "R32-14" }, b: { win: "R32-16" } },
  "R16-8": { round: "r16", a: { win: "R32-13" }, b: { win: "R32-15" } },

  "QF-1": { round: "qf", a: { win: "R16-1" }, b: { win: "R16-2" } },
  "QF-2": { round: "qf", a: { win: "R16-6" }, b: { win: "R16-5" } },
  "QF-3": { round: "qf", a: { win: "R16-3" }, b: { win: "R16-4" } },
  "QF-4": { round: "qf", a: { win: "R16-7" }, b: { win: "R16-8" } },

  "SF-1": { round: "sf", a: { win: "QF-1" }, b: { win: "QF-2" } },
  "SF-2": { round: "sf", a: { win: "QF-3" }, b: { win: "QF-4" } },

  PF: { round: "pf", a: { lose: "SF-1" }, b: { lose: "SF-2" } },
  FINALE: { round: "final", a: { win: "SF-1" }, b: { win: "SF-2" } },
};

// Vertical ordering of each column so every box lines up with its feeders.
const LEFT = [
  { round: "r32", codes: ["R32-2", "R32-5", "R32-1", "R32-3", "R32-9", "R32-10", "R32-11", "R32-12"] },
  { round: "r16", codes: ["R16-1", "R16-2", "R16-6", "R16-5"] },
  { round: "qf", codes: ["QF-1", "QF-2"] },
  { round: "sf", codes: ["SF-1"] },
];
const RIGHT = [
  { round: "sf", codes: ["SF-2"] },
  { round: "qf", codes: ["QF-3", "QF-4"] },
  { round: "r16", codes: ["R16-3", "R16-4", "R16-7", "R16-8"] },
  { round: "r32", codes: ["R32-4", "R32-6", "R32-7", "R32-8", "R32-14", "R32-16", "R32-13", "R32-15"] },
];

const HEADER_H = "h-9";
const BOX_H = 760; // pixel height of each round column; drives bracket alignment

const isPenalty = (note) => /tirs au but|الترجيح/.test(note || "");

function winnerOf(code, byCode) {
  return byCode[code]?.winnerTeamId ?? null;
}

function loserOf(code, byCode) {
  const m = byCode[code];
  if (!m?.winnerTeamId) return null;
  return m.homeTeamId === m.winnerTeamId ? m.awayTeamId : m.homeTeamId;
}

// Resolve a feeder slot into a concrete team (if decided) or a text label.
function resolveSlot(slot, ctx) {
  const { byCode, t } = ctx;
  if (slot.seed) return { seed: slot.seed };
  if (slot.win) {
    const w = winnerOf(slot.win, byCode);
    return w ? { teamId: w } : { label: `${t("bracket.winnerOf")} ${slot.win}` };
  }
  if (slot.lose) {
    const l = loserOf(slot.lose, byCode);
    return l ? { teamId: l } : { label: `${t("bracket.loserOf")} ${slot.lose}` };
  }
  return {};
}

function resolveTie(code, ctx) {
  const tie = TIES[code];
  const m = ctx.byCode[code];
  if (tie.round === "r32" && m) {
    return {
      a: { teamId: m.homeTeamId, label: ctx.lang === "ar" ? m.homeLabelAr : m.homeLabel, score: m.homeScore },
      b: { teamId: m.awayTeamId, label: ctx.lang === "ar" ? m.awayLabelAr : m.awayLabel, score: m.awayScore },
      winnerId: m.winnerTeamId ?? null,
      status: m.status,
      penalties: isPenalty(m.note),
    };
  }
  return {
    a: { ...resolveSlot(tie.a, ctx), score: m?.homeScore ?? null },
    b: { ...resolveSlot(tie.b, ctx), score: m?.awayScore ?? null },
    winnerId: m?.winnerTeamId ?? null,
    status: m?.status,
    penalties: isPenalty(m?.note),
  };
}

function Side({ c, isWinner, dim, ctx }) {
  const team = c.teamId ? findTeam(ctx.teams, c.teamId) : null;
  const name = team ? teamName(team, ctx.lang) : c.label || null;
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 ${
        isWinner ? "bg-gold-50 font-bold text-pitch-900" : dim ? "text-pitch-400" : "text-pitch-700"
      }`}
    >
      {team ? (
        <TeamBadge team={team} label={name} size="sm" />
      ) : (
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            c.seed ? "bg-pitch-100 text-pitch-600" : "border border-dashed border-pitch-200 text-pitch-300"
          }`}
        >
          {c.seed || "?"}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-xs leading-tight" title={name || c.seed || ""}>
        {name || <span className="italic text-pitch-400">{c.label || c.seed}</span>}
      </span>
      {c.score != null && (
        <span
          className={`shrink-0 rounded px-1.5 text-xs font-extrabold tabular-nums ${
            isWinner ? "bg-pitch-900 text-white" : "bg-pitch-100 text-pitch-600"
          }`}
        >
          {c.score}
        </span>
      )}
    </div>
  );
}

function TieBox({ code, highlight, ctx }) {
  const r = resolveTie(code, ctx);
  const aWin = r.winnerId && r.a.teamId === r.winnerId;
  const bWin = r.winnerId && r.b.teamId === r.winnerId;
  const decided = !!r.winnerId;
  return (
    <div
      className={`w-44 overflow-hidden rounded-lg border bg-white shadow-sm ${
        highlight ? "border-gold-400 ring-1 ring-gold-200" : "border-pitch-100"
      }`}
    >
      <div className="flex items-center justify-between bg-pitch-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pitch-400">
        <span>{code}</span>
        {r.penalties && <span className="text-gold-600">{ctx.t("bracket.penalties")}</span>}
        {r.status === "cancelled" && !r.penalties && (
          <span className="text-crimson-500">{ctx.t("common.cancelled")}</span>
        )}
      </div>
      <Side c={r.a} isWinner={aWin} dim={decided && !aWin} ctx={ctx} />
      <div className="h-px bg-pitch-100" />
      <Side c={r.b} isWinner={bWin} dim={decided && !bWin} ctx={ctx} />
    </div>
  );
}

function Column({ round, codes, ctx }) {
  return (
    <div className="flex shrink-0 flex-col" style={{ height: BOX_H }}>
      <div className={`${HEADER_H} flex items-center justify-center`}>
        <span className="whitespace-nowrap rounded-full bg-pitch-900 px-3 py-1 text-[11px] font-bold text-white">
          {ctx.t(`bracket.${round}`)}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-around">
        {codes.map((code) => (
          <div key={code} className="flex justify-center">
            <TieBox code={code} ctx={ctx} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Connector column: `count` right- or left-facing elbows that join each pair
// of child boxes to their parent. flex-1 cells line up with justify-around.
function Connector({ count, side }) {
  return (
    <div className="flex w-6 shrink-0 flex-col sm:w-8" style={{ height: BOX_H }}>
      <div className={HEADER_H} />
      <div className="flex flex-1 flex-col">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center justify-center">
            <div
              className={`h-1/2 w-2 border-pitch-200 sm:w-3 ${
                side === "left" ? "rounded-r-md border-y-2 border-r-2" : "rounded-l-md border-y-2 border-l-2"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Bracket() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { matches, loading, error } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();

  const byCode = useMemo(() => {
    const map = {};
    for (const m of matches) if (m.code) map[m.code] = m;
    return map;
  }, [matches]);

  if (loading || teamsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const ctx = { byCode, teams, lang, t };

  return (
    <div>
      <PageHeader title={t("bracket.title")} subtitle={t("bracket.subtitle")} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-center text-xs text-pitch-400 sm:hidden">{t("bracket.scrollHint")}</p>
        <div className="overflow-x-auto pb-4">
          <div dir="ltr" className="mx-auto flex w-max items-stretch">
            {/* Left half */}
            <Column {...LEFT[0]} ctx={ctx} />
            <Connector count={4} side="left" />
            <Column {...LEFT[1]} ctx={ctx} />
            <Connector count={2} side="left" />
            <Column {...LEFT[2]} ctx={ctx} />
            <Connector count={1} side="left" />
            <Column {...LEFT[3]} ctx={ctx} />

            {/* Center: Final + third place */}
            <div className="flex shrink-0 flex-col px-1 sm:px-2" style={{ height: BOX_H }}>
              <div className={`${HEADER_H} flex items-center justify-center`}>
                <span className="whitespace-nowrap rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold text-pitch-900">
                  {t("bracket.final")}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="flex items-center">
                  <div className="h-px w-3 bg-pitch-200 sm:w-4" />
                  <TieBox code="FINALE" highlight ctx={ctx} />
                  <div className="h-px w-3 bg-pitch-200 sm:w-4" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-pitch-400">
                    {t("bracket.third")}
                  </span>
                  <TieBox code="PF" ctx={ctx} />
                </div>
              </div>
            </div>

            {/* Right half */}
            <Column {...RIGHT[0]} ctx={ctx} />
            <Connector count={1} side="right" />
            <Column {...RIGHT[1]} ctx={ctx} />
            <Connector count={2} side="right" />
            <Column {...RIGHT[2]} ctx={ctx} />
            <Connector count={4} side="right" />
            <Column {...RIGHT[3]} ctx={ctx} />
          </div>
        </div>
      </div>
    </div>
  );
}
