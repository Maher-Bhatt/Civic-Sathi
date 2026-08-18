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
    const saved = localStorage.getItem("civicsathi-lang") as Language;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("civicsathi-lang", lang);
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string) => {
    const dict = TRANSLATIONS[language];
    if (dict && dict[key]) return dict[key];
    if (TRANSLATIONS["en"] && TRANSLATIONS["en"][key]) return TRANSLATIONS["en"][key];
    if (fallback) return fallback;
    if (key.startsWith("ui.")) {
      const cleaned = key.replace(/^ui\./, "").replace(/_/g, " ");
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return key;
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
