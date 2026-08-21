import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeFormat } from "@/lib/safe-format";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getCity } from "@/services/cities";
import { getMyCivicRolePerformance } from "@/services/api";
import type { CivicRolePerformance } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/profile")({
  head: () => ({ meta: [{ title: "Profile — Municipal Intelligence" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const { officer, ready, signOut } = useMuniAuth();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<CivicRolePerformance | null>(null);
  const [performanceError, setPerformanceError] = useState("");

  useEffect(() => {
    if (!officer) return;
    let active = true;
    void getMyCivicRolePerformance()
      .then((data) => { if (active) setPerformance(data); })
      .catch(() => { if (active) setPerformanceError("Live Civic Performance is temporarily unavailable."); });
    return () => { active = false; };
  }, [officer]);

  if (!ready || !officer) return <LoadingState message="Loading profile..." />;

  const city = getCity(officer.city);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    void navigate({ to: "/login" as any });
  }

  const metrics = performance?.metrics ?? {};

  return (
    <div className="muni-page-enter mx-auto max-w-3xl space-y-6">
      <header>
        <SectionLabel>{t("ui.officer_profile")}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{officer.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{officer.email}</p>
      </header>

      <GlassCard elevation="raised" className="p-6">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.officer_id")}</dt><dd className="font-medium tabular-nums">{officer.id}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.department")}</dt><dd className="font-medium">{officer.department}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.role")}</dt><dd className="font-medium">{officer.role}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.city")}</dt><dd className="font-medium">{city?.name ?? officer.city}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.last_active")}</dt><dd>{safeFormat(officer.lastActive, "dd MMM yyyy, HH:mm")}</dd></div>
        </dl>
      </GlassCard>

      <GlassCard elevation="raised" className="space-y-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>Civic Performance</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Verified municipal outcomes</h2>
          </div>
          {performance ? <div className="text-right"><p className="text-3xl font-semibold">{performance.score}/100</p><p className="text-xs text-muted-foreground">Private role view</p></div> : null}
        </div>
        {performanceError ? <p className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground" role="status">{performanceError}</p> : null}
        {!performance && !performanceError ? <p className="text-sm text-muted-foreground">Loading verified municipal metrics…</p> : null}
        {performance ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Handled complaints" value={metrics["handled_complaints"] ?? 0} />
            <Metric label="Resolved complaints" value={metrics["resolved_complaints"] ?? 0} />
            <Metric label="Resolution rate" value={`${metrics["resolution_rate"] ?? 0}%`} />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">The current score is based on live complaint outcomes. SLA adherence, citizen confirmation, inspection quality, and rework signals will expand the score as those verified workflow events are available.</p>
      </GlassCard>

      <p className="text-center text-xs text-muted-foreground">{t("ui.frontend_only_mock_authenticat")}</p>

      <GlassButton variant="outline" className="w-full" onClick={() => void handleSignOut()}>
        <LogOut className="h-4 w-4" />
        {t("ui.sign_out")}
      </GlassButton>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-xl border border-border bg-[var(--glass)] p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{String(value)}</p></div>;
}
