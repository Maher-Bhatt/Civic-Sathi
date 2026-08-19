import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Settings, Shield, Server } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings | Admin | Civic Sathi" }] }),
  component: AdminSettings,
});

function AdminSettings() {
    const { t } = useI18n();
  const { admin } = useAdminAuth();

  

  return (
    <div className="space-y-6 muni-page-enter max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('ui.platform_settings')}</h1>
        <p className="text-[var(--muted-foreground)]">{t('ui.system_configuration_and_admin')}</p>
      </div>

      <div className="grid gap-6">
        <GlassCard className="p-6">
          <SectionLabel>{t('ui.global_notification_settings')}</SectionLabel>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.platform_name')}</p>
              <p className="font-medium">{t('ui.civicsathi_civic_infrastructure_p')}</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.environment')}</p>
              <p className="font-medium">Production — live API services</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.version')}</p>
              <p className="font-medium font-mono">Civic Sathi Platform 1.0</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.storage_mode')}</p>
              <p className="font-medium">PostgreSQL via Civic Sathi API</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionLabel>{t('ui.security_authentication')}</SectionLabel>
          <div className="mt-4 flex items-center gap-4 p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            <div className="w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center text-lg font-bold">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-medium text-lg">{admin?.name}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{admin?.email}</p>
              <div className="mt-1 inline-flex px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)]">
                {admin?.role}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-[var(--glass-border)]">
          <SectionLabel>{t('ui.security_authentication')}</SectionLabel>
          <div className="mt-4 flex items-start gap-3 p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            <Server className="w-5 h-5 mt-0.5 text-[var(--success)]" />
            <div>
              <p className="font-medium">Production data protection enabled</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Destructive database resets are disabled from the browser. Manage users, contractors, tenders, work orders, and permissions through their dedicated authenticated controls.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
