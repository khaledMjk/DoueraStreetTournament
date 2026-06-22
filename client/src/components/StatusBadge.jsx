import { useTranslation } from "react-i18next";

export default function StatusBadge({ status, pending = false }) {
  const { t } = useTranslation();

  const effective = pending && status === "scheduled" ? "noResult" : status;

  const styles =
    effective === "finished"
      ? "bg-pitch-100 text-pitch-700"
      : effective === "cancelled"
      ? "bg-crimson-100 text-crimson-700"
      : effective === "noResult"
      ? "bg-sand-200 text-pitch-600"
      : "bg-gold-100 text-gold-800";

  const label =
    effective === "finished"
      ? t("common.finished")
      : effective === "cancelled"
      ? t("common.cancelled")
      : effective === "noResult"
      ? t("common.noResult")
      : t("common.scheduled");

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${styles}`}>
      {label}
    </span>
  );
}
