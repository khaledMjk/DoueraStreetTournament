import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { useTeams } from "../../hooks/useTeams";
import { useGroups } from "../../hooks/useGroups";
import { Loading, ErrorMessage, EmptyState } from "../../components/StatusMessage";
import TeamBadge from "../../components/TeamBadge";
import FormField, { TextInput, SelectInput } from "../../components/admin/FormField";
import { primaryButton, secondaryButton, dangerButton, ghostButton } from "../../components/admin/styles";
import { teamName, positionLabel } from "../../utils/teams";

const POSITIONS = ["GK", "DEF", "MID", "FWD"];

const emptyForm = { name: "", nameAr: "", shortName: "", group: "", color: "#28407e", players: [] };

function emptyPlayer() {
  return { id: `p${Date.now()}${Math.floor(Math.random() * 1000)}`, name: "", nameAr: "", number: "", position: "MID" };
}

export default function AdminTeams() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { teams, loading, error, reload } = useTeams();
  const { groups, loading: groupsLoading } = useGroups();

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  if (loading || groupsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  function startAdd() {
    setForm({ ...emptyForm, group: groups[0]?.id || "" });
    setEditingId(null);
    setActionError("");
  }

  function startEdit(team) {
    setForm({
      name: team.name,
      nameAr: team.nameAr || "",
      shortName: team.shortName || "",
      group: team.group || "",
      color: team.color || "#28407e",
      players: (team.players || []).map((p) => ({ ...p })),
    });
    setEditingId(team.id);
    setActionError("");
  }

  function updatePlayer(index, field, value) {
    setForm((f) => {
      const players = [...f.players];
      players[index] = { ...players[index], [field]: value };
      return { ...f, players };
    });
  }

  function addPlayer() {
    setForm((f) => ({ ...f, players: [...f.players, emptyPlayer()] }));
  }

  function removePlayer(index) {
    setForm((f) => ({ ...f, players: f.players.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = {
        ...form,
        players: form.players.map((p) => ({ ...p, number: Number(p.number) || 0 })),
      };
      if (editingId) {
        await api.updateTeam(editingId, payload);
      } else {
        await api.createTeam(payload);
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
      await api.deleteTeam(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.teams.title")}</h1>
        {!form && (
          <button type="button" className={primaryButton} onClick={startAdd}>
            + {t("admin.teams.addTeam")}
          </button>
        )}
      </div>

      {actionError && <p className="mt-3 text-sm font-semibold text-crimson-600">{actionError}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-pitch-900">
            {editingId ? t("admin.teams.editTeam") : t("admin.teams.addTeam")}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("admin.teams.name")}>
              <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label={t("admin.teams.nameAr")}>
              <TextInput dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            </FormField>
            <FormField label={t("admin.teams.shortName")}>
              <TextInput
                maxLength={4}
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
              />
            </FormField>
            <FormField label={t("admin.teams.group")}>
              <SelectInput value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {lang === "ar" ? g.nameAr : g.name}
                  </option>
                ))}
              </SelectInput>
            </FormField>
          </div>

          <FormField label={t("admin.teams.color")}>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="h-10 w-20 cursor-pointer rounded-lg border border-pitch-200"
            />
          </FormField>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-pitch-900">{t("admin.teams.players")}</h3>
              <button type="button" className={ghostButton} onClick={addPlayer}>
                + {t("admin.teams.addPlayer")}
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {form.players.map((player, index) => (
                <div key={player.id} className="grid grid-cols-2 gap-2 rounded-lg border border-pitch-100 p-2 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-1">
                    <TextInput
                      type="number"
                      placeholder={t("admin.teams.number")}
                      value={player.number}
                      onChange={(e) => updatePlayer(index, "number", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <TextInput
                      placeholder={t("admin.teams.playerName")}
                      value={player.name}
                      onChange={(e) => updatePlayer(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <TextInput
                      dir="rtl"
                      placeholder={t("admin.teams.playerNameAr")}
                      value={player.nameAr}
                      onChange={(e) => updatePlayer(index, "nameAr", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <SelectInput value={player.position} onChange={(e) => updatePlayer(index, "position", e.target.value)}>
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {positionLabel(t, pos)}
                        </option>
                      ))}
                    </SelectInput>
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button type="button" className={dangerButton} onClick={() => removePlayer(index)}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
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
        {teams.length === 0 ? (
          <EmptyState message={t("admin.teams.noTeams")} />
        ) : (
          teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between gap-3 rounded-xl border border-pitch-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <TeamBadge team={team} label={team.shortName} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-pitch-900">{teamName(team, lang)}</p>
                  <p className="text-xs text-pitch-500">
                    {t("teams.group")} {team.group || "—"} · {team.players?.length || 0} {t("teams.players")}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" className={ghostButton} onClick={() => startEdit(team)}>
                  {t("common.edit")}
                </button>
                <button type="button" className={dangerButton} onClick={() => handleDelete(team.id)}>
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
