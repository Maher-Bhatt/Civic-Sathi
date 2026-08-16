import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adminLogin, adminLogout, getAdminUser } from "@/services/shared-store";
import type { AdminUser } from "@/services/types";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AdminUser>;
  signOut: () => Promise<void>;
}

const CTX = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAdminUser().then(setAdmin).finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const a = await adminLogin(email, password);
    setAdmin(a);
    return a;
  }, []);

  const signOut = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, ready, signIn, signOut }), [admin, ready, signIn, signOut]);
  return <CTX.Provider value={value}>{children}</CTX.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(CTX);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
