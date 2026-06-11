import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import { useNews } from "../../hooks/useNews";
import { Loading, ErrorMessage, EmptyState } from "../../components/StatusMessage";
import FormField, { TextInput, TextArea } from "../../components/admin/FormField";
import { primaryButton, secondaryButton, dangerButton, ghostButton } from "../../components/admin/styles";

const emptyForm = { date: "", title: "", titleAr: "", body: "", bodyAr: "" };

export default function AdminNews() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { news, loading, error, reload } = useNews();

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  function startAdd() {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setActionError("");
  }

  function startEdit(item) {
    setForm({
      date: item.date,
      title: item.title,
      titleAr: item.titleAr || "",
      body: item.body || "",
      bodyAr: item.bodyAr || "",
    });
    setEditingId(item.id);
    setActionError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      if (editingId) {
        await api.updateNews(editingId, form);
      } else {
        await api.createNews(form);
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
      await api.deleteNews(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.news.title")}</h1>
        {!form && (
          <button type="button" className={primaryButton} onClick={startAdd}>
            + {t("admin.news.addNews")}
          </button>
        )}
      </div>

      {actionError && <p className="mt-3 text-sm font-semibold text-crimson-600">{actionError}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label={t("admin.news.date")}>
              <TextInput
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
            <FormField label={t("admin.news.titleField")}>
              <TextInput
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormField>
            <FormField label={t("admin.news.titleAr")}>
              <TextInput
                dir="rtl"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              />
            </FormField>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label={t("admin.news.body")}>
              <TextArea
                rows={3}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </FormField>
            <FormField label={t("admin.news.bodyAr")}>
              <TextArea
                rows={3}
                dir="rtl"
                value={form.bodyAr}
                onChange={(e) => setForm({ ...form, bodyAr: e.target.value })}
              />
            </FormField>
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
        {news.length === 0 ? (
          <EmptyState message={t("admin.news.noNews")} />
        ) : (
          news.map((item) => (
            <div key={item.id} className="rounded-xl border border-pitch-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gold-600">{item.date}</p>
                  <p className="font-bold text-pitch-900">
                    {lang === "ar" ? item.titleAr || item.title : item.title}
                  </p>
                  <p className="mt-1 text-sm text-pitch-600 line-clamp-2">
                    {lang === "ar" ? item.bodyAr || item.body : item.body}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" className={ghostButton} onClick={() => startEdit(item)}>
                    {t("common.edit")}
                  </button>
                  <button type="button" className={dangerButton} onClick={() => handleDelete(item.id)}>
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
