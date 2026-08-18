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

interface MuniAuthContextValue {
  officer: Officer | null;
  ready: boolean;
  settings: MuniSettings | null;
  signIn: (email: string, password: string, city: CityId) => Promise<Officer>;
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
    Promise.all([getMuniOfficer(), getMuniSettings()])
      .then(([o, s]) => {
        setOfficer(o as any);
        setSettings(s as any);
      })
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email: string, password: string, city: CityId) => {
    const o = await muniLogin({ email, password, city });
    setOfficer(o as any);
    return o as any;
  }, []);

  const signOut = useCallback(async () => {
    await muniLogout();
    setOfficer(null);
  }, []);

  const updateSettings = useCallback(async (patch: Partial<MuniSettings>) => {
    const s = await saveMuniSettings(patch);
    setSettings(s as any);
    return s as any;
  }, []);

  const refreshSettings = useCallback(async () => {
    const s = await getMuniSettings();
    setSettings(s as any);
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
