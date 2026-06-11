import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { useSettings } from "../../hooks/useSettings";
import { Loading, ErrorMessage } from "../../components/StatusMessage";
import FormField, { TextInput, TextArea } from "../../components/admin/FormField";
import { primaryButton } from "../../components/admin/styles";

export default function AdminSettings() {
  const { t } = useTranslation();
  const { settings, loading, error, reload } = useSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (loading || !form) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    setSavedMessage("");
    try {
      await api.updateSettings(form);
      setSavedMessage(t("admin.settings.saved"));
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.settings.title")}</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t("admin.settings.name")}>
            <TextInput value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
          </FormField>
          <FormField label={t("admin.settings.nameAr")}>
            <TextInput dir="rtl" value={form.nameAr || ""} onChange={(e) => set("nameAr", e.target.value)} />
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t("admin.settings.season")}>
            <TextInput value={form.season || ""} onChange={(e) => set("season", e.target.value)} />
          </FormField>
          <FormField label={t("admin.settings.startDate")}>
            <TextInput type="date" value={form.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t("admin.settings.location")}>
            <TextInput value={form.location || ""} onChange={(e) => set("location", e.target.value)} />
          </FormField>
          <FormField label={t("admin.settings.locationAr")}>
            <TextInput dir="rtl" value={form.locationAr || ""} onChange={(e) => set("locationAr", e.target.value)} />
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t("admin.settings.format")}>
            <TextArea rows={2} value={form.format || ""} onChange={(e) => set("format", e.target.value)} />
          </FormField>
          <FormField label={t("admin.settings.formatAr")}>
            <TextArea rows={2} dir="rtl" value={form.formatAr || ""} onChange={(e) => set("formatAr", e.target.value)} />
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t("admin.settings.organizer")}>
            <TextInput value={form.organizer || ""} onChange={(e) => set("organizer", e.target.value)} />
          </FormField>
          <FormField label={t("admin.settings.organizerAr")}>
            <TextInput dir="rtl" value={form.organizerAr || ""} onChange={(e) => set("organizerAr", e.target.value)} />
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Facebook">
            <TextInput value={form.contactFacebook || ""} onChange={(e) => set("contactFacebook", e.target.value)} />
          </FormField>
          <FormField label="TikTok">
            <TextInput value={form.contactTiktok || ""} onChange={(e) => set("contactTiktok", e.target.value)} />
          </FormField>
        </div>

        <FormField label={t("admin.settings.phone")}>
          <TextInput value={form.contactPhone || ""} onChange={(e) => set("contactPhone", e.target.value)} />
        </FormField>

        {actionError && <p className="text-sm font-semibold text-crimson-600">{actionError}</p>}
        {savedMessage && <p className="text-sm font-semibold text-pitch-600">{savedMessage}</p>}

        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </form>
    </div>
  );
}
