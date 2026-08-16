import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, updateProfile } from "@/services/api";
import type { User } from "@/services/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<User>;
  signOut: () => Promise<void>;
  save: (patch: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await loginUser({ email, password });
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; phone: string; password: string }) => {
      const u = await registerUser(input);
      setUser(u);
      return u;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const save = useCallback(async (patch: Partial<User>) => {
    const u = await updateProfile(patch);
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signOut, save }),
    [user, ready, signIn, signUp, signOut, save],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
