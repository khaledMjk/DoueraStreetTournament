import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import TeamCard from "../components/TeamCard";
import { useTeams } from "../hooks/useTeams";
import { useGroups } from "../hooks/useGroups";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";

export default function Teams() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { teams, loading: teamsLoading, error } = useTeams();
  const { groups, loading: groupsLoading } = useGroups();

  if (teamsLoading || groupsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const grouped = groups.map((group) => ({
    group,
    teams: teams.filter((team) => team.group === group.id),
  }));

  const ungrouped = teams.filter((team) => !groups.some((g) => g.id === team.group));

  return (
    <div>
      <PageHeader title={t("teams.title")} subtitle={t("teams.subtitle")} />
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <div className="flex">
          <Link
            to="/groups"
            className="inline-flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2 text-sm font-bold text-pitch-900 shadow-sm transition-colors hover:bg-gold-300 ms-auto"
          >
            <span aria-hidden="true">📊</span>
            {t("groups.viewStandings")}
          </Link>
        </div>
        {teams.length === 0 ? (
          <EmptyState message={t("teams.noTeams")} />
        ) : (
          <>
            {grouped
              .filter((g) => g.teams.length > 0)
              .map(({ group, teams: groupTeams }) => (
                <section key={group.id}>
                  <h2 className="text-xl font-extrabold text-pitch-900">
                    {lang === "ar" ? group.nameAr : group.name}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {groupTeams.map((team) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </div>
                </section>
              ))}

            {ungrouped.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold text-pitch-900">{t("common.noGroup")}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ungrouped.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
