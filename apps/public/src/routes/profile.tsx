import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { EmptyState } from "@/components/ui/states";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { changePassword, getMyCivicReputation, updateCivicReputationPreferences } from "@/services/api";
import type { ReputationMe } from "@/services/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Civic Sathi" },
      {
        name: "description",
        content: "Manage your Civic Sathi citizen profile, civic identity and notification settings.",
      },
      { property: "og:title", content: "Profile — Civic Sathi" },
      {
        property: "og:description",
        content: "Your verified civic contributions, impact and privacy controls on Civic Sathi.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/profile">
      <ProfilePage />
    </AuthGate>
  ),
});

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="press flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-[var(--glass)] px-4 py-3 text-left hover:bg-[var(--glass-strong)]"
    >
      <span className="text-sm">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)]",
        )}
      >
        <span
          className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform duration-200 ease-out"
          style={{ transform: checked ? "translateX(16px)" : "none" }}
        />
      </span>
    </button>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function ProfilePage() {
  const { user, ready, save, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", ward: "" });
  const [busy, setBusy] = useState(false);
  const [reputation, setReputation] = useState<ReputationMe | null>(null);
  const [reputationBusy, setReputationBusy] = useState(false);
  const [reputationMessage, setReputationMessage] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, phone: user.phone, ward: user.ward });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setReputationBusy(true);
    void getMyCivicReputation()
      .then((data) => {
        if (active) setReputation(data);
      })
      .catch(() => {
        if (active) setReputationMessage("Civic identity data is temporarily unavailable. Your core account is still safe.");
      })
      .finally(() => {
        if (active) setReputationBusy(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function updateReputationPreferences(patch: Record<string, unknown>) {
    if (!reputation) return;
    setReputationBusy(true);
    setReputationMessage("");
    try {
      const profile = await updateCivicReputationPreferences(patch);
      setReputation((current) => (current ? { ...current, profile } : current));
      setReputationMessage("Civic identity privacy settings updated.");
    } catch {
      setReputationMessage("We could not update that preference. Please retry.");
    } finally {
      setReputationBusy(false);
    }
  }

  if (!ready) return <PageShell className="max-w-4xl">{null}</PageShell>;

  if (!user) {
    return (
      <PageShell className="max-w-2xl">
        <EmptyState
          title={t("profile.not_signed_in", "You're not signed in")}
          description={t(
            "profile.sign_in_prompt",
            "Sign in to manage your profile and notification settings.",
          )}
          actionLabel={t("auth.sign_in", "Sign in")}
          onAction={() => navigate({ to: "/login", search: { redirect: undefined } })}
        />
      </PageShell>
    );
  }

  const civic = reputation?.profile;
  const levelProgress = civic?.level_progress_pct ?? 0;

  return (
    <PageShell className="max-w-5xl">
      <div className="animate-rise space-y-2">
        <SectionLabel>{t("nav.profile", "My Civic Identity")}</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">{t("profile.title", "Profile")}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Your civic progress is based on verified contributions and real outcomes. Core Civic Sathi services never require XP or badges.
        </p>
      </div>

      {reputationMessage ? (
        <p className="mt-4 rounded-xl border border-border bg-[var(--glass)] px-4 py-3 text-sm text-muted-foreground" role="status">
          {reputationMessage}
        </p>
      ) : null}

      <GlassCard elevation="raised" className="animate-rise mt-6 overflow-hidden p-0">
        <div className="bg-[linear-gradient(120deg,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_58%)] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <SectionLabel>Civic progress</SectionLabel>
              <h2 className="mt-2 text-2xl font-semibold">{civic?.level_name ?? "Civic Observer"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Level {civic?.level ?? 1} · {civic?.xp_total ?? 0} XP · {civic?.impact_score ?? 0} Civic Impact
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/35 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Verified contributions</p>
              <p className="mt-1 text-2xl font-semibold">{civic?.verified_contributions ?? 0}</p>
              <p className="text-xs text-muted-foreground">{civic?.resolutions_supported ?? 0} resolutions supported</p>
            </div>
          </div>
          <div className="mt-6" aria-label={`Level progress: ${levelProgress}%`}>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{civic?.current_level_xp ?? 0} XP at this level</span>
              <span>{civic?.next_level_xp ?? 0} XP next level</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
        </div>
        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
          {[
            ["Civic reputation", civic?.reputation_score ?? 0, "Quality and verified trust"],
            ["Civic Impact", civic?.impact_score ?? 0, "Outcome-weighted contribution"],
            ["Current streak", civic?.streak_days ?? 0, "Meaningful activity days"],
          ].map(([label, value, hint]) => (
            <div className="bg-background/80 p-4" key={String(label)}>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="animate-rise space-y-5 p-5 sm:p-7">
          <div>
            <SectionLabel>Recognition earned</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Achievements</h2>
          </div>
          {reputationBusy && !reputation ? <p className="text-sm text-muted-foreground">Loading verified achievements…</p> : null}
          {!reputationBusy && !reputation?.badges.length ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Your Civic Journey Starts Here</p>
              <p className="mt-1">Report your first genuine civic issue and begin building Civic Impact.</p>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {reputation?.badges.map((badge) => (
              <div className="rounded-xl border border-border bg-[var(--glass)] p-4" key={badge.code}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium">{badge.name}</h3>
                  <span aria-hidden="true" className="text-primary">◆</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{badge.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">Awarded {formatDate(badge.awarded_at)}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="animate-rise space-y-5 p-5 sm:p-7">
          <div>
            <SectionLabel>Optional participation</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Privacy and recognition</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your complaint details, contact information, and precise private locations are never made public through recognition features.</p>
          {civic ? (
            <>
              <Toggle
                label="Show me in Civic Contributors"
                checked={civic.leaderboard_opt_in}
                onChange={(value) => void updateReputationPreferences({ leaderboard_opt_in: value })}
              />
              <Toggle
                label="Allow achievement sharing"
                checked={civic.sharing_opt_in}
                onChange={(value) => void updateReputationPreferences({ sharing_opt_in: value })}
              />
              <Toggle
                label="Use subtle celebration animation"
                checked={civic.animation_enabled}
                onChange={(value) => void updateReputationPreferences({ animation_enabled: value })}
              />
              <Toggle
                label="Reward and mission notifications"
                checked={civic.reward_notifications_enabled}
                onChange={(value) => void updateReputationPreferences({ reward_notifications_enabled: value })}
              />
            </>
          ) : <p className="text-sm text-muted-foreground">Privacy controls will appear when civic identity data is available.</p>}
          <div>
            <p className="mb-2 text-sm font-medium">Public display name</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Public display name">
              {(["initials", "first_name", "alias"] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => void updateReputationPreferences({ display_mode: mode })}
                  className={cn(
                    "rounded-full border px-3 py-2 text-xs transition-colors",
                    civic?.display_mode === mode ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mode === "initials" ? "M Maher" : mode === "first_name" ? "Maher" : "Civic Guardian #482"}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <GlassCard className="animate-rise space-y-5 p-5 sm:p-7">
          <div>
            <SectionLabel>Real city progress</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">City impact</h2>
          </div>
          {!reputation?.city_impact.length ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No city impact has been recorded for your account yet.</p>
          ) : (
            <div className="space-y-3">
              {reputation.city_impact.map((city) => (
                <div className="rounded-xl border border-border bg-[var(--glass)] p-4" key={city.city_name}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{city.city_name}</h3>
                    <span className="text-sm font-semibold">{city.impact_points} impact</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{city.verified_reports} verified reports · {city.resolved_reports} resolved reports · {city.contributing_citizens} contributing citizens</p>
                  {city.milestone ? <p className="mt-2 text-xs text-primary">Milestone: {city.milestone}</p> : null}
                </div>
              ))}
            </div>
          )}
          {reputation?.missions.length ? (
            <div className="border-t border-border pt-5">
              <SectionLabel>Optional missions</SectionLabel>
              <div className="mt-3 space-y-3">
                {reputation.missions.map((mission) => (
                  <div className="rounded-xl border border-border p-3" key={mission.code}>
                    <div className="flex justify-between gap-3 text-sm"><span className="font-medium">{mission.title}</span><span>{mission.progress}/{mission.target}</span></div>
                    <p className="mt-1 text-xs text-muted-foreground">{mission.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </GlassCard>

        <GlassCard className="animate-rise space-y-5 p-5 sm:p-7">
          <div>
            <SectionLabel>Explainable activity</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Recent civic ledger</h2>
          </div>
          {!reputation?.transactions.length ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Your verified civic rewards will appear here with the reason and source behind each entry.</p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border">
              {reputation.transactions.map((transaction) => (
                <div className="flex flex-wrap items-start justify-between gap-3 p-4" key={transaction.id}>
                  <div>
                    <p className="font-medium">{transaction.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{transaction.source_type} · {formatDate(transaction.at)}</p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-sm font-semibold", transaction.amount >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
                    {transaction.amount >= 0 ? "+" : ""}{transaction.amount} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard elevation="raised" className="animate-rise mt-5 space-y-5 p-5 sm:p-7">
        <div>
          <SectionLabel>Account controls</SectionLabel>
          <h2 className="mt-2 text-xl font-semibold">Profile details</h2>
        </div>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await save(form);
              toast.success("Profile updated");
            } catch {
              toast.error("Failed to update profile");
            } finally {
              setBusy(false);
            }
          }}
        >
          <GlassInput label={t("ui.name")} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <GlassInput label={t("ui.email")} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <GlassInput label={t("ui.phone")} type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <GlassInput label={t("ui.preferred_ward")} value={form.ward} hint="Used to surface civic activity near you." onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))} />
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <GlassButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</GlassButton>
            <GlassButton variant="glass" type="button" onClick={async () => { await changePassword(); toast.success("Password reset link sent"); }}>{t("ui.change_password")}</GlassButton>
            <GlassButton variant="outline" type="button" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>{t("ui.log_out")}</GlassButton>
          </div>
        </form>
      </GlassCard>
    </PageShell>
  );
}
