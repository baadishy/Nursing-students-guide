import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLanguage();
  return (
    <button
      className={`px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold ${className}`}
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
    >
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}
