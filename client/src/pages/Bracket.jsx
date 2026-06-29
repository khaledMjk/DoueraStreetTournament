import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import TeamBadge from "../components/TeamBadge";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { findTeam, teamName } from "../utils/teams";
import { Loading, ErrorMessage } from "../components/StatusMessage";

// The knockout tree is driven entirely by the official match records in
// matches.json: each tie is looked up by its `code`, real teams and scores
// come straight from the record, and the feed-in labels ("Vainqueur R32-2",
// "Perdant SF-1") are the ones stored on each match. Nothing here invents
// seedings — a tie with no match record yet simply renders empty.

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

// Parse a stored feed-in label like "Vainqueur R32-2" / "Perdant SF-1" (or the
// Arabic الفائز / الخاسر) into the feeding tie and whether it points at the
// winner or loser, so a decided feeder can auto-fill the next box.
function parseFeeder(label) {
  const m = /(Vainqueur|Perdant|الفائز|الخاسر)\s+([A-Z0-9-]+)/.exec(label || "");
  if (!m) return null;
  const type = m[1] === "Perdant" || m[1] === "الخاسر" ? "lose" : "win";
  return { type, code: m[2] };
}

function winnerOf(code, byCode) {
  return byCode[code]?.winnerTeamId ?? null;
}

function loserOf(code, byCode) {
  const m = byCode[code];
  if (!m?.winnerTeamId) return null;
  return m.homeTeamId === m.winnerTeamId ? m.awayTeamId : m.homeTeamId;
}

function labelFor(m, side, lang) {
  const key = side === "a" ? "home" : "away";
  return (lang === "ar" && m[`${key}LabelAr`]) || m[`${key}Label`] || null;
}

// Resolve one side of a tie to a concrete team (when the record names it, or a
// decided feeder lets us fill it in) or fall back to the stored label text.
function resolveSide(m, side, ctx) {
  const key = side === "a" ? "home" : "away";
  const score = m[`${key}Score`] ?? null;
  const directId = m[`${key}TeamId`];
  if (directId) return { teamId: directId, score };
  const feeder = parseFeeder(m[`${key}Label`]);
  if (feeder) {
    const tid = feeder.type === "win" ? winnerOf(feeder.code, ctx.byCode) : loserOf(feeder.code, ctx.byCode);
    if (tid) return { teamId: tid, score };
  }
  return { label: labelFor(m, side, ctx.lang), score };
}

function resolveTie(code, ctx) {
  const m = ctx.byCode[code];
  if (!m) return null; // tie not reported yet — render an empty box
  return {
    a: resolveSide(m, "a", ctx),
    b: resolveSide(m, "b", ctx),
    winnerId: m.winnerTeamId ?? null,
    status: m.status,
    penalties: isPenalty(m.note),
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
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-pitch-200 text-[10px] font-bold text-pitch-300">
          ?
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-xs leading-tight" title={name || ""}>
        {name || <span className="italic text-pitch-400">{c.label || ""}</span>}
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
  if (!r) {
    // No match record for this tie yet: show the slot without inventing teams.
    return (
      <div className="w-44 overflow-hidden rounded-lg border border-dashed border-pitch-200 bg-white/60">
        <div className="bg-pitch-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pitch-300">
          {code}
        </div>
        <Side c={{}} ctx={ctx} />
        <div className="h-px bg-pitch-100" />
        <Side c={{}} ctx={ctx} />
      </div>
    );
  }
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
