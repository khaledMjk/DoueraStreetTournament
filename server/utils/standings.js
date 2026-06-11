// Compute group standings and top scorers from teams + matches data.

export function computeStandings(teams, matches, groupId) {
  const groupTeams = teams.filter((t) => t.group === groupId);

  const table = new Map(
    groupTeams.map((team) => [
      team.id,
      {
        teamId: team.id,
        name: team.name,
        nameAr: team.nameAr,
        shortName: team.shortName,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    ])
  );

  const groupMatches = matches.filter(
    (m) => m.group === groupId && m.status === "finished"
  );

  for (const match of groupMatches) {
    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const rows = [...table.values()].map((row) => ({
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst,
  }));

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });

  return rows;
}

export function computeTopScorers(teams, matches, limit = 10) {
  const teamById = new Map(teams.map((t) => [t.id, t]));
  const playerInfo = new Map();
  for (const team of teams) {
    for (const player of team.players) {
      playerInfo.set(player.id, { player, team });
    }
  }

  const goals = new Map();

  for (const match of matches) {
    if (match.status !== "finished") continue;
    for (const scorer of match.scorers || []) {
      const key = scorer.playerId;
      goals.set(key, (goals.get(key) || 0) + 1);
    }
  }

  const rows = [...goals.entries()]
    .map(([playerId, count]) => {
      const info = playerInfo.get(playerId);
      if (!info) return null;
      return {
        playerId,
        name: info.player.name,
        nameAr: info.player.nameAr,
        number: info.player.number,
        teamId: info.team.id,
        teamName: info.team.name,
        teamNameAr: info.team.nameAr,
        goals: count,
      };
    })
    .filter(Boolean);

  rows.sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));

  return rows.slice(0, limit);
}
