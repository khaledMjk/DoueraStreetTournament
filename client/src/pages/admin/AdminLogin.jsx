import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate(location.state?.from || "/admin", { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch {
      setError(t("admin.login.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch-900 pitch-texture px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-400 bg-pitch-900 text-2xl">
            ⚽
          </span>
        </div>
        <h1 className="mt-4 text-center text-xl font-extrabold text-pitch-900">
          {t("admin.login.title")}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-pitch-700 mb-1">
              {t("admin.login.username")}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-pitch-200 px-3 py-2 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-pitch-700 mb-1">
              {t("admin.login.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-pitch-200 px-3 py-2 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
            />
          </div>

          {error && <p className="text-sm font-semibold text-crimson-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gold-400 py-2.5 font-bold text-pitch-900 transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? t("common.saving") : t("admin.login.submit")}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-pitch-500 hover:text-gold-600">
            ← {t("admin.login.backToSite")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
