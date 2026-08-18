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
import { changePassword } from "@/services/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Civic Sathi" },
      {
        name: "description",
        content: "Manage your Civic Sathi citizen profile, ward preference and notification settings.",
      },
      { property: "og:title", content: "Profile — Civic Sathi" },
      {
        property: "og:description",
        content: "Your contact details and notification preferences on Civic Sathi.",
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
    const { t } = useI18n();
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

function ProfilePage() {
  const { user, ready, save, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", ward: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, phone: user.phone, ward: user.ward });
  }, [user]);

  if (!ready) return <PageShell className="max-w-2xl">{null}</PageShell>;

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

  return (
    <PageShell className="max-w-2xl">
      <div className="animate-rise space-y-2">
        <SectionLabel>{t("nav.profile", "Account")}</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">{t("profile.title", "Profile")}</h1>
      </div>

      <GlassCard elevation="raised" className="animate-rise mt-6 space-y-5 p-5 sm:p-7">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await save(form);
              toast.success("Profile updated");
            } catch (error) {
              toast.error("Failed to update profile");
            } finally {
              setBusy(false);
            }
          }}
        >
          <GlassInput
            label={t('ui.name')}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <GlassInput
            label={t('ui.email')}
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <GlassInput
            label={t('ui.phone')}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <GlassInput
            label={t('ui.preferred_ward')}
            value={form.ward}
            hint="Used to surface civic activity near you."
            onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))}
          />
          <GlassButton type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save changes"}
          </GlassButton>
        </form>
      </GlassCard>

      <GlassCard className="animate-rise mt-5 space-y-3 p-5 sm:p-7">
        <SectionLabel>{t('ui.notification_settings')}</SectionLabel>
        <Toggle
          label={t('ui.status_updates_on_my_complaint')}
          checked={user.notifyStatus}
          onChange={(v) => void save({ notifyStatus: v })}
        />
        <Toggle
          label={t('ui.nearby_civic_patterns_in_my_wa')}
          checked={user.notifyNearby}
          onChange={(v) => void save({ notifyNearby: v })}
        />
      </GlassCard>

      <GlassCard className="animate-rise mt-5 flex flex-wrap gap-2 p-5 sm:p-7">
        <GlassButton
          variant="glass"
          onClick={async () => {
            await changePassword();
            toast.success("Password reset link sent");
          }}
        >
          {t('ui.change_password')}</GlassButton>
        <GlassButton
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
        >
          {t('ui.log_out')}</GlassButton>
      </GlassCard>
    </PageShell>
  );
}
