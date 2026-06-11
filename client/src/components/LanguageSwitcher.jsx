import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();

  function setLang(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <div className={`inline-flex items-center rounded-full border border-white/20 bg-white/5 p-1 text-sm font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`rounded-full px-3 py-1 transition-colors cursor-pointer ${
          i18n.language === "fr" ? "bg-gold-400 text-pitch-900" : "text-white/80 hover:text-white"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`rounded-full px-3 py-1 transition-colors cursor-pointer ${
          i18n.language === "ar" ? "bg-gold-400 text-pitch-900" : "text-white/80 hover:text-white"
        }`}
      >
        ع
      </button>
    </div>
  );
}
