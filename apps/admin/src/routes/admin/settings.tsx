import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Settings, Shield, Trash2, Server } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings | Admin | CivicSathi" }] }),
  component: AdminSettings,
});

function AdminSettings() {
    const { t } = useI18n();
  const { admin } = useAdminAuth();

  const handleClearData = () => {
    if (confirm("WARNING: This will clear all shared prototype data from local storage. This action cannot be undone. Are you sure?")) {
      const keysToRemove = [
        'jm_shared_contractors',
        'jm_shared_work_orders',
        'jm_shared_audit_logs',
        'jm_shared_sla_rules'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      toast.success("Prototype data cleared successfully. Reload the page to re-initialize defaults.");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

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
              <p className="font-medium">{t('ui.prototype_demo')}</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.version')}</p>
              <p className="font-medium font-mono">{t('ui.v1_0_0_prototype')}</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.storage_mode')}</p>
              <p className="font-medium">{t('ui.browser_localstorage')}</p>
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

        <GlassCard className="p-6 border-[var(--critical)]/30">
          <SectionLabel className="text-[var(--critical)]">{t('ui.danger_zone')}</SectionLabel>
          <div className="mt-4 p-4 rounded-md bg-[var(--critical)]/5 border border-[var(--critical)]/20">
            <h3 className="font-medium text-[var(--critical)] mb-2">{t('ui.reset_prototype_data')}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              {t('ui.this_will_clear_all_shared_pro')}</p>
            <button
              onClick={handleClearData}
              className="action-btn flex items-center gap-2 bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent press"
            >
              <Trash2 className="w-4 h-4" /> {t('ui.clear_all_data')}</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
