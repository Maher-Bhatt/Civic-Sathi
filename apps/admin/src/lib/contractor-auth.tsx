import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ContractorSession {
  id: string;
  contractorId: string;
  companyName: string;
  contactPerson: string;
  email: string;
}

interface ContractorAuthContextValue {
  contractor: ContractorSession | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<ContractorSession>;
  signOut: () => Promise<void>;
}

const CTX = createContext<ContractorAuthContextValue | null>(null);

const LS_KEY = "janmind.contractor_session";
const CONTRACTORS_KEY = "janmind.contractors";

const DEMO_SESSION: ContractorSession = {
  id: "session_ctr",
  contractorId: "CTR-001",
  companyName: "Bharat Infrastructure Pvt Ltd",
  contactPerson: "Suresh Patel",
  email: "suresh.patel@bharatinfra.in",
};

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function ContractorAuthProvider({ children }: { children: React.ReactNode }) {
  const [contractor, setContractor] = useState<ContractorSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readLS<ContractorSession | null>(LS_KEY, null);
    setContractor(session);
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, _password: string): Promise<ContractorSession> => {
    await new Promise(r => setTimeout(r, 500));
    if (!email.trim()) throw new Error("Email is required");
    // Look up contractor by email in shared store
    const contractors = readLS<Array<{ id: string; companyName: string; contactPerson: string; email: string }>>(CONTRACTORS_KEY, []);
    const match = contractors.find(c => c.email.toLowerCase() === email.toLowerCase());
    const session: ContractorSession = match
      ? { id: `session_${match.id}`, contractorId: match.id, companyName: match.companyName, contactPerson: match.contactPerson, email: match.email }
      : { ...DEMO_SESSION, email };
    localStorage.setItem(LS_KEY, JSON.stringify(session));
    setContractor(session);
    return session;
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(LS_KEY);
    setContractor(null);
  }, []);

  const value = useMemo(() => ({ contractor, ready, signIn, signOut }), [contractor, ready, signIn, signOut]);
  return <CTX.Provider value={value}>{children}</CTX.Provider>;
}

export function useContractorAuth() {
  const ctx = useContext(CTX);
  if (!ctx) throw new Error("useContractorAuth must be inside ContractorAuthProvider");
  return ctx;
}
