import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "nursing-lang";

const LanguageContext = createContext({
  lang: "ar",
  dir: "rtl",
  setLang: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "ar",
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={value.dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
