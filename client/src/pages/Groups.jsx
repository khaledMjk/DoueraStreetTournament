import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader";
import StandingsTable from "../components/StandingsTable";
import { useGroups } from "../hooks/useGroups";
import { useTeams } from "../hooks/useTeams";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";

export default function Groups() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { groups, loading, error } = useGroups();
  const { teams, loading: teamsLoading } = useTeams();

  if (loading || teamsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader title={t("groups.title")} subtitle={t("groups.subtitle")} />
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {groups.length === 0 ? (
          <EmptyState message={t("matches.noMatches")} />
        ) : (
          groups.map((group) => (
            <section key={group.id}>
              <h2 className="text-xl font-extrabold text-pitch-900">
                {lang === "ar" ? group.nameAr : group.name}
              </h2>
              <div className="mt-4">
                {group.standings.length === 0 ? (
                  <EmptyState message={t("teams.noTeams")} />
                ) : (
                  <StandingsTable standings={group.standings} teams={teams} />
                )}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
