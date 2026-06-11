import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === "ar";

  return (
    <footer className="mt-16 bg-pitch-950 text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-400 bg-pitch-800 text-base">
            ⚽
          </span>
          <div>
            <p className="font-bold text-white">
              {isAr ? settings?.nameAr : settings?.name || t("nav.brand")}
            </p>
            {settings?.season && (
              <p className="text-xs text-white/50">{t("home.heroBadge")}</p>
            )}
          </div>
        </div>

        {settings?.contactFacebook && (
          <a
            href={settings.contactFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-gold-400 hover:text-gold-300 transition-colors"
          >
            Facebook
          </a>
        )}
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
        © {settings?.season || "2026"} — {isAr ? settings?.nameAr : settings?.name}
      </div>
    </footer>
  );
}
