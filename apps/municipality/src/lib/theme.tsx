import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";

const STORAGE_KEY = "civicsathi.theme";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: "dark" | "light";
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  resolved: "light",
  setMode: () => {},
});

/** Inlined in the document head so the theme is applied before first paint. Default: light */
export const themeInitScript = `(function(){try{var m=localStorage.getItem("${STORAGE_KEY}")||"light";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.remove("dark");}})();`;

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [resolved, setResolved] = useState<"dark" | "light">("light");

  const apply = useCallback((next: ThemeMode) => {
    const dark = next === "dark" || (next === "system" && systemPrefersDark());
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? "light";
    setModeState(stored);
    apply(stored);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
    },
    [apply],
  );

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
