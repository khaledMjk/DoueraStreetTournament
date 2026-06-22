export function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

// A match whose date has passed but still has no recorded score: the result
// has not been communicated yet (e.g. not yet posted on the Facebook page).
export function isResultPending(match) {
  if (!match || match.status !== "scheduled" || !match.date) return false;
  if (match.homeScore != null && match.awayScore != null) return false;
  const matchDay = new Date(`${match.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return matchDay < today;
}
