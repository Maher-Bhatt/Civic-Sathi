import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getMuniOfficer,
  getMuniSettings,
  muniLogin,
  muniLogout,
  saveMuniSettings,
} from "@/services/api";
import type { CityId } from "@/services/cities";
import type { MuniSettings, Officer } from "@/services/types";

const DEFAULT_SETTINGS: MuniSettings = {
  theme: "system",
  compactMode: false,
  defaultCity: "mumbai",
  defaultMapMode: "health",
  notifications: { critical: true, assignments: true, riskChanges: true, dailyDigest: false },
};

interface MuniAuthContextValue {
  officer: Officer | null;
  ready: boolean;
  settings: MuniSettings | null;
  signIn: (email: string, password: string, city?: CityId, designation?: string) => Promise<Officer>;
  signOut: () => Promise<void>;
  updateSettings: (patch: Partial<MuniSettings>) => Promise<MuniSettings>;
  refreshSettings: () => Promise<void>;
}

const MuniAuthContext = createContext<MuniAuthContextValue | null>(null);

export function MuniAuthProvider({ children }: { children: React.ReactNode }) {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [settings, setSettings] = useState<MuniSettings | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const timeout = <T,>(fallback: T, ms = 4500) =>
      new Promise<T>((resolve) => window.setTimeout(() => resolve(fallback), ms));

    const bootstrap = async () => {
      const [officerResult, settingsResult] = await Promise.allSettled([
        Promise.race([getMuniOfficer(), timeout<Officer | null>(null)]),
        Promise.race([getMuniSettings(), timeout<MuniSettings>(DEFAULT_SETTINGS)]),
      ]);
      if (!active) return;
      setOfficer(officerResult.status === "fulfilled" ? officerResult.value : null);
      setSettings(
        settingsResult.status === "fulfilled" ? settingsResult.value : DEFAULT_SETTINGS,
      );
      setReady(true);
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, city?: CityId, designation?: string) => {
    const o = await muniLogin({
      email,
      password,
      ...(city ? { city } : {}),
      ...(designation ? { designation } : {}),
    });
    setOfficer(o);
    return o;
  }, []);

  const signOut = useCallback(async () => {
    await muniLogout();
    setOfficer(null);
  }, []);

  const updateSettings = useCallback(async (patch: Partial<MuniSettings>) => {
    const s = await saveMuniSettings(patch);
    setSettings(s);
    return s;
  }, []);

  const refreshSettings = useCallback(async () => {
    const s = await getMuniSettings();
    setSettings(s);
  }, []);

  const value = useMemo(
    () => ({ officer, ready, settings, signIn, signOut, updateSettings, refreshSettings }),
    [officer, ready, settings, signIn, signOut, updateSettings, refreshSettings],
  );

  return <MuniAuthContext.Provider value={value}>{children}</MuniAuthContext.Provider>;
}

export function useMuniAuth() {
  const ctx = useContext(MuniAuthContext);
  if (!ctx) throw new Error("useMuniAuth must be used inside MuniAuthProvider");
  return ctx;
}
