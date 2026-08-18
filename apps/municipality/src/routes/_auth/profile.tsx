import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { safeFormat } from "@/lib/safe-format";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getCity } from "@/services/cities";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/profile")({
  head: () => ({ meta: [{ title: "Profile — Municipal Intelligence" }] }),
  component: ProfilePage,
});

function ProfilePage() {
    const { t } = useI18n();
  const { officer, ready, signOut } = useMuniAuth();
  const navigate = useNavigate();

  if (!ready || !officer) return <LoadingState message="Loading profile..." />;

  const city = getCity(officer.city);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    void navigate({ to: "/login" as any });
  }

  return (
    <div className="muni-page-enter mx-auto max-w-lg space-y-6">
      <header>
        <SectionLabel>{t('ui.officer_profile')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{officer.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{officer.email}</p>
      </header>

      <GlassCard elevation="raised" className="p-6">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('ui.officer_id')}</dt>
            <dd className="font-medium tabular-nums">{officer.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('ui.department')}</dt>
            <dd className="font-medium">{officer.department}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('ui.role')}</dt>
            <dd className="font-medium">{officer.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('ui.city')}</dt>
            <dd className="font-medium">{city?.name ?? officer.city}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('ui.last_active')}</dt>
            <dd>{safeFormat(officer.lastActive, "dd MMM yyyy, HH:mm")}</dd>
          </div>
        </dl>
      </GlassCard>

      <p className="text-center text-xs text-muted-foreground">
        {t('ui.frontend_only_mock_authenticat')}</p>

      <GlassButton variant="outline" className="w-full" onClick={() => void handleSignOut()}>
        <LogOut className="h-4 w-4" />
        {t('ui.sign_out')}</GlassButton>
    </div>
  );
}
