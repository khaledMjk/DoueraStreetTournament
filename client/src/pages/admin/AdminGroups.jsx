import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { useGroups } from "../../hooks/useGroups";
import { Loading, ErrorMessage } from "../../components/StatusMessage";
import FormField, { TextInput } from "../../components/admin/FormField";
import { primaryButton, secondaryButton, dangerButton, ghostButton } from "../../components/admin/styles";

const emptyForm = { id: "", name: "", nameAr: "" };

export default function AdminGroups() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { groups, loading, error, reload } = useGroups();

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  function startAdd() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setActionError("");
  }

  function startEdit(group) {
    setForm({ id: group.id, name: group.name, nameAr: group.nameAr || "" });
    setEditingId(group.id);
    setActionError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      if (editingId) {
        await api.updateGroup(editingId, { name: form.name, nameAr: form.nameAr });
      } else {
        await api.createGroup(form);
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
      await api.deleteGroup(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.groups.title")}</h1>
        {!form && (
          <button type="button" className={primaryButton} onClick={startAdd}>
            + {t("admin.groups.addGroup")}
          </button>
        )}
      </div>

      {actionError && <p className="mt-3 text-sm font-semibold text-crimson-600">{actionError}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm sm:grid-cols-3">
          <FormField label={t("admin.groups.id")}>
            <TextInput
              required
              disabled={!!editingId}
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </FormField>
          <FormField label={t("admin.groups.name")}>
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label={t("admin.groups.nameAr")}>
            <TextInput
              dir="rtl"
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            />
          </FormField>
          <div className="sm:col-span-3 flex gap-2">
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
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between rounded-xl border border-pitch-100 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-bold text-pitch-900">
                {lang === "ar" ? group.nameAr : group.name}{" "}
                <span className="text-pitch-400 font-normal">({group.id})</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className={ghostButton} onClick={() => startEdit(group)}>
                {t("common.edit")}
              </button>
              <button type="button" className={dangerButton} onClick={() => handleDelete(group.id)}>
                {t("common.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
