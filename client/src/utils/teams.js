export function findTeam(teams, id) {
  return teams.find((t) => t.id === id) || null;
}

export function teamName(team, lang) {
  if (!team) return "";
  return lang === "ar" && team.nameAr ? team.nameAr : team.name;
}

export function matchSideLabel(match, side, teams, lang) {
  // side: "home" | "away"
  const teamId = match[`${side}TeamId`];
  const team = teamId ? findTeam(teams, teamId) : null;
  if (team) return teamName(team, lang);

  const label = lang === "ar" ? match[`${side}LabelAr`] : match[`${side}Label`];
  return label || "?";
}

export function positionLabel(t, position) {
  if (!position) return "";
  return t(`teams.positions.${position}`, position);
}
