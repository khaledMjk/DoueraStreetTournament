import { useTranslation } from "react-i18next";

export function Loading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-16 text-pitch-700">
      <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-pitch-300 border-t-pitch-700" />
      <span className="ms-3 font-medium">{t("common.loading")}</span>
    </div>
  );
}

export function ErrorMessage({ message }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-md rounded-xl border border-crimson-500/30 bg-crimson-50 px-4 py-3 text-center text-crimson-600 my-8">
      {message || t("common.error")}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-pitch-200 bg-white px-4 py-10 text-center text-pitch-600">
      {message}
    </div>
  );
}
