import React, { createContext, useContext, useEffect, useState } from "react";
import { type Language, TRANSLATIONS } from "./translations";

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("janmind-lang") as Language;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("janmind-lang", lang);
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string) => {
    const dict = TRANSLATIONS[language];
    return dict[key] || TRANSLATIONS["en"][key] || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
