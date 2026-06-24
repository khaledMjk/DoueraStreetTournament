import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { useTeams } from "../hooks/useTeams";
import { useMatches } from "../hooks/useMatches";
import { useNews } from "../hooks/useNews";
import { Loading, ErrorMessage, EmptyState } from "../components/StatusMessage";
import MatchCard from "../components/MatchCard";

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { settings, loading: settingsLoading } = useSettings();
  const { teams, loading: teamsLoading } = useTeams();
  const { matches, loading: matchesLoading, error } = useMatches();
  const { news, loading: newsLoading } = useNews();

  const loading = settingsLoading || teamsLoading || matchesLoading || newsLoading;

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const finished = matches.filter((m) => m.status === "finished");
  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .slice(0, 4);
  const recentResults = [...finished].reverse().slice(0, 4);
  const totalGoals = finished.reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0);
  const latestNews = news.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-pitch-900 pitch-texture text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 text-center">
          <span className="inline-block rounded-full bg-gold-400/15 px-4 py-1 text-sm font-bold text-gold-300 ring-1 ring-gold-400/40">
            {t("home.heroBadge")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            {lang === "ar" ? settings?.nameAr : settings?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70 sm:text-lg">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/teams"
              className="rounded-full bg-gold-400 px-6 py-3 font-bold text-pitch-900 shadow-lg shadow-gold-400/20 transition-transform hover:-translate-y-0.5"
            >
              {t("home.ctaTeams")}
            </Link>
            <Link
              to="/matches"
              className="rounded-full border border-white/25 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              {t("home.ctaMatches")}
            </Link>
            <Link
              to="/groups"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              <span aria-hidden="true">📊</span>
              {t("groups.viewStandings")}
            </Link>
          </div>
        </div>

        {/* Quick stats */}
        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10 rtl:divide-x-reverse">
            {[
              { value: teams.length, label: t("home.statTeams") },
              { value: finished.length, label: t("home.statMatches") },
              { value: totalGoals, label: t("home.statGoals") },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-6 text-center">
                <p className="text-3xl font-extrabold text-gold-300">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Latest news */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-pitch-900">{t("home.latestNews")}</h2>
          </div>
          {latestNews.length === 0 ? (
            <div className="mt-4">
              <EmptyState message={t("home.noNews")} />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {latestNews.map((item) => (
                <article key={item.id} className="rounded-2xl border border-pitch-100 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gold-600">
                    {new Date(item.date).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-1 font-bold text-pitch-900">
                    {lang === "ar" ? item.titleAr || item.title : item.title}
                  </h3>
                  <p className="mt-2 text-sm text-pitch-600 line-clamp-4">
                    {lang === "ar" ? item.bodyAr || item.body : item.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Latest results & upcoming matches */}
        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-pitch-900">{t("home.latestResults")}</h2>
              <Link to="/matches" className="text-sm font-semibold text-pitch-600 hover:text-gold-600">
                {t("home.viewAll")}
              </Link>
            </div>
            {recentResults.length === 0 ? (
              <div className="mt-4">
                <EmptyState message={t("home.noMatches")} />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {recentResults.map((m) => (
                  <MatchCard key={m.id} match={m} teams={teams} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-pitch-900">{t("home.upcomingMatches")}</h2>
              <Link to="/matches" className="text-sm font-semibold text-pitch-600 hover:text-gold-600">
                {t("home.viewAll")}
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="mt-4">
                <EmptyState message={t("home.noMatches")} />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {upcoming.map((m) => (
                  <MatchCard key={m.id} match={m} teams={teams} />
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
