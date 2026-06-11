import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();

  const cards = [
    { to: "/admin/teams", title: t("admin.dashboard.teamsCard"), desc: t("admin.dashboard.teamsDesc"), icon: "👕" },
    { to: "/admin/matches", title: t("admin.dashboard.matchesCard"), desc: t("admin.dashboard.matchesDesc"), icon: "📅" },
    { to: "/admin/groups", title: t("admin.dashboard.groupsCard"), desc: t("admin.dashboard.groupsDesc"), icon: "🏆" },
    { to: "/admin/news", title: t("admin.dashboard.newsCard"), desc: t("admin.dashboard.newsDesc"), icon: "📣" },
    { to: "/admin/settings", title: t("admin.dashboard.settingsCard"), desc: t("admin.dashboard.settingsDesc"), icon: "⚙️" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-pitch-900">{t("admin.dashboard.title")}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl border border-pitch-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{card.icon}</span>
            <h2 className="mt-3 font-bold text-pitch-900">{card.title}</h2>
            <p className="mt-1 text-sm text-pitch-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
