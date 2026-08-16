import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { contractorLogin, contractorLogout, getContractorUser } from "@/services/api";
import type { User } from "@janmind/api-client";

interface ContractorAuthContextValue {
  contractor: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const CTX = createContext<ContractorAuthContextValue | null>(null);

export function ContractorAuthProvider({ children }: { children: React.ReactNode }) {
  const [contractor, setContractor] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getContractorUser()
      .then(setContractor)
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    const user = await contractorLogin({ email, password, city: "vadodara" });
    setContractor(user);
    return user;
  }, []);

  const signOut = useCallback(async () => {
    await contractorLogout();
    setContractor(null);
  }, []);

  const value = useMemo(
    () => ({ contractor, ready, signIn, signOut }),
    [contractor, ready, signIn, signOut],
  );

  return <CTX.Provider value={value}>{children}</CTX.Provider>;
}

export function useContractorAuth() {
  const ctx = useContext(CTX);
  if (!ctx) throw new Error("useContractorAuth must be inside ContractorAuthProvider");
  return ctx;
}
