import { useTranslation } from "react-i18next";

export default function StatusBadge({ status }) {
  const { t } = useTranslation();

  const styles =
    status === "finished"
      ? "bg-pitch-100 text-pitch-700"
      : status === "cancelled"
      ? "bg-crimson-100 text-crimson-700"
      : "bg-gold-100 text-gold-800";

  const label =
    status === "finished"
      ? t("common.finished")
      : status === "cancelled"
      ? t("common.cancelled")
      : t("common.scheduled");

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${styles}`}>
      {label}
    </span>
  );
}
