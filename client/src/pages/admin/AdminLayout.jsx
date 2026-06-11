import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const linkBase = "block rounded-lg px-3 py-2 text-sm font-semibold transition-colors";
const linkActive = "bg-gold-400 text-pitch-900";
const linkInactive = "text-white/80 hover:bg-white/10 hover:text-white";

export default function AdminLayout() {
  const { t } = useTranslation();
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: t("admin.dashboard.title"), end: true },
    { to: "/admin/teams", label: t("admin.dashboard.teamsCard") },
    { to: "/admin/matches", label: t("admin.dashboard.matchesCard") },
    { to: "/admin/groups", label: t("admin.dashboard.groupsCard") },
    { to: "/admin/news", label: t("admin.dashboard.newsCard") },
    { to: "/admin/settings", label: t("admin.dashboard.settingsCard") },
  ];

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-sand-50 lg:flex">
      <aside className="bg-pitch-900 pitch-texture text-white lg:w-64 lg:shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-4 lg:max-w-none">
          <div className="flex items-center justify-between lg:flex-col lg:items-stretch lg:gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-400 bg-pitch-800 text-base">
                ⚽
              </span>
              <span className="font-extrabold">{t("nav.brand")}</span>
            </Link>
            <LanguageSwitcher className="lg:hidden" />
          </div>

          <nav className="mt-4 flex gap-1 overflow-x-auto pb-2 lg:mt-6 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `${linkBase} whitespace-nowrap ${isActive ? linkActive : linkInactive}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 hidden lg:block space-y-3 border-t border-white/10 pt-4">
            <LanguageSwitcher />
            <p className="text-sm text-white/60">
              {t("admin.dashboard.welcome")}, <span className="font-semibold text-white">{username}</span>
            </p>
            <Link to="/" className="block text-sm font-semibold text-white/70 hover:text-gold-300">
              {t("admin.dashboard.viewSite")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-white/20 py-2 text-sm font-bold text-white/85 hover:bg-white/10 cursor-pointer"
            >
              {t("nav.logout")}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between border-b border-pitch-100 bg-white px-4 py-3 lg:hidden">
          <p className="text-sm text-pitch-600">
            {t("admin.dashboard.welcome")}, <span className="font-semibold text-pitch-900">{username}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-pitch-200 px-3 py-1.5 text-sm font-bold text-pitch-700 cursor-pointer"
          >
            {t("nav.logout")}
          </button>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
