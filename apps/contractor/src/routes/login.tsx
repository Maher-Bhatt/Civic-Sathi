import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { GlassCard } from "@/components/ui/glass-card";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Contractor Login - JANMIND" }] }),
  component: ContractorLogin,
});

function ContractorLogin() {
  const { signIn } = useContractorAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate({ to: "/contractor/dashboard" as any });
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] muni-page-enter p-4">
      <GlassCard className="w-full max-w-md p-8 glass-strong shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">JANMIND</h1>
          <p className="text-[var(--muted-foreground)]">Contractor Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-[var(--critical)]/10 border border-[var(--critical)]/20 text-[var(--critical)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="suresh.patel@bharatinfra.in"
              required
            />
          </div>

          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action-btn primary w-full py-3 rounded-md font-medium text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50 press"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[var(--muted-foreground)]">
          <p>Sign in with your registered contractor account.</p>
          <p>Contact your administrator if you need access.</p>
        </div>
      </GlassCard>
    </div>
  );
}
