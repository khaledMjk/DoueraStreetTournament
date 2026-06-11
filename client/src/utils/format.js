export function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
