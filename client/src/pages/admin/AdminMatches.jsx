import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useGroups } from "../../hooks/useGroups";
import { Loading, ErrorMessage, EmptyState } from "../../components/StatusMessage";
import FormField, { TextInput, SelectInput } from "../../components/admin/FormField";
import { primaryButton, secondaryButton, dangerButton, ghostButton } from "../../components/admin/styles";
import { findTeam, teamName, matchSideLabel } from "../../utils/teams";

const emptyForm = {
  group: "",
  round: "",
  roundAr: "",
  date: "",
  time: "",
  venue: "",
  venueAr: "",
  homeTeamId: "",
  awayTeamId: "",
  homeLabel: "",
  homeLabelAr: "",
  awayLabel: "",
  awayLabelAr: "",
  homeScore: "",
  awayScore: "",
  status: "scheduled",
  scorers: [],
};

function emptyScorer() {
  return { teamId: "", playerId: "", minute: "" };
}

export default function AdminMatches() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { matches, loading, error, reload } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();
  const { groups, loading: groupsLoading } = useGroups();

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  if (loading || teamsLoading || groupsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  function startAdd() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setActionError("");
  }

  function startEdit(match) {
    setForm({
      group: match.group || "",
      round: match.round || "",
      roundAr: match.roundAr || "",
      date: match.date || "",
      time: match.time || "",
      venue: match.venue || "",
      venueAr: match.venueAr || "",
      homeTeamId: match.homeTeamId || "",
      awayTeamId: match.awayTeamId || "",
      homeLabel: match.homeLabel || "",
      homeLabelAr: match.homeLabelAr || "",
      awayLabel: match.awayLabel || "",
      awayLabelAr: match.awayLabelAr || "",
      homeScore: match.homeScore ?? "",
      awayScore: match.awayScore ?? "",
      status: match.status || "scheduled",
      scorers: (match.scorers || []).map((s) => ({ ...s })),
    });
    setEditingId(match.id);
    setActionError("");
  }

  function updateScorer(index, field, value) {
    setForm((f) => {
      const scorers = [...f.scorers];
      const scorer = { ...scorers[index], [field]: value };
      if (field === "teamId") scorer.playerId = "";
      scorers[index] = scorer;
      return { ...f, scorers };
    });
  }

  function addScorer() {
    setForm((f) => ({ ...f, scorers: [...f.scorers, emptyScorer()] }));
  }

  function removeScorer(index) {
    setForm((f) => ({ ...f, scorers: f.scorers.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = {
        ...form,
        group: form.group || null,
        homeTeamId: form.homeTeamId || null,
        awayTeamId: form.awayTeamId || null,
        homeScore: form.homeScore === "" ? null : Number(form.homeScore),
        awayScore: form.awayScore === "" ? null : Number(form.awayScore),
        scorers: form.scorers
          .filter((s) => s.teamId && s.playerId)
          .map((s) => ({ ...s, minute: Number(s.minute) || 0 })),
      };
      if (editingId) {
        await api.updateMatch(editingId, payload);
      } else {
        await api.createMatch(payload);
      }
      setForm(null);
      setEditingId(null);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t("common.confirmDelete"))) return;
    try {
      await api.deleteMatch(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const teamOptions = form
    ? form.group
      ? teams.filter((team) => team.group === form.group)
      : teams
    : [];

  const scorerTeamIds = form
    ? [form.homeTeamId, form.awayTeamId].filter(Boolean)
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.matches.title")}</h1>
        {!form && (
          <button type="button" className={primaryButton} onClick={startAdd}>
            + {t("admin.matches.addMatch")}
          </button>
        )}
      </div>

      {actionError && <p className="mt-3 text-sm font-semibold text-crimson-600">{actionError}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-pitch-900">
            {editingId ? t("admin.matches.editMatch") : t("admin.matches.addMatch")}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("admin.matches.group")}>
              <SelectInput
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value, homeTeamId: "", awayTeamId: "" })}
              >
                <option value="">{t("admin.matches.noGroupOption")}</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {lang === "ar" ? g.nameAr : g.name}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <FormField label={t("admin.matches.round")}>
              <TextInput value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
            </FormField>
            <FormField label={t("admin.matches.roundAr")}>
              <TextInput dir="rtl" value={form.roundAr} onChange={(e) => setForm({ ...form, roundAr: e.target.value })} />
            </FormField>
            <FormField label={t("common.status")}>
              <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="scheduled">{t("common.scheduled")}</option>
                <option value="finished">{t("common.finished")}</option>
              </SelectInput>
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("common.date")}>
              <TextInput type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FormField>
            <FormField label={t("common.time")}>
              <TextInput type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </FormField>
            <FormField label={t("admin.matches.venue")}>
              <TextInput value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            </FormField>
            <FormField label={t("admin.matches.venueAr")}>
              <TextInput dir="rtl" value={form.venueAr} onChange={(e) => setForm({ ...form, venueAr: e.target.value })} />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-pitch-100 p-3">
              <FormField label={t("admin.matches.homeTeam")}>
                <SelectInput value={form.homeTeamId} onChange={(e) => setForm({ ...form, homeTeamId: e.target.value })}>
                  <option value="">{t("admin.matches.selectTeam")}</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>
                      {teamName(team, lang)}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
              {!form.homeTeamId && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <FormField label={t("admin.matches.homeLabel")}>
                    <TextInput value={form.homeLabel} onChange={(e) => setForm({ ...form, homeLabel: e.target.value })} />
                  </FormField>
                  <FormField label={`${t("admin.matches.homeLabel")} (AR)`}>
                    <TextInput dir="rtl" value={form.homeLabelAr} onChange={(e) => setForm({ ...form, homeLabelAr: e.target.value })} />
                  </FormField>
                </div>
              )}
              <FormField label={t("admin.matches.homeScore")}>
                <TextInput type="number" min="0" value={form.homeScore} onChange={(e) => setForm({ ...form, homeScore: e.target.value })} />
              </FormField>
            </div>

            <div className="space-y-2 rounded-lg border border-pitch-100 p-3">
              <FormField label={t("admin.matches.awayTeam")}>
                <SelectInput value={form.awayTeamId} onChange={(e) => setForm({ ...form, awayTeamId: e.target.value })}>
                  <option value="">{t("admin.matches.selectTeam")}</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>
                      {teamName(team, lang)}
                    </option>
                  ))}
                </SelectInput>
              </FormField>
              {!form.awayTeamId && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <FormField label={t("admin.matches.awayLabel")}>
                    <TextInput value={form.awayLabel} onChange={(e) => setForm({ ...form, awayLabel: e.target.value })} />
                  </FormField>
                  <FormField label={`${t("admin.matches.awayLabel")} (AR)`}>
                    <TextInput dir="rtl" value={form.awayLabelAr} onChange={(e) => setForm({ ...form, awayLabelAr: e.target.value })} />
                  </FormField>
                </div>
              )}
              <FormField label={t("admin.matches.awayScore")}>
                <TextInput type="number" min="0" value={form.awayScore} onChange={(e) => setForm({ ...form, awayScore: e.target.value })} />
              </FormField>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-pitch-900">{t("admin.matches.scorers")}</h3>
              <button type="button" className={ghostButton} onClick={addScorer} disabled={scorerTeamIds.length === 0}>
                + {t("admin.matches.addScorer")}
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {form.scorers.map((scorer, index) => {
                const scorerTeam = scorer.teamId ? findTeam(teams, scorer.teamId) : null;
                return (
                  <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border border-pitch-100 p-2 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-4">
                      <SelectInput value={scorer.teamId} onChange={(e) => updateScorer(index, "teamId", e.target.value)}>
                        <option value="">{t("admin.matches.scorerTeam")}</option>
                        {scorerTeamIds.map((teamId) => {
                          const team = findTeam(teams, teamId);
                          return (
                            <option key={teamId} value={teamId}>
                              {team ? teamName(team, lang) : teamId}
                            </option>
                          );
                        })}
                      </SelectInput>
                    </div>
                    <div className="sm:col-span-5">
                      <SelectInput
                        value={scorer.playerId}
                        onChange={(e) => updateScorer(index, "playerId", e.target.value)}
                        disabled={!scorerTeam}
                      >
                        <option value="">{t("admin.matches.scorerPlayer")}</option>
                        {(scorerTeam?.players || []).map((player) => (
                          <option key={player.id} value={player.id}>
                            {lang === "ar" && player.nameAr ? player.nameAr : player.name}
                          </option>
                        ))}
                      </SelectInput>
                    </div>
                    <div className="sm:col-span-2">
                      <TextInput
                        type="number"
                        min="0"
                        max="120"
                        placeholder={t("admin.matches.minute")}
                        value={scorer.minute}
                        onChange={(e) => updateScorer(index, "minute", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button type="button" className={dangerButton} onClick={() => removeScorer(index)}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving ? t("common.saving") : t("common.save")}
            </button>
            <button type="button" className={secondaryButton} onClick={() => setForm(null)}>
              {t("common.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {matches.length === 0 ? (
          <EmptyState message={t("admin.matches.noMatches")} />
        ) : (
          matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between gap-3 rounded-xl border border-pitch-100 bg-white px-4 py-3 shadow-sm">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gold-600">
                  {match.date} {match.time} · {lang === "ar" ? match.roundAr || match.round : match.round}
                  {" · "}
                  {match.group ? `${t("common.group")} ${match.group}` : t("common.noGroup")}
                </p>
                <p className="truncate font-bold text-pitch-900">
                  {matchSideLabel(match, "home", teams, lang)}
                  {" "}
                  {match.status === "finished" ? `${match.homeScore} - ${match.awayScore}` : t("common.vs")}
                  {" "}
                  {matchSideLabel(match, "away", teams, lang)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" className={ghostButton} onClick={() => startEdit(match)}>
                  {t("common.edit")}
                </button>
                <button type="button" className={dangerButton} onClick={() => handleDelete(match.id)}>
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
