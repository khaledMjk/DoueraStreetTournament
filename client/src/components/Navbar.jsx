import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-semibold transition-colors";
const linkActive = "bg-gold-400 text-pitch-900";
const linkInactive = "text-white/85 hover:bg-white/10 hover:text-white";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/teams", label: t("nav.teams") },
    { to: "/groups", label: t("nav.groups") },
    { to: "/matches", label: t("nav.matches") },
    { to: "/stats", label: t("nav.stats") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pitch-900 pitch-texture shadow-lg shadow-pitch-950/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold-400 bg-pitch-800 text-lg">
            ⚽
          </span>
          <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
            {t("nav.brand")}
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white cursor-pointer"
          aria-label="Menu"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-pitch-900 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
